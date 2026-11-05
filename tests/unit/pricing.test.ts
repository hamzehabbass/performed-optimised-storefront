import { describe, expect, it } from "vitest";
import { getCartTotals, discountedPrice } from "@/lib/pricing";
import { products } from "@/lib/catalog";
import type { CartItem } from "@/lib/types";

const firstProduct = products.find((product) => product.stock > 0)!;
const secondProduct = products.find(
  (product) => product.id !== firstProduct.id && product.stock > 0,
)!;

describe("pricing", () => {
  it("calculates a discounted unit price to currency precision", () => {
    expect(discountedPrice(19.99, 12.5)).toBe(17.49);
  });

  it("totals item quantities, savings and standard shipping from real snapshot data", () => {
    const items: CartItem[] = [
      { product: firstProduct, quantity: 2 },
      { product: secondProduct, quantity: 1 },
    ];
    const totals = getCartTotals(items);
    const expectedSubtotal = firstProduct.price * 2 + secondProduct.price;

    expect(totals.subtotal).toBe(expectedSubtotal);
    expect(totals.savings).toBeGreaterThanOrEqual(0);
    expect(totals.total).toBeCloseTo(totals.subtotal - totals.savings + totals.shipping, 2);
  });

  it("offers standard shipping over the threshold and charges for express", () => {
    const qualifyingProduct = products.find(
      (product) => product.price * (1 - product.discountPercentage / 100) >= 75,
    );
    if (!qualifyingProduct) throw new Error("Snapshot has no product eligible for free shipping.");

    const item = [{ product: qualifyingProduct, quantity: 1 }];
    expect(getCartTotals(item, "standard").shipping).toBe(0);
    expect(getCartTotals(item, "express").shipping).toBe(14.99);
  });
});
