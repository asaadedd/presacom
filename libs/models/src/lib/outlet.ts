export interface OutletDto {
  name: string;
  address: string;
  phoneNumber?: string;
  email?: string;
}

export interface OutletStockDto {
  productId: string;
  outletId: string;
  price: number;
  quantity: number;
}
