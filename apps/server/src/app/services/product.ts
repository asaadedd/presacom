import { DistributorOrderDto, OrderDto, ProductWithStock, SupplierOrderDto } from "@presacom/models";
import { IProduct, Product } from "../models/product";
import { ISupplierStock, SupplierStock } from "../models/supplierStock";
import { IOutletStock, OutletStock } from "../models/outletStock";
import { DistributorStock, IDistributorStock } from "../models/distributorStock";
import { ISupplierOrder } from "../models/supplierOrder";
import { IDistributorOrder } from "../models/distributorOrder";
import { IOutletOrder } from "../models/outletOrder";

export function getProductWithPrice(product: IProduct, stock: ISupplierStock | IOutletStock): ProductWithStock {
  return {
    ...product,
    quantity: stock.quantity,
    price: stock.price
  };
}

export async function getProductsForSupplier(supplierId: string): Promise<ProductWithStock[]> {
  const supplierProductsStock = await SupplierStock.find({ supplierId: supplierId }).exec();
  const productsIds = supplierProductsStock
    .filter((productStock) => productStock.quantity > 0)
    .map(({ productId }) => productId);
  const products = await Product.find({ _id : { $in : productsIds } }).exec();

  return products.map((prod) => {
    const stockInfo = supplierProductsStock.find(({ productId }) => productId === prod._id);

    return getProductWithPrice(prod, stockInfo);
  });
}

export async function getProductsForOutlet(outletId: string): Promise<ProductWithStock[]> {
  const outletProductsStock = await OutletStock.find({ outletId: outletId }).exec();
  const productsIds = outletProductsStock
    .filter((productStock) => productStock.quantity > 0)
    .map(({ productId }) => productId);
  const products = await Product.find({ _id : { $in : productsIds } }).exec();

  return products.map((prod) => {
    const stockInfo = outletProductsStock.find(({ productId }) => productId === prod._id);

    return getProductWithPrice(prod, stockInfo);
  });
}

export async function updateSupplierStockAfterOrder(order: ISupplierOrder) {
  await Promise.all(order.entries.map((entry) => {
    return SupplierStock.findOneAndUpdate({ productId: entry.productId }, {
      $inc: {
        quantity: -entry.quantity
      }
    }).exec();
  }));
}

export async function updateOutletStockAfterOrder(order: IOutletOrder) {
  await Promise.all(order.entries.map((entry) => {
    return OutletStock.findOneAndUpdate({ productId: entry.productId }, {
      $inc: {
        quantity: -entry.quantity
      }
    }).exec();
  }));
}

export async function updateDistributorStockAfterOrder(order: IDistributorOrder) {
  await Promise.all(order.entries.map((entry) => {
    return DistributorStock.findOneAndUpdate({ productId: entry.productId }, {
      $inc: {
        quantity: -entry.quantity
      }
    }).exec();
  }));
}

