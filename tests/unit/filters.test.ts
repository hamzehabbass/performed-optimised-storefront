import { describe, expect, it } from "vitest";
import { filterProducts } from "@/lib/filters";
import { products } from "@/lib/catalog";
import { discountedPrice } from "@/lib/pricing";

describe("catalogue filters", () => {
  it("searches actual snapshot titles and brands without case sensitivity", () => {
    const sample = products.find((product) => product.title.length > 3)!;
    const results = filterProducts(products, {
      query: sample.title.slice(0, 3).toUpperCase(),
      category: "",
      minPrice: null,
      maxPrice: null,
      minRating: 0,
      inStock: false,
      sort: "featured",
    });

    expect(results.some((product) => product.id === sample.id)).toBe(true);
    expect(results.every((product) => product.title.toLowerCase().includes(sample.title.slice(0, 3).toLowerCase()) ||
      product.brand?.toLowerCase().includes(sample.title.slice(0, 3).toLowerCase()) ||
      product.category.toLowerCase().includes(sample.title.slice(0, 3).toLowerCase()))).toBe(true);
  });

  it("combines category, rating, price and stock filters", () => {
    const category = products.find((product) => product.stock > 0)!.category;
    const results = filterProducts(products, {
      query: "",
      category,
      minPrice: 1,
      maxPrice: 500,
      minRating: 3,
      inStock: true,
      sort: "featured",
    });

    expect(results.length).toBeGreaterThan(0);
    expect(results.every((product) =>
      product.category === category &&
      discountedPrice(product.price, product.discountPercentage) >= 1 &&
      discountedPrice(product.price, product.discountPercentage) <= 500 &&
      product.rating >= 3 &&
      product.stock > 0)).toBe(true);
  });

  it("sorts by discounted price and by rating", () => {
    const ascending = filterProducts(products, {
      query: "", category: "", minPrice: null, maxPrice: null, minRating: 0, inStock: false, sort: "price-asc",
    });
    const descendingRating = filterProducts(products, {
      query: "", category: "", minPrice: null, maxPrice: null, minRating: 0, inStock: false, sort: "rating",
    });

    expect(ascending[0]!.price * (1 - ascending[0]!.discountPercentage / 100))
      .toBeLessThanOrEqual(ascending.at(-1)!.price * (1 - ascending.at(-1)!.discountPercentage / 100));
    expect(descendingRating[0]!.rating).toBeGreaterThanOrEqual(descendingRating.at(-1)!.rating);
  });
});
