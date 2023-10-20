import { Controller, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { RabbitMqResponser, RabbitMqSubscriber } from './modules/rabbitmq/decorators';
import { RmqExchanges, RmqServices } from './modules/rabbitmq/exchanges';
import { CheckStatusTaskRMQ, SearchPositionRMQ } from './modules/rabbitmq/contracts/search';
import { GetPositionWidgetsRMQ } from './modules/rabbitmq/contracts/search/get-position-widget.contract';
import { Payload } from '@nestjs/microservices';
import { FetchEvent } from './modules/events';
import { QueueProvider } from './modules/queue/providers';

@Controller({})
export class AppController {
  protected readonly logger = new Logger(AppController.name);
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
    try {
      this.queueProvider.pushTask(async () => {
        await this.appService.search(payload), await this.fetchEvents.init();
      });
    } catch (error) {
      this.logger.error(error);
    }
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
