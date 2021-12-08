export interface OrderEntry {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  price: number;
  returned?: boolean;
  entries: OrderEntry[];
  __v?: any;
  _id?: string;
}

export interface SupplierOrderDto extends OrderDto {
  supplierId: string;
}

export interface OutletOrderDto extends OrderDto {
  outletId: string;
}

export interface DistributorOrderDto extends OrderDto {
  outletId: string;
}
