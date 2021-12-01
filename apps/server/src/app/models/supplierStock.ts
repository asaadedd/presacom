import * as mongoose from "mongoose";
import { model, Model } from "mongoose";
import { SupplierStockDto } from "@presacom/models";
const Schema = mongoose.Schema;

export type ISupplierStock = SupplierStockDto & Document;

const supplierStockSchema = new Schema( {
  productId: { type: String, required: true },
  supplierId: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
}, {
  timestamps: true,
} );

export const SupplierStock: Model<ISupplierStock> = model('SupplierStock', supplierStockSchema);
