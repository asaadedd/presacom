import { Router } from "express";
import { DistributorOrder, IDistributorOrder } from "../models/distributorOrder";
import { SupplierOrder } from "../models/supplierOrder";
import { FilterQuery } from "mongoose";
import { OrderStatuses } from "@presacom/models";
import { updateStockAfterOrder } from "../services/stock";
import { DistributorStock } from "../models/distributorStock";
import { OutletStock } from "../models/outletStock";
import { getProductsWithPriceFromStock } from "../utils/product";
import { getProfit } from '../services/profit';

export const distributorRouter = Router();

distributorRouter.post('/order', async (req, res, next) => {
  try {
    const order = await DistributorOrder.create(req.body);

    await updateStockAfterOrder(order, DistributorStock, false, {});
    await updateStockAfterOrder(order, OutletStock, true, { outletId: req.body.outletId }, 15);
    res.send();
  } catch (e) {
    next(e);
  }
});

distributorRouter.get('/order', async (req, res, next) => {
  try {
    const query: FilterQuery<IDistributorOrder> = {};
    if (req.query.startTime && req.query.endTime) {
      query.created_at = {
        $gte: new Date(req.query.startTime as string),
        $lt: new Date(req.query.endTime as string)
      };
    }
    if (req.query.status) {
      query.status = req.query.status as OrderStatuses;
    }
    const order = await DistributorOrder.find(query).exec();
    res.send(order);
  } catch (e) {
    next(e);
  }
});

distributorRouter.post('/order/:orderId/return', async (req, res, next) => {
  try {
    const order = await DistributorOrder.findOne({ _id: req.params.orderId }).exec();

    if (order.status !== OrderStatuses.RETURNED) {
      await DistributorOrder.findOneAndUpdate({ _id: req.params.orderId }, { $set: {status: OrderStatuses.RETURNED} }, {new: true}).exec();

      await updateStockAfterOrder(order, OutletStock, false, { outletId: req.body.outletId });
      await updateStockAfterOrder(order, DistributorStock, true, {});
    }

    res.send();
  } catch (e) {
    next(e);
  }
});

distributorRouter.get('/product', async (req, res, next) => {
  try {
    const stock = await DistributorStock.find().exec();
    const products = await getProductsWithPriceFromStock(stock);

    res.send(products);
  } catch (e) {
    next(e);
  }
});

distributorRouter.get('/profit', async (req, res, next) => {
  try {
    if (!req.query.groupBy || !req.query.startTime || !req.query.endTime) {
      throw new Error('missing one of the parameters: groupBy, startTime, endTime');
    }

    res.send(await getProfit(DistributorOrder, SupplierOrder, req.query as any, {}));
  } catch (e) {
    next(e);
  }
});
