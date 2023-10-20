export interface IResponseGeo {
  status: number;
  errors: any[];
  data: IDataGeo;
}

export interface IDataGeo {
  address: IAddressGeo;
}

export interface IAddressGeo {
  _id: string;
  address: string;
  cityName: string;
  url: string;
  pickupType: number;
  urls: IUrlsGeo;
}

export interface IUrlsGeo {
  _id: string;
  address: string;
  spp: string;
  appType: string;
  curr: string;
  dest: string;
  regions: string;
  destZone: number[];
}
