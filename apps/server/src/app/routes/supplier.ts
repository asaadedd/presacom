import {Router} from "express";
import { Supplier } from "../models/supplier";
import { Product } from "../models/product";
import { SupplierStock } from "../models/supplierStock";
import { getProductsForSupplier, getProductWithPrice, updateSupplierStockAfterOrder } from "../services/product";
import { SupplierOrder } from "../models/supplierOrder";
import { read, readFile, utils } from "xlsx";
import { UploadedFile } from "express-fileupload";
import { toArrayBuffer } from "../utils/bufToArrayBuffer";
import { formatTableData } from "../utils/file";
import { FilterQuery } from "mongoose";
import { SupplierOrderDto } from "@presacom/models";

export const supplierRouter = Router();

supplierRouter.get('/', async (req, res, next) => {
  try {
    const suppliers = await Supplier.find().exec();

    res.send(suppliers);
  } catch (e) {
    next(e);
  }
});

supplierRouter.get('/:supplierId', async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.supplierId).exec();

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

supplierRouter.get('/:supplierId/product', async (req, res, next) => {
  try {
    const products = await getProductsForSupplier(req.params.supplierId);

    res.send(products);
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
    const file = req.files.file as UploadedFile
    const wb = read(toArrayBuffer(file.data));
    const data: string[][] = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header:1 });
    const suppliers = formatTableData(data);
    await Promise.all(suppliers.map((sup) => {
      return Supplier.create(sup);
    }));
    res.send();
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/:supplierId/product', async (req, res, next) => {
  try {
    const productInfo = await Product.create(req.body);
    const productStock = await SupplierStock.create({
      productId: productInfo._id,
      supplierId: req.params.supplierId,
      price: req.body.price,
      quantity: req.body.quantity,
    });

    res.send(getProductWithPrice(productInfo, productStock));
  } catch (e) {
    next(e);
  }
});

supplierRouter.put('/:supplierId/product/:productId', async (req, res, next) => {
  try {
    const productInfo = await Product.findById(req.params.productId).exec();
    const productStock = await SupplierStock.findOneAndUpdate({ productId: productInfo._id }, {
      ...( req.body.quantity ? { $inc: {quantity: req.body.quantity}}: {} ),
      ...( req.body.price ? { price: req.body.price } : {})
    }).exec();

    res.send(getProductWithPrice(productInfo, productStock));
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

supplierRouter.put('/:supplierId', async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(req.params.supplierId, req.body).exec();

    res.send(supplier);
  } catch (e) {
    next(e);
  }
});

supplierRouter.post('/order', async (req, res, next) => {
  try {
    const order = await SupplierOrder.create(req.body);

    await updateSupplierStockAfterOrder(order);
    res.send();
  } catch (e) {
    next(e);
  }
});

supplierRouter.get('/order', async (req, res, next) => {
  try {
    const query: FilterQuery<SupplierOrderDto> = { returned: {$eq: !!req.query.returned} };
    if (req.query.startTime && req.query.endTime) {
      query.created_at = {
        $gte: new Date(req.query.startTime as string),
        $lt: new Date(req.query.endTime as string)
      };
    }
    if (req.query.supplierId)  {
      query.supplierId = req.query.supplierId as string;
    }
    const order = await SupplierOrder.find(query).exec();
    res.send(order);
  } catch (e) {
    next(e);
  }
});
