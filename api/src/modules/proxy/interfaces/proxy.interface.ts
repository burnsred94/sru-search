export interface IProxyResponse {
  status: string;
  user_id: string;
  balance: string;
  currency: string;
  date_mod: string;
  list_count: number;
  list: IProxyList[];
  page: number;
}

export interface IProxyList {
  id: string;
  version: string;
  ip: string;
  host: string;
  port: string;
  user: string;
  pass: string;
  type: string;
  country: string;
  date: string;
  date_end: string;
  unixtime: number;
  unixtime_end: number;
  descr: string;
  active: string;
}
