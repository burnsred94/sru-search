import { IProxyList } from '../interfaces';

export class ProxyEntity {
  idProxy: string;
  version: string;
  ip: string;
  host: string;
  port: string;
  user: string;
  pass: string;
  useCount: number;

  constructor(data: IProxyList) {
    this.idProxy = data.id;
    this.version = data.version;
    this.ip = data.ip;
    this.host = data.host;
    this.port = data.port;
    this.user = data.user;
    this.pass = data.pass;
  }
}
