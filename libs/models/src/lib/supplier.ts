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

export interface SupplierStockDto {
  productId: string;
  supplierId: string;
  price: number;
  quantity: number;
  __v?: any;
  _id?: string;
}


