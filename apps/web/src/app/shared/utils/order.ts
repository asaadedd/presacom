import { OrderDto } from "@presacom/models";
import { CustomOrderInformation } from "../models/orders";
import { format } from "date-fns";

export function formatOrdersInformation<T extends OrderDto>(order: T[]): CustomOrderInformation<T>[] {
  return order.map((ord) => formatOrder<T>(ord))
}

function formatOrder<T extends OrderDto>(ord: T): CustomOrderInformation<T> {
  return {
    ...ord,
    createdAt: format(new Date(ord.createdAt as string), 'dd-MM-yyyy'),
    entries: ord.entries.map((ent) => {
      return {
        ...ent,
        totalPrice: (ent.unitPrice * ent.quantity).toFixed(2)
      };
    })
  };
}
