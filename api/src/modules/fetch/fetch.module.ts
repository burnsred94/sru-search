import { Module } from '@nestjs/common';
import { RmqModule } from '../rabbitmq/rabbitmq.module';
import { RmqExchanges } from '../rabbitmq/exchanges';
import { FetchProvider } from './providers/fetch.provider';

@Module({
  imports: [
    RmqModule.register({
      exchanges: [RmqExchanges.STATISTICS, RmqExchanges.SEARCH, RmqExchanges.GEO],
    }),
  ],
  providers: [FetchProvider],
  exports: [FetchProvider],
})
export class FetchModule {}
