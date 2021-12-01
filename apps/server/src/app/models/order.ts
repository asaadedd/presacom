import { model, Model, Schema, Document } from "mongoose";
import { DistributorOrderDto } from "@presacom/models";

export type IOrder = DistributorOrderDto & Document;

const orderSchema = new Schema( {
  type: { type: String, required: true },
  price: { type: Number, required: true },
  returned: { type: Boolean, required: false },
  entries: [{ productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const Order: Model<IOrder> = model('Order', orderSchema);
