import { model, Model, Schema, Document } from "mongoose";
import { OutletDto } from "@presacom/models";

export type IOutlet = OutletDto & Document;

const outletSchema = new Schema( {
  name: { type: String, required: true },
  address: { type: String, required: true },
  phoneNumber: { type: String, required: false },
  email: { type: String, required: false },
}, {
  timestamps: true,
}
);

export const Outlet: Model<IOutlet> = model('Outlet', outletSchema);
