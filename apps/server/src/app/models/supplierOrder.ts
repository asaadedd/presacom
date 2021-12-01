import { model, Model, Schema, Document } from "mongoose";
import { SupplierOrderDto } from "@presacom/models";

export type ISupplierOrder = SupplierOrderDto & Document;

const supplierOrderSchema = new Schema( {
  type: { type: String, required: true },
  price: { type: Number, required: true },
  returned: { type: Boolean, required: false },
  entries: [{ productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const SupplierOrder: Model<ISupplierOrder> = model('SupplierOrder', supplierOrderSchema);
