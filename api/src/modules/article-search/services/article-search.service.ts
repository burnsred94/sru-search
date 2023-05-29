import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { ArticleSearchDto } from '../dto/article-search.dto';
import { ConfigService } from '@nestjs/config';
import { IResponseGeo } from 'src/interfaces/responses/response.geo.interface';
import { EntityParseArticle } from '../entities/parse-article.entity';
import { compact, forEach, iteratee, map, uniqBy } from 'lodash';
import { ParseUrlEntity } from '../entities/parse-url-search.entity';
import { FetchGeoProvider } from '../providers/fetch.geo.provider';
import { SearchProvider } from '../providers/search.provider';
import { ResultSearchEntity } from '../entities/result-search.entity';

@Injectable()
export class ArticleSearchService {
  constructor(
    private readonly searchProvider: SearchProvider,
    private readonly fetchGeoProvider: FetchGeoProvider,
  ) { }

  async search(query: ArticleSearchDto) {
    let iterator = 0;
    const dataUrl = await this.fetchGeoProvider.fetchGeo(query);
    const dataR = [];

    while (dataUrl.length > iterator) {
      const { url, article, keys } = dataUrl[iterator];

      const dataResult = map(url, async (urlString, index) => {
        const search = await this.searchProvider.search(
          urlString,
          Number(article),
        );
        if (search === 0 && url.length === index + 1 && search !== undefined) {
          const result = new ResultSearchEntity(keys, search);
          return { ...result };
        } else if (search !== 0) {
          const result = new ResultSearchEntity(
            keys,
            Number(String(index + 1) + String(search)),
          );
          return { ...result };
        }
        return new ResultSearchEntity(keys, search)
      });

      const results = await Promise.all(dataResult);
      dataResult.length === 0 ? null : dataR.push(...results);

      iterator += 1;
    }

    if (dataUrl.length === iterator) {
      const compactResult = compact(dataR);
      return {
        address: query.address,
        result: uniqBy(compactResult, 'key')
      };
    }
  }
}
