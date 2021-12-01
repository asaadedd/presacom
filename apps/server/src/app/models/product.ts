import { model, Model, Schema, Document } from "mongoose";
import { ProductDto } from "@presacom/models";

export type IProduct = ProductDto & Document;

const productSchema = new Schema( {
  title: { type: String, required: true },
  type: { type: String, required: true },
}, {
  timestamps: true,
} );

export const Product: Model<IProduct> = model('Product', productSchema);
