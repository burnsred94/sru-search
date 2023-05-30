import { IUrlsGeo } from 'src/interfaces';

export class ParseUrlEntity {
  url: string;
  code: string;
  //query=%D0%B4%D0%B6%D0%B8%D0%BD%D1%81%D1%8B&regions=80,38,4,64,83,33,68,70,69,30,86,75,40,1,66,110,22,31,48,71,114&resultset=catalog&sort=popular&spp=0&suppressSpellcheck=false

  constructor(data: IUrlsGeo, code: string, page: number, limit = 100) {
    this.code = encodeURIComponent(code);
    this.url =
      `https://search.wb.ru/exactmatch/ru/common/v4/search?TestGroup=no_test&TestID=no_test&` +
      `appType=${data.appType}&` +
      `curr=${data.curr}&` +
      `dest=${data.dest}&` +
      `page=${page}&` +
      `query=${this.code}&` +
      `regions=${data.regions}&` +
      `resultset=catalog&` +
      `sort=popular&` +
      `spp=${data.spp}&` +
      `suppressSpellcheck=false`;
    // `limit=${limit}&` +
    // `locale=ru&` +
    // `lang=ru&` +
    // `reg=1&` +
  }
}
