import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventProxy } from '../proxy/events';
import { ParserEvents } from 'src/events';
import { ConfigService } from '@nestjs/config';

export type ITask = () => Promise<void>;

@Injectable()
export class TaskSenderQueue {
  protected readonly logger = new Logger(TaskSenderQueue.name);

  started = false;
  proxy = false;
  concurrency: number;
  running: number;
  queue: Array<ITask>;

  constructor(private readonly configService: ConfigService, private readonly eventEmitter: EventEmitter2) {
    this.concurrency = this.configService.get('CONCURRENCY_PARSERS');
    this.running = 0;
    this.queue = [];
  }

  pushTask(task: ITask) {
    this.queue.push(task);
  }

  @OnEvent(ParserEvents.PARSE_NEXT)
  next() {
    if (this.queue.length > 0 && this.running < 28 && this.started) {
      const task = this.queue.shift();
      this.running += 1;
      setImmediate(() => task());
    }
  }

  @OnEvent(ParserEvents.PARSE_END)
  async end() {
    if (!this.started) return;

    if (this.queue.length === 0) {
      this.logger.log(`Queue is not empty`);
      this.setStarted(false);
      this.running = 0;
      return;
    }

    this.running = this.running - 1;
    setImmediate(() => this.next());
  }

  @OnEvent(EventProxy.PROXY_READY)
  async eventReady() {
    this.proxy = true;
  }

  async getStarted() {
    return this.started;
  }

  async setStarted(started: boolean) {
    if (started) {
      this.started = started;
    } else {
      this.started = started;
      this.eventEmitter.emit(ParserEvents.PARSE_CHECK);
      return;
    }
  }
}
