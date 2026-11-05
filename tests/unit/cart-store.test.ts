import { beforeEach, describe, expect, it } from "vitest";
import { products } from "@/lib/catalog";
import { useCartStore } from "@/stores/cart-store";

const product = products.find((item) => item.stock > 1)!;

beforeEach(() => {
  useCartStore.setState({ items: [], announcement: "" });
});

describe("cart store", () => {
  it("merges repeated additions and never exceeds available stock", () => {
    useCartStore.getState().addItem(product, product.stock);
    useCartStore.getState().addItem(product, 2);

    expect(useCartStore.getState().items).toEqual([{ product, quantity: product.stock }]);
  });

  it("updates and removes quantities and clears the cart", () => {
    useCartStore.getState().addItem(product, 2);
    useCartStore.getState().updateQuantity(product.id, 3);
    expect(useCartStore.getState().items[0]?.quantity).toBe(3);

    useCartStore.getState().updateQuantity(product.id, 0);
    expect(useCartStore.getState().items).toHaveLength(0);

    useCartStore.getState().addItem(product);
    useCartStore.getState().clearCart();
    expect(useCartStore.getState().items).toHaveLength(0);
  });

  it("does not add an out-of-stock item", () => {
    const outOfStock = { ...product, stock: 0 };
    useCartStore.getState().addItem(outOfStock);

    expect(useCartStore.getState().items).toHaveLength(0);
    expect(useCartStore.getState().announcement).toContain("out of stock");
  });
});
