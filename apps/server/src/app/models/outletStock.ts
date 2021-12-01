import { model, Model, Schema, Document } from "mongoose";
import { OutletStockDto } from "@presacom/models";

export type IOutletStock = OutletStockDto & Document;

const outletStockSchema = new Schema( {
  productId: { type: Schema.Types.ObjectId, required: true },
  outletId: { type: Schema.Types.ObjectId, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, {
  timestamps: true,
});

export const OutletStock: Model<IOutletStock> = model('OutletStock', outletStockSchema);
