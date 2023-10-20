import { Injectable, Logger } from '@nestjs/common';
import { TaskRepository } from './modules/tasks-stats/repositories';
import { map } from 'lodash';
import { IAddressGeo } from './interfaces/response.geo.interface';
import { ParseUrlEntity } from './modules/tasks-stats/entities';
import { SearchPositionRMQ } from './modules/rabbitmq/contracts/search';
import { RabbitMqRequester } from './modules/rabbitmq/services';
import { RmqExchanges } from './modules/rabbitmq/exchanges';
import { GetGeoRMQ } from './modules/rabbitmq/contracts/geo';
import { GetPositionWidgetsRMQ } from './modules/rabbitmq/contracts/search/get-position-widget.contract';
import { ADDRESS_WIDGET } from './constants/addresses.widget';
import { PositionWidgetsEvent } from './modules/events';

@Injectable({})
export class AppService {
  protected readonly logger = new Logger(AppService.name);

  start = 1;

  constructor(
    private readonly rmqRequester: RabbitMqRequester,
    private readonly fetchPositionWidgets: PositionWidgetsEvent,
    private readonly taskRepository: TaskRepository,
  ) {}
  async search(searchObject: SearchPositionRMQ.Payload) {
    const { pvz, key, article } = searchObject;

    const data = map(pvz, async (value) => {
      const data = await this.rmqRequester.request({
        exchange: RmqExchanges.GEO,
        routingKey: GetGeoRMQ.routingKey,
        timeout: 5000 * 10,
        payload: { addressId: value.geo_address_id },
      });

      const dataGeo = data as IAddressGeo;

      const dataUrl = Array.from({ length: 10 }, (_, index) => new ParseUrlEntity(dataGeo.urls, key, index + 1).url);

      return {
        urls: dataUrl,
        address: value.name,
        averageId: value.average_id,
        key_id: searchObject.key_id,
        addressId: value.addressId,
        periodId: value.periodId,
      };
    });

    const result = await Promise.all(data);

    await this.taskRepository.create({
      article: article,
      key: key,
      pwz: result,
    });

    return { status: true };
  }

  async searchWidget(data: GetPositionWidgetsRMQ.Payload) {
    const { article, key } = data;

    const parse_data = map(ADDRESS_WIDGET, async (id) => {
      const data = await this.rmqRequester.request({
        exchange: RmqExchanges.GEO,
        routingKey: GetGeoRMQ.routingKey,
        payload: { addressId: id },
      });

      const dataGeo = data as IAddressGeo;

      const dataUrl = Array.from({ length: 10 }, (_, index) => new ParseUrlEntity(dataGeo.urls, key, index + 1).url);

      return {
        urls: dataUrl,
        city: dataGeo.cityName,
      };
    });

    const resolved = await Promise.all(parse_data);

    return await this.fetchPositionWidgets.getPositionWidgets(article, resolved);
  }

  async getCountTask() {
    return await this.taskRepository.getCountAllDocuments();
  }

  async dataNightGen(searchObject: SearchPositionRMQ.Payload) {
    console.log(searchObject);
  }
}
