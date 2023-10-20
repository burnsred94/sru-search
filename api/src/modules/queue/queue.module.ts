import { Module } from '@nestjs/common';
import { QueueProvider } from './providers';

@Module({
  providers: [QueueProvider],
  exports: [QueueProvider],
})
export class QueueModule {}
