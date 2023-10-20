import { IFetchSend } from 'src/interfaces';

export class FetchEntity {
  name: string;
  position: { cpm: number; promotion: number; promoPosition: number; position: number };
  periodId: string;
  addressId: string;
  averageId: string;
  key_id: string;
  key: string;
  article: string;

  constructor(data: IFetchSend) {
    this.article = String(data.article);
    this.name = data.name;
    this.position = data.position;
    this.periodId = data.periodId;
    this.averageId = data.averageId;
    this.addressId = data.addressId;
    this.key_id = data.key_id;
    this.key = data.key;
  }
}
