import { Router } from "express";
import { Supplier } from "../models/supplier";
import { Product } from "../models/product";
import { SupplierStock } from "../models/supplierStock";
import { getProductsWithPriceFromStock } from "../services/product";
import { ISupplierOrder, SupplierOrder } from "../models/supplierOrder";
import { UploadedFile } from "express-fileupload";
import { getDataFromFile } from "../utils/file";
import { FilterQuery } from "mongoose";
import { updateStockAfterOrder } from "../services/stock";
import { DistributorStock } from "../models/distributorStock";
import { OrderStatuses } from "@presacom/models";

export const supplierRouter = Router();

supplierRouter.get('/', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().exec();

    res.send(suppliers);
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/', async (req, res, next) => {
  try {
    const supplier = await Supplier.create(req.body);

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/import', async (req, res, next) => {
  try {
    const file = req.files.file as UploadedFile;
    const suppliers = getDataFromFile(file);
    await Promise.all(suppliers.map(async (sup) => {
      const alreadyPresent = await Supplier.findOne({ cui: sup.cui }).exec();
      if (!alreadyPresent) {
        return Supplier.create(sup);
      }
    }));
    res.send();
  } catch (e) {
    next(e);
  }
});

supplierRouter.get('/:supplierId', async (req, res, next) => {
  try {
    console.log(11, req.params.supplierId)
    const supplier = await Supplier.findById(req.params.supplierId).exec();
    console.log(22, supplier)

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

supplierRouter.delete('/:supplierId', async (req, res, next) => {
  try {
    await Supplier.findByIdAndDelete(req.params.supplierId).exec();

    res.send();
  } catch (e) {
    next(e);
  }
});

supplierRouter.get('/:supplierId/product', async (req, res, next) => {
  try {
    const stock = await SupplierStock.find({ supplierId: req.params.supplierId }).exec();
    const products = await getProductsWithPriceFromStock(stock);

    res.send(products);
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/:supplierId/product/import', async (req, res, next) => {
  try {
    const file = req.files.file as UploadedFile;
    const products = getDataFromFile(file);
    await Promise.all(products.map(async (product) => {
      const alreadyPresent = await Product.findOne({ title: product.title }).exec();
      const productInfo = !alreadyPresent ? await Product.create(product) : alreadyPresent;
      const stockExists = await SupplierStock.findOne({ productId: productInfo._id }).exec();
      if (stockExists) {
        await SupplierStock.updateOne({ productId: productInfo._id }, {
          $inc: {
            quantity: parseInt(product.quantity, 10)
          }
        }).exec();
      } else {
        await SupplierStock.create({
          productId: productInfo._id,
          supplierId: req.params.supplierId,
          price: product.price,
          quantity: product.quantity,
        });
      }
    }));
    res.send();
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/:supplierId/order', async (req, res, next) => {
  try {
    const order = await SupplierOrder.create(req.body);

    await updateStockAfterOrder(order, SupplierStock, false, { supplierId: req.params.supplierId });
    await updateStockAfterOrder(order, DistributorStock, true, { supplierId: req.params.supplierId });
    res.send();
  } catch (e) {
    next(e);
  }
});

supplierRouter.get('/:supplierId/order', async (req, res, next) => {
  try {
    const query: FilterQuery<ISupplierOrder> = { supplierId: req.params.supplierId };
    if (req.query.startTime && req.query.endTime) {
      query.created_at = {
        $gte: new Date(req.query.startTime as string),
        $lt: new Date(req.query.endTime as string)
      };
    }
    if (req.query.status) {
      query.status = req.query.status as OrderStatuses;
    }
    const order = await SupplierOrder.find(query).exec();
    res.send(order);
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/:supplierId/order/:orderId/return', async (req, res, next) => {
  try {
    const order = await SupplierOrder.findOne({ _id: req.params.orderId }).exec();

    if (order.status !== OrderStatuses.RETURNED) {
      console.log(111, order);
      const a = await SupplierOrder.findOneAndUpdate({ _id: req.params.orderId }, { $set: {status: OrderStatuses.RETURNED} }, {new: true}).exec();
      console.log(222, a);

      await updateStockAfterOrder(order, SupplierStock, true, { supplierId: req.params.supplierId });
      console.log(333);
      await updateStockAfterOrder(order, DistributorStock, false, { supplierId: req.params.supplierId });
    }
    console.log(444);

    res.send();
  } catch (e) {
    next(e);
  }
});
