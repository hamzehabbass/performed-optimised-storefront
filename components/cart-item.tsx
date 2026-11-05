"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice } from "@/lib/format";
import { discountedPrice } from "@/lib/pricing";
import type { CartItem as CartLine } from "@/lib/types";

type CartItemProps = {
  item: CartLine;
};

export function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { product, quantity } = item;

  return (
    <article className="flex gap-4 border-b border-line py-5 last:border-0">
      <Link
        href={`/products/${product.id}/`}
        className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-soft"
        aria-label={`View ${product.title}`}
      >
        <Image
          src={product.thumbnail}
          alt=""
          fill
          sizes="96px"
          className="object-contain p-2"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{product.title}</p>
            <p className="mt-1 text-xs text-muted">
              {product.brand || product.category.replaceAll("-", " ")}
            </p>
          </div>
          <p className="shrink-0 text-sm font-medium">
            {formatPrice(discountedPrice(product.price, product.discountPercentage) * quantity)}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-line">
            <button
              type="button"
              className="quantity-button"
              aria-label={`Decrease ${product.title} quantity`}
              onClick={() => updateQuantity(product.id, quantity - 1)}
            >
              <Minus size={14} aria-hidden="true" />
            </button>
            <span className="min-w-8 text-center text-xs tabular-nums" aria-live="polite">
              {quantity}
            </span>
            <button
              type="button"
              className="quantity-button"
              aria-label={`Increase ${product.title} quantity`}
              disabled={quantity >= product.stock}
              onClick={() => updateQuantity(product.id, quantity + 1)}
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          </div>
          <button
            type="button"
            className="icon-button !h-9 !w-9 text-muted hover:text-clay"
            aria-label={`Remove ${product.title} from bag`}
            onClick={() => removeItem(product.id)}
          >
            <Trash2 size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}
