import { Body, Controller, Logger, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMqResponser, RabbitMqSubscriber } from './modules/rabbitmq/decorators';
import { RmqExchanges, RmqServices } from './modules/rabbitmq/exchanges';
import { CheckStatusTaskRMQ, SearchPositionRMQ } from './modules/rabbitmq/contracts/search';
import { GetPositionWidgetsRMQ } from './modules/rabbitmq/contracts/search/get-position-widget.contract';
import { Payload } from '@nestjs/microservices';
import { FetchEvent } from './modules/events';
import { QueueProvider } from './modules/queue/providers';
import { OnEvent } from '@nestjs/event-emitter';
import { InitEvents } from './events';

@Controller({})
export class AppController {
  protected readonly logger = new Logger(AppController.name);
  init = false;

  constructor(
    private readonly appService: AppService,
    private readonly fetchEvents: FetchEvent,
    private readonly queueProvider: QueueProvider,
  ) {}

  @RabbitMqSubscriber({
    exchange: RmqExchanges.SEARCH,
    routingKey: SearchPositionRMQ.routingKey,
    queue: SearchPositionRMQ.queue,
    currentService: RmqServices.SEARCH,
  })
  async search(payload: SearchPositionRMQ.Payload) {
    this.queueProvider.pushTask(() => this.appService.search(payload).then(() => this.fetchEvents.init()));
  }

  @RabbitMqResponser({
    exchange: RmqExchanges.SEARCH,
    routingKey: GetPositionWidgetsRMQ.routingKey,
    queue: GetPositionWidgetsRMQ.queue,
    currentService: RmqServices.SEARCH,
  })
  async searchPositionWidgets(@Payload() payload: GetPositionWidgetsRMQ.Payload) {
    try {
      return await this.appService.searchWidget(payload);
    } catch (error) {
      this.logger.error(error);
    }
  }

  // @RabbitMqResponser({
  //   exchange: RmqExchanges.SEARCH,
  //   routingKey: CheckStatusTaskRMQ.routingKey,
  //   queue: CheckStatusTaskRMQ.queue,
  //   currentService: RmqServices.SEARCH,
  // })
  async getCountTasks() {
    try {
      return await this.appService.getCountTask();
    } catch (error) {
      this.logger.error(error);
    }
  }
}
