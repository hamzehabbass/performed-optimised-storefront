import type { CartItem, ShippingMethod } from "@/lib/types";

export const FREE_SHIPPING_THRESHOLD = 75;
export const STANDARD_SHIPPING = 6.99;
export const EXPRESS_SHIPPING = 14.99;

export function discountedPrice(price: number, discountPercentage: number): number {
  return roundCurrency(price * (1 - discountPercentage / 100));
}

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function getCartTotals(items: CartItem[], method: ShippingMethod = "standard") {
  const subtotal = roundCurrency(
    items.reduce((total, item) => total + item.product.price * item.quantity, 0),
  );
  const savings = roundCurrency(
    items.reduce(
      (total, item) =>
        total +
        (item.product.price - discountedPrice(item.product.price, item.product.discountPercentage)) *
          item.quantity,
      0,
    ),
  );
  const shipping =
    subtotal === 0
      ? 0
      : method === "express"
        ? EXPRESS_SHIPPING
        : subtotal >= FREE_SHIPPING_THRESHOLD
          ? 0
          : STANDARD_SHIPPING;
  const total = roundCurrency(subtotal - savings + shipping);

  return { subtotal, savings, shipping, total };
}
