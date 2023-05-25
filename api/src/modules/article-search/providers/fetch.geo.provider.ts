import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { ArticleSearchDto } from '../dto/article-search.dto';
import { IResponseGeo } from 'src/interfaces';
import { map } from 'lodash';
import { ParseUrlEntity } from '../entities/parse-url-search.entity';
import { EntityParseArticle } from '../entities/parse-article.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FetchGeoProvider {
  constructor(
    private readonly gotService: GotService,
    private readonly configService: ConfigService,
  ) {}

  async fetchGeo(query: ArticleSearchDto) {
    let iterator = 0;
    const fetchUrl =
      (await this.configService.get('API_URL_GEO')) + `/${query.address}`;
    const { body } = await this.gotService.gotRef(fetchUrl);
    const lt = JSON.parse(body);
    const { data } = lt as IResponseGeo;
    const { address } = data;

    const dataParsed = map(query.keys, key => {
      const dataUrl = [];
      while (iterator !== 21) {
        const url = new ParseUrlEntity(address.urls, key, iterator + 1).url;
        dataUrl.push(url);
        iterator += 1;
      }
      if (dataUrl.length === 21) {
        const data = new EntityParseArticle({
          url: dataUrl,
          article: query.article,
          keys: key,
        });
        iterator = 0;
        return data;
      }
    });
    return dataParsed;
  }
}
