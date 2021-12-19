import { TableHeader } from "./table";

export enum ProductKeys {
  TITLE = 'title',
  TYPE = 'type',
  PRICE = 'price',
  QUANTITY = 'quantity',
}

export const productHeaders: TableHeader<ProductKeys>[] = [
  {
    key: ProductKeys.TITLE,
    name: 'Titlul'
  },
  {
    key: ProductKeys.TYPE,
    name: 'Tipul produsului'
  },
  {
    key: ProductKeys.PRICE,
    name: 'Pretul'
  },
  {
    key: ProductKeys.QUANTITY,
    name: 'Cantitate'
  },
];
