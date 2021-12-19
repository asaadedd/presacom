import { OrderDto } from "@presacom/models";
import { Model } from "mongoose";
import { StockDto } from "@presacom/models";

export async function updateStockAfterOrder(order: OrderDto, stockModel: Model<StockDto>, increase: boolean, additionalParams: any) {
  await Promise.all(order.entries.map(async (entry) => {
    const update = increase
      ? {$inc: {quantity: entry.quantity}}
      : {$inc: {quantity: -entry.quantity}};
    const iStockPresent = await stockModel.findOne({ productId: entry.productId }).exec();
    if (iStockPresent) {
      await stockModel.findOneAndUpdate({ productId: entry.productId }, update).exec();
    } else {
      await stockModel.create({
        ...additionalParams,
        productId: entry.productId,
        price: entry.unitPrice,
        quantity: entry.quantity,
      });
    }
  }));
}
