"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Heart, ShoppingBag, Star } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import type { ProductSummary } from "@/lib/types";
import { formatCategory } from "@/lib/format";
import { Price } from "@/components/price";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleProduct = useWishlistStore((state) => state.toggleProduct);
  const isWishlisted = useWishlistStore((state) =>
    state.products.some((item) => item.id === product.id),
  );

  return (
    <article className="group min-w-0">
      <div className="product-card-image relative">
        <Link
          href={`/products/${product.id}/`}
          className="absolute inset-0 z-0 rounded-[inherit]"
          aria-label={`View ${product.title}`}
        >
          <Image
            src={product.thumbnail}
            alt=""
            fill
            sizes="(max-width: 479px) 46vw, (max-width: 768px) 45vw, (max-width: 1200px) 30vw, 22vw"
            className="object-contain p-5 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
        {product.discountPercentage > 0 && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-clay px-2.5 py-1 text-[11px] font-semibold text-white">
            -{Math.round(product.discountPercentage)}%
          </span>
        )}
        <button
          type="button"
          className="icon-button absolute right-3 top-3 z-10 bg-surface/90"
          aria-label={`${isWishlisted ? "Remove" : "Add"} ${product.title} ${isWishlisted ? "from" : "to"} wishlist`}
          aria-pressed={isWishlisted}
          onClick={() => toggleProduct(product)}
        >
          <Heart size={17} fill={isWishlisted ? "currentColor" : "none"} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="quick-add absolute bottom-3 right-3 z-10"
          aria-label={`Add ${product.title} to bag`}
          disabled={product.stock < 1}
          onClick={() => addItem(product)}
        >
          <ShoppingBag size={16} aria-hidden="true" />
          <span className="sr-only">Add to bag</span>
        </button>
      </div>
      <div className="pt-3">
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="mb-1 text-[10px] font-medium uppercase tracking-[.14em] text-muted">
              {product.brand || formatCategory(product.category)}
            </p>
            <Link
              href={`/products/${product.id}/`}
              className="line-clamp-1 text-sm font-medium hover:underline"
            >
              {product.title}
            </Link>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 pt-0.5 text-xs text-muted">
            <Star size={13} className="fill-current text-amber-500" aria-hidden="true" />
            {product.rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-sm">
          <Price price={product.price} discountPercentage={product.discountPercentage} compact />
          <ArrowUpRight
            size={15}
            className="hidden text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block"
            aria-hidden="true"
          />
        </div>
      </div>
    </article>
  );
}
