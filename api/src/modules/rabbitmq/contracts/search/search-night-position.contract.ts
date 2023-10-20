import { SearchEventsRMQ } from './events/search.events';

export namespace SearchNightPositionRMQ {
  export const routingKey = SearchEventsRMQ.SEARCH_NIGHT;

  export const queue = `queue-${SearchEventsRMQ.SEARCH_NIGHT}`;

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
