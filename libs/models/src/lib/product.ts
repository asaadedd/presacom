export enum ProductTypes {
  NEWSPAPER = 'NEWSPAPER',
  MAGAZINE = 'MAGAZINE',
}

export interface ProductDto {
  title: string;
  type: ProductTypes;
  __v?: any;
  _id?: string;
}

export interface ProductWithStock extends ProductDto {
  price: number;
  quantity: number;
}
