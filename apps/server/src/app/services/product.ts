import { OrderDto, ProductWithStock } from "@presacom/models";
import { IProduct, Product } from "../models/product";
import { ISupplierStock, SupplierStock } from "../models/supplierStock";
import { IOutletStock } from "../models/outletStock";

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

export async function updateSupplierStockAfterOrder(order: OrderDto) {
  await Promise.all(order.entries.map((entry) => {
    return SupplierStock.findOneAndUpdate({ productId: entry.productId }, {
      $inc: {
        quantity: -entry.quantity
      }
    }).exec();
  }));
}

