export enum ProductTypes {
  NEWSPAPER = 'NEWSPAPER',
  MAGAZINE = 'MAGAZINE',
}

export interface ProductDto {
  title: string;
  type: ProductTypes;
}

export interface ProductWithStock extends ProductDto {
  price: number;
  quantity: number;
}
