import type { ProductSummary } from "@/lib/types";
import { discountedPrice } from "@/lib/pricing";

export type SortOption =
  | "featured"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "discount-desc"
  | "title";

export type ProductFilters = {
  query: string;
  category: string;
  minPrice: number | null;
  maxPrice: number | null;
  minRating: number;
  inStock: boolean;
  sort: SortOption;
};

export const DEFAULT_FILTERS: ProductFilters = {
  query: "",
  category: "",
  minPrice: null,
  maxPrice: null,
  minRating: 0,
  inStock: false,
  sort: "featured",
};

export function filterProducts(
  items: ProductSummary[],
  filters: ProductFilters,
): ProductSummary[] {
  const query = filters.query.trim().toLocaleLowerCase();
  const filtered = items.filter((product) => {
    const matchesQuery =
      !query ||
      [product.title, product.brand, product.category]
        .filter(Boolean)
        .some((value) => value?.toLocaleLowerCase().includes(query) ?? false);
    const currentPrice = discountedPrice(product.price, product.discountPercentage);
    return (
      matchesQuery &&
      (!filters.category || product.category === filters.category) &&
      (filters.minPrice === null || currentPrice >= filters.minPrice) &&
      (filters.maxPrice === null || currentPrice <= filters.maxPrice) &&
      product.rating >= filters.minRating &&
      (!filters.inStock || product.stock > 0)
    );
  });

  switch (filters.sort) {
    case "price-asc":
      return filtered.sort((a, b) => discountedPriceForSort(a) - discountedPriceForSort(b));
    case "price-desc":
      return filtered.sort((a, b) => discountedPriceForSort(b) - discountedPriceForSort(a));
    case "rating":
      return filtered.sort((a, b) => b.rating - a.rating);
    case "discount-desc":
      return filtered.sort(
        (a, b) => b.discountPercentage - a.discountPercentage || a.id - b.id,
      );
    case "title":
      return filtered.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return filtered.sort((a, b) => b.rating - a.rating || a.id - b.id);
  }
}

function discountedPriceForSort(product: ProductSummary): number {
  return product.price * (1 - product.discountPercentage / 100);
}
