import { OrderDto } from "./order";
import { StockDto } from "./stock";

export interface SupplierDto {
  name: string;
  registrationNumber: string;
  cui: string;
  address: string;
  phoneNumber?: string;
  iban: string;
  email?: string;
  __v?: any;
  _id?: string;
}

export interface SupplierStockDto extends StockDto {
  supplierId: string;
}


export interface SupplierOrderDto extends OrderDto {
  supplierId: string;
}

