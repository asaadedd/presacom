import { Router } from "express";
import {
  getProductsForOutlet,
  getProductWithPrice,
  updateOutletStockAfterOrder,
} from "../services/product";
import { Product } from "../models/product";
import { Outlet } from "../models/outlet";
import { OutletStock } from "../models/outletStock";
import { OutletOrder } from "../models/outletOrder";

export const outletRouter = Router();

outletRouter.get('/', async (req, res, next) => {
  try {
    const suppliers = await Outlet.find().exec();

    res.send(suppliers);
  } catch (e) {
    next(e);
  }
});

outletRouter.get('/:outletId', async (req, res, next) => {
  try {
    const supplier = await Outlet.findById(req.params.outletId).exec();

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

outletRouter.get('/:outletId/product', async (req, res, next) => {
  try {
    const products = await getProductsForOutlet(req.params.outletId);

    res.send(products);
  } catch (e) {
    next(e);
  }
});

outletRouter.post('/', async (req, res, next) => {
  try {
    const supplier = await Outlet.create(req.body);

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

outletRouter.post('/:outletId/product', async (req, res, next) => {
  try {
    const productInfo = await Product.create(req.body);
    const productStock = await OutletStock.create({
      productId: productInfo._id,
      outletId: req.params.outletId,
      price: req.body.price,
      quantity: req.body.quantity,
    });

    res.send(getProductWithPrice(productInfo, productStock));
  } catch (e) {
    next(e);
  }
});

outletRouter.put('/:outletId/product/:productId', async (req, res, next) => {
  try {
    const productInfo = await Product.findById(req.params.productId).exec();
    const productStock = await OutletStock.findOneAndUpdate({productId: productInfo._id}, {
      ...(req.body.quantity ? {$inc: {quantity: req.body.quantity}} : {}),
      ...(req.body.price ? {price: req.body.price} : {})
    }).exec();

    res.send(getProductWithPrice(productInfo, productStock));
  } catch (e) {
    next(e);
  }
});

outletRouter.delete('/:outletId', async (req, res, next) => {
  try {
    await Outlet.findByIdAndDelete(req.params.outletId).exec();

    res.send();
  } catch (e) {
    next(e);
  }
});

outletRouter.put('/:outletId', async (req, res, next) => {
  try {
    const supplier = await Outlet.findByIdAndUpdate(req.params.outletId, req.body).exec();

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

outletRouter.post('/order', async (req, res, next) => {
  try {
    const order = await OutletOrder.create(req.body);

    await updateOutletStockAfterOrder(order);
    res.send();
  } catch (e) {
    next(e);
  }
});

outletRouter.get('/order', async (req, res, next) => {
  try {
    const order = await OutletOrder.find({
      ...(req.query.startTime && req.query.endTime ? {
        created_at: {
          $gte: new Date(req.query.startTime as string),
          $lt: new Date(req.query.endTime as string)
        }
      } : {}),
      returned: {$eq: !!req.query.returned}
    }).exec();
    res.send(order);
  } catch (e) {
    next(e);
  }
});
