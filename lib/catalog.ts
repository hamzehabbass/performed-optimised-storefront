import productSnapshot from "@/data/products.json";
import type { ProductSnapshot } from "@/lib/types";

const snapshot = productSnapshot as ProductSnapshot;

export const products = snapshot.products;
export const categories = snapshot.categories;
export const snapshotDate = snapshot.snapshotDate;
