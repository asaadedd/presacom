import { TableHeader } from "../../features/supplier/models/suppliers";

export interface CustomOrderEntry {
  productName?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: string;
}

export interface CustomOrderInformation {
  _id?: string;
  price: number;
  returned?: boolean;
  entries: CustomOrderEntry[];
}

export enum OrderKeys {
  NUMBER = 'NUMBER',
  PRODUCT_NAME = 'productName',
  QUANTITY = 'quantity',
  UNIT_PRICE = 'unitPrice',
  TOTAL_PRICE = 'totalPrice',
  RETURNED = 'returned',
  ORDER_PRICE = 'orderPrice'
}

export const orderHeader: TableHeader<OrderKeys>[] = [
  {
    key: OrderKeys.NUMBER,
    name: 'Numarul comenzii'
  },
  {
    key: OrderKeys.RETURNED,
    name: 'Retur'
  },
  {
    key: OrderKeys.ORDER_PRICE,
    name: 'Pretul comenzi'
  },
  {
    key: OrderKeys.PRODUCT_NAME,
    name: 'Nume produs'
  },
  {
    key: OrderKeys.QUANTITY,
    name: 'Cantitate'
  },
  {
    key: OrderKeys.UNIT_PRICE,
    name: 'Pret unitar'
  },
  {
    key: OrderKeys.TOTAL_PRICE,
    name: 'Pret total'
  },
];
