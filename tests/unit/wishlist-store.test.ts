import { beforeEach, describe, expect, it } from "vitest";
import { products } from "@/lib/catalog";
import { useWishlistStore } from "@/stores/wishlist-store";

beforeEach(() => {
  useWishlistStore.setState({ products: [], announcement: "" });
});

describe("wishlist store", () => {
  it("adds a product and toggles it back out", () => {
    const product = products[0]!;
    useWishlistStore.getState().toggleProduct(product);
    expect(useWishlistStore.getState().products).toEqual([product]);

    useWishlistStore.getState().toggleProduct(product);
    expect(useWishlistStore.getState().products).toHaveLength(0);
  });
});
