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

    if (data?.products === undefined) {
      return 0;
    }

    const find = data.products.findIndex(p => p.id === article);

    return find === -1 ? 0 : find + 1;
  }
}
