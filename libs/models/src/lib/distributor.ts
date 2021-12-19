import { OrderDto } from "./order";
import { StockDto } from "./stock";

export type DistributorStockDto = StockDto & {
  supplierId: string;
};
export type DistributorOrderDto = OrderDto;
