import { Router } from "express";
import { DistributorOrder, IDistributorOrder } from "../models/distributorOrder";
import { SupplierOrder } from "../models/supplierOrder";
import { calculateProfit } from "../services/profit";
import { FilterQuery } from "mongoose";
import { OrderStatuses } from "@presacom/models";
import { updateStockAfterOrder } from "../services/stock";
import { DistributorStock } from "../models/distributorStock";
import { OutletStock } from "../models/outletStock";

export const distributorRouter = Router();

distributorRouter.post('/order', async (req, res, next) => {
  try {
    const order = await DistributorOrder.create(req.body);

    await updateStockAfterOrder(order, DistributorStock, false, {});
    await updateStockAfterOrder(order, OutletStock, true, { outletId: req.body.outletId });
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
