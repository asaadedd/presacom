import { model, Model, Schema, Document } from "mongoose";
import { OutletOrderDto } from "@presacom/models";

export type IOutletOrder = OutletOrderDto & Document;

const outletOrderSchema = new Schema( {
  price: { type: Number, required: true },
  outletId: { type: String, required: true },
  status: { type: String, required: true },
  entries: [{ productName: String, productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const OutletOrder: Model<IOutletOrder> = model('OutletOrder', outletOrderSchema);
