import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { TaskRepository } from 'src/modules/tasks-stats/repositories';
import * as request from 'request';
import { ProxyProvider } from '../proxy/providers';
import { TaskSenderQueue } from './queue.event';
import { ParserEvents } from 'src/events';
import { FetchProvider } from '../fetch/providers';

export enum SearchStatus {
  NOT_FOUND = -1,
  NOT_DATA = -2,
}

@Injectable()
export class FetchEvent {
  protected readonly logger = new Logger(FetchEvent.name);

  mock = Array.from({ length: 100 }, () => ({
    id: 0,
  }));

  constructor(
    private readonly taskStatsRepository: TaskRepository,
    private readonly eventEmitter: EventEmitter2,
    private readonly fetchProvider: FetchProvider,
    private readonly taskQueue: TaskSenderQueue,
    private readonly proxyProvider: ProxyProvider,
  ) { }

  async fetch() {
    const find = await this.taskStatsRepository.find();
    if (find !== undefined) {
      const proxy = await this.proxyProvider.proxy();
      if (proxy.length === 3) {
        await this.taskStatsRepository.update(find._id);
        await this.reloadFetch(find, proxy);
        this.taskQueue.next();
      }
    }
  }

  async reloadFetch(payload, proxyChunk, pwzIndex = 0, urlIndex = 0, indexProxy = 0, results = []) {
    const pwzLength = payload.pwz.length;
    if (pwzIndex === pwzLength) {
      await this.taskStatsRepository.remove(payload._id);
      await this.proxyProvider.upProxy(proxyChunk);
      this.taskQueue.end();
      return;
    }

    const pwz = payload.pwz[pwzIndex];
    const urls = pwz?.urls;

    const url = urls[urlIndex];

    indexProxy = (indexProxy + 1) % 3;
    const proxy = proxyChunk[indexProxy].url;

    request.get(
      {
        proxy: proxy,
        url: url,
      },
      async (error, response, body) => {
        if (response === undefined || response.statusCode === 404) {
          results.push(...this.mock);
          if (pwzIndex < payload.pwz.length) {
            new Promise((resolve) => resolve(this.reloadFetch(payload, proxyChunk, pwzIndex + 1, 0, indexProxy, [])));
            return;
          }
          new Promise((resolve) =>
            resolve(this.reloadFetch(payload, proxyChunk, pwzIndex, urlIndex + 1, indexProxy, results)),
          );
          return;
        }

        if (error) {
          if (error.response?.status === 429) {
            this.logger.warn(error.message);
            new Promise((resolve) =>
              resolve(this.reloadFetch(payload, proxyChunk, pwzIndex, urlIndex, indexProxy, results)),
            );
            return;
          }
          results.push(...this.mock);
          new Promise((resolve) =>
            resolve(this.reloadFetch(payload, proxyChunk, pwzIndex, urlIndex + 1, indexProxy, results)),
          );
          return;
        } else {
          if (body.length > 0) {
            try {
              const lt = JSON.parse(body);

              const products = lt.data.products;
              results.push(...products);

              const index = results.findIndex((product) => product.id === payload.article);

              if (index !== -1) {
                this.successfulShipment(
                  pwz.address,
                  { position: index, card: results[index] },
                  pwz.periodId,
                  pwz.addressId,
                  pwz.key_id,
                  pwz.averageId,
                  payload,
                );
                new Promise((resolve) =>
                  resolve(this.reloadFetch(payload, proxyChunk, pwzIndex + 1, 0, indexProxy, [])),
                );
                return;
              } else if (urls.length - 1 === urlIndex) {
                this.failedShipment(
                  pwz.address,
                  SearchStatus.NOT_FOUND,
                  pwz.periodId,
                  pwz.addressId,
                  pwz.key_id,
                  pwz.averageId,
                  payload,
                );
                new Promise((resolve) =>
                  resolve(this.reloadFetch(payload, proxyChunk, pwzIndex + 1, 0, indexProxy, [])),
                );
                return;
              } else if (urlIndex < urls.length - 1) {
                new Promise((resolve) =>
                  resolve(this.reloadFetch(payload, proxyChunk, pwzIndex, urlIndex + 1, indexProxy, results)),
                );
                return;
              } else if (pwzIndex < payload.pwz.length) {
                new Promise((resolve) =>
                  resolve(this.reloadFetch(payload, proxyChunk, pwzIndex + 1, 0, indexProxy, [])),
                );
                return;
              }
            } catch {
              this.failedShipment(
                pwz.address,
                SearchStatus.NOT_DATA,
                pwz.periodId,
                pwz.addressId,
                pwz.key_id,
                pwz.averageId,
                payload,
              );
              new Promise((resolve) => resolve(this.reloadFetch(payload, proxyChunk, pwzIndex + 1, 0, indexProxy, [])));
              return;
            }
          }
        }
      },
    );
  }

  async init() {
    const status = await this.taskQueue.getStarted();
    const task = () => this.fetch();

    if (status) {
      this.taskQueue.pushTask(task);
    } else {
      this.taskQueue.pushTask(task);
      this.taskQueue.setStarted(true);
      this.taskQueue.next();
    }
  }

  @OnEvent(ParserEvents.PARSE_CHECK)
  async check() {
    const getTasksDB = await this.taskStatsRepository.getCountDocuments();
    if (getTasksDB > 0) {
      const task = () => this.fetch();
      (() => {
        for (let index = 0; index < getTasksDB; index++) {
          this.taskQueue.pushTask(task);
        }
        this.logger.log(`Task queue started: ${getTasksDB}`);
        this.taskQueue.setStarted(true);
        this.taskQueue.next();
      })();
    }
  }

  async successfulShipment(address, position, periodId, addressId, key_id, averageId, payload) {
    position =
      Object.keys(position.card.log).length > 0
        ? position.card.log
        : { cpm: 0, promotion: 0, promoPosition: 0, position: position.position };

    new Promise((resolve) =>
      resolve(
        this.fetchProvider.sendUpdateStats({
          name: address,
          position: position,
          periodId: periodId,
          averageId: averageId,
          addressId: addressId,
          key_id: key_id,
          key: payload.key,
          article: String(payload.article),
        }),
      ),
    );
  }

  async failedShipment(address, status, periodId, addressId, key_id, averageId, payload) {
    new Promise((resolve) =>
      resolve(
        this.fetchProvider.sendUpdateStats({
          name: address,
          position: { cpm: 0, promotion: 0, promoPosition: 0, position: status },
          periodId: periodId,
          averageId: averageId,
          addressId: addressId,
          key_id: key_id,
          key: payload.key,
          article: String(payload.article),
        }),
      ),
    );
  }
}
