import { OrderDto } from "@presacom/models";
import { Model } from "mongoose";
import { StockDto } from "@presacom/models";

export async function updateStockAfterOrder(order: OrderDto, stockModel: Model<StockDto>, increase: boolean, additionalParams: any, diff = 0) {
  await Promise.all(order.entries.map(async (entry) => {
    const update = increase
      ? {$inc: {quantity: entry.quantity}}
      : {$inc: {quantity: -entry.quantity}};
    const iStockPresent = await stockModel.findOne({ productId: entry.productId, ...additionalParams }).exec();
    if (iStockPresent) {
      await stockModel.findOneAndUpdate({ productId: entry.productId, ...additionalParams }, update).exec();
    } else {
      const newPrice = diff ? entry.unitPrice + ((entry.unitPrice * diff) / 100): entry.unitPrice;
      await stockModel.create({
        ...additionalParams,
        productId: entry.productId,
        price: newPrice,
        quantity: entry.quantity,
      });
    }
  }));
}
