import { OrderDto } from "./order";
import { StockDto } from "./stock";

export interface OutletDto {
  name: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  _id?: string;
}

export interface OutletStockDto extends StockDto {
  outletId: string;
}

export interface OutletOrderDto extends OrderDto {
  outletId: string;
}
