import { Injectable, Logger } from '@nestjs/common';
import { ProxyRepository } from '../repositories';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { IProxyList } from '../interfaces';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventProxy } from '../events';
import { forEach, map } from 'lodash';
import { ProxyObject } from '../entities';

@Injectable()
export class ProxyProvider {
  protected readonly logger = new Logger(ProxyProvider.name);

  constructor(
    private readonly proxyRepository: ProxyRepository,
    private readonly configService: ConfigService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async getProxyServer() {
    const proxyLength = await this.proxyRepository.findLength();

    if (proxyLength === 0) {
      const proxies = await this.fetchProxy();
      Object.keys(proxies).forEach(async (key) => {
        const oldProxy = await this.proxyRepository.findByIdProxy(proxies[key].id);
        if (!oldProxy) {
          await this.proxyRepository.create(proxies[key]);
        }
      });
      this.eventEmitter.emit(EventProxy.PROXY_READY);
    } else {
      this.eventEmitter.emit(EventProxy.PROXY_READY);
    }
  }

  async proxy() {
    const proxy = await this.proxyRepository.find();
    if (proxy.length === 3) {
      const proxies = map(proxy, async (item) => {
        await this.proxyRepository.downwardUpdate(item._id);
        return new ProxyObject(item);
      });
      const proxiesResolved = await Promise.all(proxies);
      return proxiesResolved;
    } else {
      return [];
    }
  }

  async upProxy(proxies: Array<ProxyObject>) {
    forEach(proxies, async (item) => {
      await this.proxyRepository.upProxy(item.id);
    });
  }

  async fetchProxy() {
    const serverProxyUrl = await this.configService.get('API_PROXY');
    const { data } = await axios.get(serverProxyUrl);
    return data.list;
  }

  async getProxyWidget(limit: number) {
    const proxies = await this.proxyRepository.getProxyWidget(limit);
    const proxyUrl = map(proxies, (proxy) => new ProxyObject(proxy));

    return proxyUrl;
  }
}
