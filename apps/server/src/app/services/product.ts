import { ProductWithStock } from "@presacom/models";
import { IProduct, Product } from "../models/product";
import { StockDto } from "@presacom/models";

export function getProductWithPrice(product: IProduct, stock: StockDto): ProductWithStock {
  return {
    _id: product._id,
    title: product.title,
    type: product.type,
    quantity: stock.quantity,
    price: stock.price
  };
}

export async function getProductsWithPriceFromStock(stock: StockDto[]) {
  const productsIds = stock
    .filter((productStock) => productStock.quantity > 0)
    .map(({ productId }) => productId);
  const products = await Product.find({ _id : { $in : productsIds } }).exec();
  return products.map((prod) => {
    const stockInfo = stock.find(({ productId }) => productId.toString() === prod._id.toString());

    return getProductWithPrice(prod, stockInfo);
  });
}

