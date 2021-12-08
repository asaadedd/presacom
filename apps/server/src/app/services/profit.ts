import { OrderDto } from "@presacom/models";

export function calculateProfit(incomingOrders: OrderDto[], outgoingOrders: OrderDto[]): number {
  let profit = 0;
  incomingOrders.forEach((order) => {
    profit += order.price;
  });
  outgoingOrders.forEach((order) => {
    profit -= order.price;
  });

  return profit;
}
