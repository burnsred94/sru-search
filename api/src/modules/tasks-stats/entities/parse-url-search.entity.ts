import { IUrlsGeo } from 'src/interfaces/response.geo.interface';

export class ParseUrlEntity {
  url: string;
  code: string;
  testId: number;
  testGroup: number;

  constructor(data: IUrlsGeo, code: string, page: number, limit = 100) {
    this.code = encodeURIComponent(code);
    this.testId = Math.floor(Math.random() * 300);
    this.testGroup = Math.floor(Math.random() * 30);
    this.url =
      `https://search.wb.ru/exactmatch/ru/common/v4/search?TestGroup=test_${this.testGroup}&TestID=${this.testId}&` +
      `appType=${data.appType}&` +
      `curr=${data.curr}&` +
      `dest=${data.dest}&` +
      `limit=${limit}&` +
      `page=${page}&` +
      `query=${this.code}&` +
      `regions=${data.regions}&` +
      `resultset=catalog&` +
      `sort=popular&` +
      `spp=${data.spp}&` +
      `suppressSpellcheck=false`;
  }
}
