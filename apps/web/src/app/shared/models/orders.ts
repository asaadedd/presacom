import { OrderDto, OrderEntry } from "@presacom/models";
import { TableHeader } from "./table";

export interface CustomOrderEntry extends OrderEntry {
  totalPrice: string;
}

export type CustomOrderInformation<T = OrderDto> = T & {
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
