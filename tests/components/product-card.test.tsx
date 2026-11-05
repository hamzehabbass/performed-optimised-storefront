import type { ComponentProps, ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: ComponentProps<"a"> & { href: string; children: ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

vi.mock("next/image", () => ({
  default: ({ alt = "" }: { alt?: string }) => (
    <span role={alt ? "img" : undefined} aria-label={alt || undefined} aria-hidden={!alt} />
  ),
}));

afterEach(() => {
  cleanup();
  useCartStore.setState({ items: [], announcement: "" });
  useWishlistStore.setState({ products: [], announcement: "" });
});

describe("ProductCard", () => {
  it("adds a real snapshot product to the cart and announces it", () => {
    const product = products.find((item) => item.stock > 0)!;
    render(<ProductCard product={product} />);

    fireEvent.click(screen.getByRole("button", { name: `Add ${product.title} to bag` }));

    expect(useCartStore.getState().items).toEqual([{ product, quantity: 1 }]);
    expect(useCartStore.getState().announcement).toContain(product.title);
  });

  it("toggles the accessible wishlist state", () => {
    const product = products[0]!;
    render(<ProductCard product={product} />);
    const button = screen.getByRole("button", {
      name: `Add ${product.title} to wishlist`,
    });

    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(useWishlistStore.getState().products).toContainEqual(product);
  });
});
