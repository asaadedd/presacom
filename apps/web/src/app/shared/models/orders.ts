import { OrderDto, OrderEntry } from "@presacom/models";

export interface CustomOrderEntry extends OrderEntry {
  totalPrice: string;
}

export type CustomOrderInformation<T = OrderDto> = T & {
  entries: CustomOrderEntry[];
}
