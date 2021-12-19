import { model, Model, Schema, Document } from "mongoose";
import { SupplierOrderDto } from "@presacom/models";

export type ISupplierOrder = SupplierOrderDto & Document;

const supplierOrderSchema = new Schema( {
  supplierId: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true },
  entries: [{ productName: String, productId: String, quantity: Number, unitPrice: Number }],
}, {
  timestamps: true,
} );

export const SupplierOrder: Model<ISupplierOrder> = model('SupplierOrder', supplierOrderSchema);
