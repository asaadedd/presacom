import { TableHeader } from "../../../shared/models/table";

export enum OutletsHeadersKeys {
  NAME = 'name',
  ADDRESS = 'address',
  PHONE_NUMBER = 'phoneNumber',
  EMAIL = 'email',
}

export const outletsHeaders: TableHeader<OutletsHeadersKeys>[] = [
  {
    key: OutletsHeadersKeys.NAME,
    name: 'Nume'
  },
  {
    key: OutletsHeadersKeys.ADDRESS,
    name: 'Adresa'
  },
  {
    key: OutletsHeadersKeys.PHONE_NUMBER,
    name: 'Numar de telefon'
  },
  {
    key: OutletsHeadersKeys.EMAIL,
    name: 'Email'
  }
];
