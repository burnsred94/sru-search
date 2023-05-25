import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { IResponseWbSearch } from 'src/interfaces';

@Injectable()
export class SearchProvider {
  constructor(private readonly gotService: GotService) {}

  async search(url: string, article: number) {
    const { body } = await this.gotService.gotRef(url);
    const lt = JSON.parse(body);
    const { data } = lt as IResponseWbSearch;

    let index = 0;
    while (index < data.products.length) {
      if (data.products[index].id === article) {
        return index + 1;
      }
      index++;
    }
    if (index === data.products.length) {
      return 0;
    }
  }
}
