import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SearchNightPositionRMQ } from 'src/modules/rabbitmq/contracts/search';
import { NightParserService } from './services/night-parser.service';
import { QueueProvider } from 'src/modules/queue/providers';
import { ParserBuilder } from './services/parser-builder.service';

@Controller('night-parser')
export class NightParserController {
  protected readonly logger = new Logger(NightParserController.name);

  constructor(
    private readonly nightParserService: NightParserService,
    private readonly queueProvider: QueueProvider,
    private readonly parserBuilder: ParserBuilder,
  ) {}

  @Post('search')
  async nightParser(@Body() payload: SearchNightPositionRMQ.Payload) {
    try {
      const task = await this.nightParserService.createTask(payload);
      this.queueProvider.pushTask(() => this.parserBuilder.init(task));
      return task;
    } catch (error) {
      this.logger.error(error);
    }
  }
}
