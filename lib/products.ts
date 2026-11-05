import fullProducts from "@/data/products-full.json";
import { products } from "@/lib/catalog";
import type { Product, ProductSummary } from "@/lib/types";

export { categories, products, snapshotDate } from "@/lib/catalog";

const productsById = new Map<number, Product>(
  (fullProducts as Product[]).map((product) => [product.id, product]),
);

export function getProduct(id: number): Product | undefined {
  return productsById.get(id);
}

export function getSummary(id: number): ProductSummary | undefined {
  return products.find((product) => product.id === id);
}

export function getRelatedProducts(product: Product, count = 4): ProductSummary[] {
  return products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, count);
}
