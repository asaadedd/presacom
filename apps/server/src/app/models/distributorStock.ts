import { model, Model, Schema, Document } from "mongoose";
import { DistributorStockDto } from "@presacom/models";

export type IDistributorStock = DistributorStockDto & Document;

const distributorStockSchema = new Schema( {
  productId: { type: Schema.Types.ObjectId, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, {
  timestamps: true,
});

export const DistributorStock: Model<IDistributorStock> = model('DistributorStock', distributorStockSchema);
