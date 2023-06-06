import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { ArticleSearchDto } from '../dto/article-search.dto';
import { IResponseGeo } from 'src/interfaces';
import { ParseUrlEntity } from '../entities/parse-url-search.entity';
import { EntityParseArticle } from '../entities/parse-article.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FetchGeoProvider {
  constructor(
    private readonly gotService: GotService,
    private readonly configService: ConfigService,
  ) { }

  async fetchGeo(query: ArticleSearchDto) {
    const fetchUrl = await this.configService.get('API_URL_GEO');
    const { body } = await this.gotService.gotRef(
      fetchUrl + `/${query.address}`,
      {
        method: 'POST',
        body: JSON.stringify({ query: query.address }),
      });

    const lt = JSON.parse(body);
    const { data } = lt as IResponseGeo;
    const { address } = data;

    const dataParsed = query.keys.map(async key => {
      const dataUrl = Array.from(
        { length: 21 },
        (_, index) => new ParseUrlEntity(address.urls, key, index + 1).url,
      );
      const data = new EntityParseArticle({
        url: dataUrl,
        article: query.article,
        keys: key,
      });
      return data;
    });

    const results = await Promise.all(dataParsed);
    return results;
  }
}
