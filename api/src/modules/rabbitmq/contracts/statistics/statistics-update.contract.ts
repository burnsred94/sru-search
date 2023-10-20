import { Types } from 'mongoose';
import { StatisticsEventsRMQ } from './events';

export namespace StatisticsUpdateRMQ {
  export const routingKey = StatisticsEventsRMQ.UPDATE;

  export const queue = `queue-${StatisticsEventsRMQ.UPDATE}`;

  export class Payload {
    article: string;
    name: string;
    addressId: Types.ObjectId;
    periodId: Types.ObjectId;
    position: { cpm: number; promotion: number; promoPosition: number; position: number };
    key: string;
    key_id: string;
  }

  export class Response {}
}
