import { IUrlsGeo } from 'src/interfaces';

export class ParseUrlEntity {
  url: string;

  constructor(data: IUrlsGeo, code: string, page: number, limit = 100) {
    this.url =
      `https://search.wb.ru/exactmatch/ru/common/v4/search?` +
      `query=${code}&` +
      `resultset=catalog&` +
      `limit=${limit}&` +
      `sort=popular&` +
      `page=${page}&` +
      `appType=${data.appType}&` +
      `curr=${data.curr}&` +
      `locale=ru&` +
      `lang=ru&` +
      `dest=${data.dest}&` +
      `regions=${data.regions}&` +
      `reg=1&` +
      `spp=${data.spp}`;
  }
}
