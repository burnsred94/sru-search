import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { ArticleSearchDto } from '../dto/article-search.dto';
import { ConfigService } from '@nestjs/config';
import { IResponseGeo } from 'src/interfaces/responses/response.geo.interface';
import { EntityParseArticle } from '../entities/parse-article.entity';
import { compact, forEach, iteratee, map, uniq, uniqBy } from 'lodash';
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
    const dataUrl = await this.fetchGeoProvider.fetchGeo(query);

    const dataR = map(dataUrl, async data => {
      const { url, article, keys } = data;
      return await this.searchUrl(url, article, keys);
    });

    if (dataUrl.length === dataR.length) {
      const resolved = await Promise.all(dataR);
      const result = await this.filterData(resolved);
      return {
        address: query.address,
        result: result,
      };
    }
  }

  async filterData(data: ResultSearchEntity[][]) {
    const result = [];
    for (const datum of data) {
      let counter = 0;
      while (datum.length > counter) {
        if (typeof datum[counter].position === 'number') {
          result.push(datum[counter]);
          break;
        } else if (datum.length === counter + 1) {
          result.push(datum[counter]);
        }
        counter++;
      }
    }

    if (result.length === data.length) {
      return result.flat();
    }
  }

  async searchUrl(urls: string[], article: string, keys) {
    const dataResult = map(urls, async (urlString, index) => {
      const search = await this.searchProvider.search(
        urlString,
        Number(article),
      );

      if (search === 0 && urls.length === index + 1 && search !== undefined) {
        const result = new ResultSearchEntity(keys, search);
        return { ...result };
      } else if (search !== 0) {
        const result = new ResultSearchEntity(
          keys,
          index == 0 ? search : index * 100 + 100 + search,
        );
        return { ...result };
      }
      return new ResultSearchEntity(keys, search);
    });

    return await Promise.all(dataResult);
  }
}
