import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TasksStatsModule } from './modules/tasks-stats/tasks-stats.module';
import { DatabaseModule } from './modules/database/database.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { FetchEvent, PositionWidgetsEvent } from './modules/events';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { ProxyModule } from './modules/proxy/proxy.module';
import { RmqModule } from './modules/rabbitmq/rabbitmq.module';
import { RmqExchanges } from './modules/rabbitmq/exchanges';
import { TaskSenderQueue } from './modules/events/queue.event';
import { FetchModule } from './modules/fetch/fetch.module';
import { QueueModule } from './modules/queue/queue.module';
import { ParsersModule } from './modules/parsers/parsers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    RmqModule.register({
      exchanges: [RmqExchanges.STATISTICS, RmqExchanges.SEARCH, RmqExchanges.GEO],
    }),
    EventEmitterModule.forRoot(),
    HttpModule,
    TasksStatsModule,
    DatabaseModule,
    ProxyModule,
    FetchModule,
    QueueModule,
    // ParsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, FetchEvent, TaskSenderQueue, PositionWidgetsEvent],
})
export class AppModule {}
