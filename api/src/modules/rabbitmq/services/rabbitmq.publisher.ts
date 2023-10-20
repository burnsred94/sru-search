import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Injectable, Logger } from '@nestjs/common';
import { RabbitMqPublishParam } from '../interfaces/rabbitmq.interface';

@Injectable()
export class RabbitMqPublisher {
  protected readonly logger = new Logger(RabbitMqPublisher.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publish<T>({ exchange, routingKey, payload }: RabbitMqPublishParam<T>): Promise<void> {
    this.logger.log('Publishing message', { exchange, routingKey, payload });
    await this.amqpConnection.publish(exchange, routingKey, payload);
  }
}
