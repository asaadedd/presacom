export interface SupplierDto {
  name: string;
  registrationNumber: string;
  cui: string;
  address: string;
  phoneNumber?: string;
  iban: string;
  email?: string;
}

export interface SupplierStockDto {
  productId: string;
  supplierId: string;
  price: number;
  quantity: number;
}


