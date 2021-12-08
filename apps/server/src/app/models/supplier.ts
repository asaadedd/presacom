import * as mongoose from "mongoose";
import { model, Model, Document } from "mongoose";
import { SupplierDto } from "@presacom/models";
const Schema = mongoose.Schema;

export type ISupplier = SupplierDto & Document;

const supplierSchema = new Schema( {
  name: { type: String, required: true },
  registrationNumber: { type: String, required: true },
  cui: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  iban: { type: String, required: true },
  email: { type: String, required: false },
}, {
  timestamps: true,
} );

export const Supplier: Model<ISupplier> = model('Supplier', supplierSchema);
