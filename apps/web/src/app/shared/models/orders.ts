import { OrderDto, OrderEntry } from "@presacom/models";
import { TableHeader } from "./table";

export interface CustomOrderEntry extends OrderEntry {
  totalPrice: string;
}

export type CustomOrderInformation<T = OrderDto> = T & {
  entries: CustomOrderEntry[];
}
