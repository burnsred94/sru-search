import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QueueProvider {
  protected readonly logger = new Logger(QueueProvider.name);

  concurrency: number;
  running: number;
  queue: Array<any>;

  constructor(private readonly configService: ConfigService) {
    this.concurrency = 112;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    if (this.queue.length > 0) {
      this.queue.push(task);
    } else {
      this.queue.push(task);
      this.next();
    }
  }

  next() {
    while (this.running < this.concurrency && this.queue.length > 0) {
      const task = this.queue.shift();
      setImmediate(() => {
        task();
      });

      this.running++;

      if (this.running === this.concurrency) {
        setImmediate(() => {
          new Promise((resolve) => {
            setTimeout(() => {
              this.running = 0;
              resolve(this.next());
            }, 1000);
          });
        });

        break;
      }
    }
  }
}