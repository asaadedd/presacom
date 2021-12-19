import { model, Model, Schema, Document } from "mongoose";
import { OutletOrderDto } from "@presacom/models";

export type IOutletOrder = OutletOrderDto & Document;

const outletOrderSchema = new Schema( {
  price: { type: Number, required: true },
  returned: { type: Boolean, required: false },
  entries: [{ productName: String, productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const OutletOrder: Model<IOutletOrder> = model('OutletOrder', outletOrderSchema);
