import { Router } from "express";
import {
  getProductsWithPriceFromStock,
  getProductWithPrice,
} from "../services/product";
import { Product } from "../models/product";
import { Outlet } from "../models/outlet";
import { OutletStock } from "../models/outletStock";
import { IOutletOrder, OutletOrder } from "../models/outletOrder";
import { FilterQuery } from "mongoose";
import { IDistributorOrder } from "../models/distributorOrder";
import { OrderStatuses } from "@presacom/models";
import { updateStockAfterOrder } from "../services/stock";
import { DistributorStock } from "../models/distributorStock";

export const outletRouter = Router();

outletRouter.get('/', async (req, res, next) => {
  try {
    const suppliers = await Outlet.find().exec();

    res.send(suppliers);
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

outletRouter.get('/:outletId', async (req, res, next) => {
  try {
    const supplier = await Outlet.findById(req.params.outletId).exec();

    res.send(supplier);
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

outletRouter.get('/:outletId/product', async (req, res, next) => {
  try {
    const stock = await OutletStock.find({ outletId: req.params.outletId }).exec();
    const products = getProductsWithPriceFromStock(stock);

    res.send(products);
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

outletRouter.post('/:outletId/order', async (req, res, next) => {
  try {
    const order = await OutletOrder.create(req.body);

    await updateStockAfterOrder(order, DistributorStock, false, {});
    await updateStockAfterOrder(order, OutletStock, true, { outletId: req.body.outletId });
    res.send();
  } catch (e) {
    next(e);
  }
});

outletRouter.get('/:outletId/order', async (req, res, next) => {
  try {
    const query: FilterQuery<IOutletOrder> = { outletId: req.params.outletId };
    if (req.query.startTime && req.query.endTime) {
      query.created_at = {
        $gte: new Date(req.query.startTime as string),
        $lt: new Date(req.query.endTime as string)
      };
    }
    if (req.query.status) {
      query.status = req.query.status as OrderStatuses;
    }
    const order = await OutletOrder.find(query).exec();
    res.send(order);
  } catch (e) {
    next(e);
  }
});
