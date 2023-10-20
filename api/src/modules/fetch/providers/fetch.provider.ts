import { Injectable, Logger } from '@nestjs/common';
import { IFetchSend } from 'src/interfaces';
import { StatisticsUpdateRMQ } from 'src/modules/rabbitmq/contracts/statistics';
import { RmqExchanges } from 'src/modules/rabbitmq/exchanges';
import { RabbitMqPublisher } from 'src/modules/rabbitmq/services';
import { FetchEntity } from '../entities';

@Injectable()
export class FetchProvider {
  protected readonly logger = new Logger(FetchProvider.name);

  constructor(private readonly rmqPublisher: RabbitMqPublisher) {}

  async sendUpdateStats(data: IFetchSend) {
    const send = new FetchEntity(data);
    await this.rmqPublisher.publish({
      exchange: RmqExchanges.STATISTICS,
      routingKey: StatisticsUpdateRMQ.routingKey,
      payload: send,
    });
  }
}
