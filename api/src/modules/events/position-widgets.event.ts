import { Injectable, Logger } from '@nestjs/common';
import { ProxyProvider } from '../proxy/providers';
import { map } from 'lodash';
import * as request from 'request';

@Injectable()
export class PositionWidgetsEvent {
  protected readonly logger = new Logger(PositionWidgetsEvent.name);

  constructor(private readonly proxyService: ProxyProvider) {}

  async getPositionWidgets(article: string, data: Array<{ urls: Array<string>; city: string }>) {
    const getProxy = await this.proxyService.getProxyWidget(5);
    const result = map(data, async (object) => {
      const data = await this.parse(Number(article), object, getProxy);
      return data;
    });
    const resolved = await Promise.all(result);
    return resolved;
  }

  async parse(
    article: number,
    dataUrl: { urls: Array<string>; city: string },
    proxy,
    urlIndex = 0,
    indexProxy = 0,
    results = [],
  ) {
    const url = dataUrl.urls[urlIndex];

    indexProxy = (indexProxy + 1) % 5;
    const proxyUrl = proxy[indexProxy].url;

    const data = new Promise((resolve, reject) => {
      request.get(
        {
          proxy: proxyUrl,
          url: url,
        },
        async (error, response, body) => {
          if (error) {
            reject({
              article: article,
              dataUrl: dataUrl,
              proxy: proxy,
              urlIndex: urlIndex + 1,
              indexProxy: indexProxy,
              results: results,
            });
          }

          if (body) {
            const lt = JSON.parse(body);

            const products = lt.data.products;
            results.push(...products);

            const index = results.findIndex((product) => product.id === article);
            if (index !== -1) {
              resolve({
                city: dataUrl.city,
                position: String(index + 1),
              });
            } else if (urlIndex < dataUrl.urls.length - 1) {
              reject({
                article: article,
                dataUrl: dataUrl,
                proxy: proxy,
                urlIndex: urlIndex + 1,
                indexProxy: indexProxy,
                results: results,
              });
            } else if (urlIndex + 1 === dataUrl.urls.length) {
              resolve({
                city: dataUrl.city,
                position: '1000+',
              });
            }
          }
        },
      );
    });

    return data
      .then((value) => {
        return value;
      })
      .catch(async (error) => {
        return await this.parse(
          error.article,
          error.dataUrl,
          error.proxy,
          error.urlIndex,
          error.indexProxy,
          error.results,
        );
      });
  }
}
