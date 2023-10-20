import { Injectable } from '@nestjs/common';
import { NightParserRepository } from '../repositories/night-task.repository';
import { ProxyProvider } from 'src/modules/proxy/providers';
import * as request from 'request';
import { getConfigParse } from '../configs/parse-iteration.config';

@Injectable()
export class ParserBuilder {
  constructor(
    private readonly tasksNightService: NightParserRepository,
    private readonly proxyProvider: ProxyProvider,
  ) {}

  async init(task) {
    const getProxy = await this.proxyProvider.proxy();
    await this.checkoutPwz(task, getProxy);
  }

  async checkoutPwz(payload, proxy, pwz = 0) {
    if (payload.pwz[pwz]?.urls !== undefined) {
      const getIterator = await getConfigParse(payload.pwz[pwz].index_search);
      await this.parse(payload, payload.pwz[pwz].urls, proxy, payload.article, getIterator, pwz);
    }
  }

  async parse(payload, urls, proxyChunk, article, iterator, pwz, count = 0, indexProxy = 0) {
    if (iterator[count] === undefined) return;

    indexProxy = (indexProxy + 1) % 2;
    const proxy = proxyChunk[indexProxy].url;

    const result = await this.fetch(urls[iterator[count]], proxy, article);
    if (result === -1) {
      await this.parse(payload, urls, proxyChunk, article, iterator, pwz, count + 1, indexProxy);
    } else {
      console.log(`Result`, result);
      await this.checkoutPwz(payload, proxyChunk, pwz + 1);
    }
  }

  async fetch(url, proxy, article) {
    return new Promise((resolve, reject) => {
      request.get(
        {
          proxy: proxy,
          url: url,
        },
        (error, response, body) => {
          try {
            const lt = JSON.parse(body);

            const products = lt.data.products;

            const index = products.findIndex((product) => product.id === article);

            resolve(index);
          } catch {}
        },
      );
    });
  }
}
