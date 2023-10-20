import { Module } from '@nestjs/common';
import { NightParserModule } from './night-parser/night-parser.module';

export const PARSERS_MODULE = [NightParserModule];

@Module({
  imports: [...PARSERS_MODULE],
})
export class ParsersModule {}
