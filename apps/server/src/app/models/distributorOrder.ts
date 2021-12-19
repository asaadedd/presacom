import { model, Model, Schema, Document } from "mongoose";
import { DistributorOrderDto } from "@presacom/models";

export type IDistributorOrder = DistributorOrderDto & Document;

const orderSchema = new Schema( {
  price: { type: Number, required: true },
  returned: { type: Boolean, required: false },
  entries: [{ productName: String, productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const DistributorOrder: Model<IDistributorOrder> = model('DistributorOrder', orderSchema);
