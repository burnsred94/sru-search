import { IUrlsGeo } from 'src/interfaces';

export class ParseUrlEntity {
  url: string;
  code: string;

  constructor(data: IUrlsGeo, code: string, page: number, limit = 100) {
    console.log(data);
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
  }
}
