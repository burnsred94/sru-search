export interface IResponseWbSearch {
  metadata: Metadata;
  state: number;
  version: number;
  params: Parameters_;
  data: Data;
}

export interface Metadata {
  name: string;
  catalog_type: string;
  catalog_value: string;
  normquery: string;
}

export interface Parameters_ {
  curr: string;
  spp: number;
  version: number;
}

export interface Data {
  products: Product[];
}

export interface Product {
  __sort: number;
  ksort: number;
  time1: number;
  time2: number;
  dist: number;
  id: number;
  root: number;
  kindId: number;
  subjectId: number;
  subjectParentId: number;
  name: string;
  brand: string;
  brandId: number;
  siteBrandId: number;
  supplierId: number;
  sale: number;
  priceU: number;
  salePriceU: number;
  logisticsCost: number;
  saleConditions: number;
  pics: number;
  rating: number;
  feedbacks: number;
  panelPromoId?: number;
  promoTextCat?: string;
  volume: number;
  colors: Color[];
  sizes: Size[];
  diffPrice: boolean;
}

export interface Color {
  name: string;
  id: number;
}

export interface Size {
  name: string;
  origName: string;
  rank: number;
  optionId: number;
  wh: number;
  sign: string;
  sale?: number;
  priceU?: number;
  salePriceU?: number;
  logisticsCost?: number;
}
