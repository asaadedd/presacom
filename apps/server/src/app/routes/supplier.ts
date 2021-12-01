import {Router} from "express";
import { Supplier } from "../models/supplier";
import { Product } from "../models/product";
import { SupplierStock } from "../models/supplierStock";
import { getProductsForSupplier, getProductWithPrice, updateSupplierStockAfterOrder } from "../services/product";
import { SupplierOrder } from "../models/supplierOrder";

export const supplierRouter = Router();

supplierRouter.get('/', async (req, res) => {
  const suppliers = await Supplier.find().exec();

  res.send(suppliers);
});

supplierRouter.get('/:supplierId', async (req, res) => {
  const supplier = await Supplier.findById(req.params.supplierId).exec();

  res.send(supplier);
});

supplierRouter.get('/:supplierId/product', async (req, res) => {
  const products = await getProductsForSupplier(req.params.supplierId);

  res.send(products);
});

supplierRouter.post('/', async (req, res) => {
  const supplier = await Supplier.create(req.body);

  res.send(supplier);
});

supplierRouter.post('/:supplierId/product', async (req, res) => {
  const productInfo = await Product.create(req.body);
  const productStock = await SupplierStock.create({
    productId: productInfo._id,
    supplierId: req.params.supplierId,
    price: req.body.price,
    quantity: req.body.quantity,
  });

  res.send(getProductWithPrice(productInfo, productStock));
});

supplierRouter.put('/:supplierId/product/:productId', async (req, res) => {
  const productInfo = await Product.findById(req.params.productId).exec();
  const productStock = await SupplierStock.findOneAndUpdate({ productId: productInfo._id }, {
    ...( req.body.quantity ? { $inc: {quantity: req.body.quantity}}: {} ),
    ...( req.body.price ? { price: req.body.price } : {})
  }).exec();

  res.send(getProductWithPrice(productInfo, productStock));
});

supplierRouter.delete('/:supplierId', async (req, res) => {
  await Supplier.findByIdAndDelete(req.params.supplierId).exec();

  res.send();
});

supplierRouter.put('/:supplierId', async (req, res) => {
  const supplier = await Supplier.findByIdAndUpdate(req.params.supplierId, req.body).exec();

  res.send(supplier);
});

supplierRouter.post('/postOrder', async (req, res) => {
  const order = await SupplierOrder.create(req.body);

  await updateSupplierStockAfterOrder(order);
  res.send();
});
