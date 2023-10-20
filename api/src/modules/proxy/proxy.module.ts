import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Proxy, ProxySchema } from './schemas';
import { ProxyRepository } from './repositories';
import { ProxyProvider } from './providers/proxy.provider';

@Module({
  imports: [MongooseModule.forFeature([{ name: Proxy.name, schema: ProxySchema }])],
  providers: [ProxyRepository, ProxyProvider],
  exports: [ProxyProvider],
})
export class ProxyModule {}
