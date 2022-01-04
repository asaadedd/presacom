import { model, Model, Schema, Document } from "mongoose";
import { DistributorOrderDto } from "@presacom/models";

export type IDistributorOrder = DistributorOrderDto & Document;

const orderSchema = new Schema( {
  supplierId: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  entries: [{ productName: String, productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const DistributorOrder: Model<IDistributorOrder> = model('DistributorOrder', orderSchema);
