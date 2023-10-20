import { GeoEventsRMQ } from './events/geo-events-rmq.enum';

export namespace GetGeoRMQ {
  export const routingKey = GeoEventsRMQ.GET_GEO;

  export const queue = `queue-${GeoEventsRMQ.GET_GEO}`;

  export class Payload {
    addressId: string;
  }

  export class Response {}
}
