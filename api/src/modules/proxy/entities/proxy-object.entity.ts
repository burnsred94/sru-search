import { Types } from 'mongoose';

export class ProxyObject {
  id: Types.ObjectId;
  uri: string;

  constructor(data) {
    this.id = data._id;
    this.uri = `http://${data.user}:${data.pass}@${data.host}:${data.port}`;
  }
}
