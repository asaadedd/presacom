export enum OrderStatuses {
  DELIVERED = 'livrat',
  RETURNED = 'retur'
}

export interface OrderEntry {
  productName: string;
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderDto {
  price: number;
  status: OrderStatuses;
  entries: OrderEntry[];
  createdAt?: string;
  updatedAt?: string;
  __v?: any;
  _id?: string;
}
