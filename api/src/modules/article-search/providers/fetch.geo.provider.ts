import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { SearchArticleDto } from '../dto/article-search.dto';
import { IResponseGeo } from 'src/interfaces';
import { ParseUrlEntity } from '../entities/parse-url-search.entity';
import { EntityParseArticle } from '../entities/parse-article.entity';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class FetchGeoProvider {
  constructor(private readonly configService: ConfigService) { }

  async fetchGeo(pwz: { name: string }, key: string) {
    const fetchUrl = await this.configService.get('API_URL_GEO');

    const { data } = await axios.post(fetchUrl, {
      query: pwz.name,
    });

    const { data: dataGeo } = data as IResponseGeo;

    const dataUrl = Array.from(
      { length: 20 },
      (_, index) =>
        new ParseUrlEntity(dataGeo.address.urls, key, index + 1).url,
    );

    return dataUrl
  }
}
