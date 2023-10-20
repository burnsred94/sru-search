import { Injectable, Logger } from '@nestjs/common';
import { NightParserRepository } from '../repositories/night-task.repository';
import { SearchNightPositionRMQ } from '../../../rabbitmq/contracts/search';
import { map } from 'lodash';
import { RabbitMqRequester } from 'src/modules/rabbitmq/services';
import { RmqExchanges } from 'src/modules/rabbitmq/exchanges';
import { GetGeoRMQ } from 'src/modules/rabbitmq/contracts/geo';
import { IAddressGeo } from 'src/interfaces/response.geo.interface';
import { ParseUrlEntity } from 'src/modules/tasks-stats/entities';
import { TaskStatus } from 'src/modules/tasks-stats/interfaces';

@Injectable()
export class NightParserService {
  protected readonly logger = new Logger(NightParserService.name);

  constructor(
    private readonly nightParserRepository: NightParserRepository,
    private readonly rmqRequester: RabbitMqRequester,
  ) {}

  async createTask(task: SearchNightPositionRMQ.Payload) {
    const { pvz, key, article } = task;
    const data = map(pvz, async (value) => {
      const data = await this.rmqRequester.request({
        exchange: RmqExchanges.GEO,
        routingKey: GetGeoRMQ.routingKey,
        timeout: 5000 * 10,
        payload: { addressId: value.geo_address_id },
      });

      const dataGeo = data as IAddressGeo;

      const dataUrl = Array.from({ length: 10 }, (_, index) => new ParseUrlEntity(dataGeo.urls, key, index + 1).url);

      const numberIterator = Number(
        String(value.current_position).length === 3 ? String(value.current_position).slice(0, 1) : 0,
      );

      return {
        urls: dataUrl,
        address: value.name,
        average_id: value.average_id,
        key_id: task.key_id,
        addressId: value.addressId,
        periodId: value.periodId,
        index_search: numberIterator,
      };
    });

    const result = await Promise.all(data);

    const create = await this.nightParserRepository.create({
      article: article,
      status: TaskStatus.WAITING,
      key: key,
      pwz: result,
    });

    return create;
  }
}
