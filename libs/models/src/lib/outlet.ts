export interface OutletDto {
  name: string;
  address: string;
  phoneNumber?: string;
  email?: string;
  __v?: any;
  _id?: string;
}

export interface OutletStockDto {
  productId: string;
  outletId: string;
  price: number;
  quantity: number;
  __v?: any;
  _id?: string;
}
