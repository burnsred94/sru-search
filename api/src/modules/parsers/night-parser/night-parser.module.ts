import { Module } from '@nestjs/common';
import { NightParserService } from './services/night-parser.service';
import { NightParserController } from './night-parser.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { NightTask, NightTaskSchema } from './schemas/night-task.schema';
import { NightParserRepository } from './repositories/night-task.repository';
import { RmqModule } from 'src/modules/rabbitmq/rabbitmq.module';
import { RmqExchanges } from 'src/modules/rabbitmq/exchanges';
import { QueueModule } from 'src/modules/queue/queue.module';
import { ParserBuilder } from './services/parser-builder.service';
import { ProxyModule } from 'src/modules/proxy/proxy.module';

export const PROVIDER_NIGHT_PARSER = [NightParserService, NightParserRepository, ParserBuilder];

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NightTask.name, schema: NightTaskSchema }]),
    RmqModule.register({ exchanges: [RmqExchanges.GEO] }),
    QueueModule,
    ProxyModule,
  ],
  providers: [...PROVIDER_NIGHT_PARSER],
  controllers: [NightParserController],
})
export class NightParserModule {}
