"use client";

import { useState } from "react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { Button } from "hamzehabbass-accessible-ui";
import { Price } from "@/components/price";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { ProductSummary } from "@/lib/types";

type ProductBuyBoxProps = {
  product: ProductSummary;
};

export function ProductBuyBox({ product }: ProductBuyBoxProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const toggleProduct = useWishlistStore((state) => state.toggleProduct);
  const isWishlisted = useWishlistStore((state) =>
    state.products.some((item) => item.id === product.id),
  );
  const available = product.stock > 0;

  function addToBag() {
    addItem(product, quantity);
  }

  return (
    <>
      <div className="mt-4">
        <Price price={product.price} discountPercentage={product.discountPercentage} />
        <p className={`mt-3 text-sm ${available ? "text-olive dark:text-emerald-300" : "text-clay"}`}>
          {available
            ? product.stock <= 5
              ? `Only ${product.stock} left — don’t miss it`
              : "In stock and ready to go"
            : "Out of stock"}
        </p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="inline-flex min-h-12 items-center rounded-full border border-line">
          <button
            type="button"
            className="quantity-button"
            aria-label="Decrease quantity"
            disabled={quantity <= 1}
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
          >
            <Minus size={15} aria-hidden="true" />
          </button>
          <span className="min-w-8 text-center tabular-nums" aria-live="polite">{quantity}</span>
          <button
            type="button"
            className="quantity-button"
            aria-label="Increase quantity"
            disabled={!available || quantity >= product.stock}
            onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))}
          >
            <Plus size={15} aria-hidden="true" />
          </button>
        </div>
        <Button
          variant="primary"
          size="lg"
          className="button-primary flex-1"
          disabled={!available}
          onClick={addToBag}
        >
          <ShoppingBag size={17} aria-hidden="true" />
          {available ? "Add to bag" : "Out of stock"}
        </Button>
        <button
          type="button"
          className="icon-button border border-line"
          onClick={() => toggleProduct(product)}
          aria-label={`${isWishlisted ? "Remove from" : "Add to"} wishlist`}
          aria-pressed={isWishlisted}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} aria-hidden="true" />
        </button>
      </div>
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 p-3 backdrop-blur md:hidden">
        <div className="mx-auto flex max-w-xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">{product.title}</p>
            <Price price={product.price} discountPercentage={product.discountPercentage} compact />
          </div>
          <Button
            variant="primary"
            disabled={!available}
            className="button-primary !min-h-11 !px-5"
            onClick={addToBag}
          >
            <ShoppingBag size={16} aria-hidden="true" /> Add
          </Button>
        </div>
      </div>
    </>
  );
}
