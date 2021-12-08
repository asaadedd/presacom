import { Router } from "express";
import { updateDistributorStockAfterOrder } from "../services/product";
import { DistributorOrder } from "../models/distributorOrder";
import { SupplierOrder } from "../models/supplierOrder";
import { calculateProfit } from "../services/profit";

export const distributorRouter = Router();

distributorRouter.post('/order', async (req, res, next) => {
  try {
    const order = await DistributorOrder.create(req.body);

    await updateDistributorStockAfterOrder(order);
    res.send();
  } catch (e) {
    next(e);
  }
});

distributorRouter.get('/order', async (req, res, next) => {
  try {
    const order = await DistributorOrder.find({
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

distributorRouter.post('/profit', async (req, res, next) => {
  try {
    const incomingOrders = await DistributorOrder.find({
      ...(req.query.startTime && req.query.endTime ? {
        created_at: {
          $gte: new Date(req.query.startTime as string),
          $lt: new Date(req.query.endTime as string)
        }
      } : {}),
      returned: false
    }).exec();
    const outgoingOrders = await SupplierOrder.find({
      ...(req.query.startTime && req.query.endTime ? {
        created_at: {
          $gte: new Date(req.query.startTime as string),
          $lt: new Date(req.query.endTime as string)
        }
      } : {}),
      returned: false
    }).exec();

    res.send(calculateProfit(incomingOrders, outgoingOrders));
  } catch (e) {
    next(e);
  }
});
