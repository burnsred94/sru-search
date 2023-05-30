import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import { forEach } from 'lodash';
import { IResponseWbSearch } from 'src/interfaces';

@Injectable()
export class SearchProvider {
  constructor(private readonly gotService: GotService) { }

  async search(url: string, article: number) {
    // console.log(url)
    const { body } = await this.gotService.gotRef(url);
    const lt = JSON.parse(body);
    const { data } = lt as IResponseWbSearch;
    // if (data !== undefined && data.products.length > 0) {
    //   while (index < data.products.length) {
    //     if (data.products[index].id === article) {
    //       return index + 1;
    //     }
    //     index++;
    //   }
    //   if (index === data.products.length) {
    //     return 0;
    //   }
    // }
    if (data?.products === undefined) {
      return 0;
    }

    const find = data.products.findIndex(p => p.id === article);

    return find === -1 ? 0 : find + 1;
  }
}
