import { SearchEventsRMQ } from './events/search.events';

export namespace SearchPositionRMQ {
  export const routingKey = SearchEventsRMQ.SEARCH_POSITION;

  export const queue = `queue-${SearchEventsRMQ.SEARCH_POSITION}`;

  export class Payload {
    article: string;
    key: string;
    key_id: string;
    pvz: {
      name: string;
      average_id: string;
      addressId: string;
      geo_address_id: string;
      periodId: string;
      current_position?: string;
    }[];
  }

  export class Response {}
}
