import { OrderDto, ProductWithStock } from "@presacom/models";
import { CustomOrderInformation } from "../models/orders";

export function formatOrdersInformation(order: OrderDto[], products: ProductWithStock[]): CustomOrderInformation[] {
  const productsMap = new Map();
  products.forEach((prod) => {
    productsMap.set(prod._id, prod);
  });

  return order.map((ord) => formatOrder(ord, productsMap))
}

function formatOrder(ord: OrderDto, productsMap: Map<string, ProductWithStock>): CustomOrderInformation {
  return {
    _id: ord._id,
    price: ord.price,
    returned: ord.returned,
    entries: ord.entries.map((ent) => {
      return {
        ...ent,
        productName: productsMap.get(ent.productId)?.title,
        totalPrice: (ent.unitPrice * ent.quantity).toFixed(2)
      };
    })
  };
}
