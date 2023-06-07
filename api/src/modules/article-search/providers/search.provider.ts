import { Injectable } from '@nestjs/common';
import { GotService } from '@t00nday/nestjs-got';
import axios from 'axios';
import { IResponseWbSearch } from 'src/interfaces';

@Injectable()
export class SearchProvider {
  constructor(private readonly gotService: GotService) { }

  async search(urls: string[], article: number) {
    let iteratee = 0
    const result = [];

    while (urls.length > iteratee) {
      const { data } = await axios.get<IResponseWbSearch>(urls[iteratee]);
      result.push(...data.data.products);
      const find = result.findIndex(p => p.id === article);
      if (find !== -1) {
        return find + 1;
      }
      iteratee++;
    }

    // const { data } = lt as IResponseWbSearch;

    // if (data?.products === undefined) {
    //   return 0;
    // }

    // const find = data.products.findIndex(p => p.id === article);

    // return find === -1 ? 0 : find + 1;
  }
}
