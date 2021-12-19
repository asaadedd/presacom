import { ProductWithStock, SupplierDto, SupplierOrderDto } from "@presacom/models";
import { CustomOrderInformation } from "../../../shared/models/orders";
import { TableHeader } from "../../../shared/models/table";

export interface SupplierInformation extends SupplierDto {
  products?: ProductWithStock[];
  orders?: CustomOrderInformation<SupplierOrderDto>[];
}

export enum SuppliersHeadersKeys {
  NAME = 'name',
  REGISTRATION_NUMBER = 'registrationNumber',
  CUI = 'cui',
  ADDRESS = 'address',
  PHONE_NUMBER = 'phoneNumber',
  IBAN = 'iban',
  EMAIL = 'email',
}

export const supplierHeaders: TableHeader<SuppliersHeadersKeys>[] = [
  {
    key: SuppliersHeadersKeys.NAME,
    name: 'Nume'
  },
  {
    key: SuppliersHeadersKeys.REGISTRATION_NUMBER,
    name: 'Nr inregistrare'
  },
  {
    key: SuppliersHeadersKeys.CUI,
    name: 'CUI'
  },
  {
    key: SuppliersHeadersKeys.ADDRESS,
    name: 'Adresa'
  },
  {
    key: SuppliersHeadersKeys.PHONE_NUMBER,
    name: 'Numar de telefon'
  },
  {
    key: SuppliersHeadersKeys.IBAN,
    name: 'IBAN'
  },
  {
    key: SuppliersHeadersKeys.EMAIL,
    name: 'Email'
  }
];

