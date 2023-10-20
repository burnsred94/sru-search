import { IPvz, TaskStatus } from '../interfaces';

export class TaskStatsEntity {
  article: string;
  status: TaskStatus;
  key: string;
  key_id: string;
  pwz: Array<IPvz>;

  constructor(data: { article: string; key: string; pwz: Array<IPvz>; key_id: string }) {
    this.article = data.article;
    this.key = data.key;
    this.key_id = data.key_id;
    this.pwz = data.pwz;
    this.status = TaskStatus.WAITING;
  }
}
