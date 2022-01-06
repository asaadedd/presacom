import { OrderDto } from "@presacom/models";
import { CustomOrderInformation } from "../models/orders";
import { compareDesc, format } from "date-fns";

export function formatOrdersInformation<T extends OrderDto>(order: T[]): CustomOrderInformation<T>[] {
  return order
    .sort((firstOrd, secondOrd) => compareDesc(new Date(firstOrd.createdAt as string), new Date(secondOrd.createdAt as string)))
    .map((ord) => formatOrder<T>(ord))
}

function formatOrder<T extends OrderDto>(ord: T): CustomOrderInformation<T> {
  return {
    ...ord,
    createdAt: format(new Date(ord.createdAt as string), 'dd-MM-yyyy HH:mm'),
    entries: ord.entries.map((ent) => {
      return {
        ...ent,
        totalPrice: (ent.unitPrice * ent.quantity).toFixed(2)
      };
    })
  };
}
