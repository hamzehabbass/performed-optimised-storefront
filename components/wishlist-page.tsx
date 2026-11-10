"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import { Price } from "@/components/price";
import { formatCategory } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { useStoreHydration } from "@/lib/use-store-hydration";

export function WishlistPage() {
  const products = useWishlistStore((state) => state.products);
  const removeProduct = useWishlistStore((state) => state.removeProduct);
  const addItem = useCartStore((state) => state.addItem);
  const hydrated = useStoreHydration(useWishlistStore.persist);

  return (
    <div className="page-container min-h-[50vh] py-9 sm:py-12">
      <p className="eyebrow">The ones that caught your eye</p>
      <h1 className="section-title mt-2">Your wishlist</h1>
      {!hydrated ? (
        <p className="mt-10 text-sm text-muted" role="status">Restoring your saved finds…</p>
      ) : products.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-soft px-6 py-14 text-center">
          <Heart size={25} className="mx-auto text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-medium">Keep the good ones close.</h2>
          <p className="mt-2 text-sm text-muted">Save a favourite and it’ll be waiting right here.</p>
          <Link href="/products/" className="button-primary mt-6">
            Explore the shop <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <ul className="mt-8 divide-y divide-[var(--line)]">
          {products.map((product) => (
            <li key={product.id} className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center">
              <Link
                href={`/products/${product.id}/`}
                className="relative h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-soft"
                aria-label={`View ${product.title}`}
              >
                <Image src={product.thumbnail} alt="" fill sizes="112px" className="object-contain p-2" />
              </Link>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted">{product.brand || formatCategory(product.category)}</p>
                <Link
                  href={`/products/${product.id}/`}
                  className="mt-1 inline-block font-medium hover:underline"
                >
                  {product.title}
                </Link>
                <div className="mt-2"><Price price={product.price} discountPercentage={product.discountPercentage} compact /></div>
              </div>
              <div className="flex items-center gap-2 sm:justify-end">
                <button
                  type="button"
                  className="button-primary !min-h-11 !px-4"
                  disabled={product.stock < 1}
                  onClick={() => {
                    addItem(product);
                    removeProduct(product.id);
                  }}
                >
                  <ShoppingBag size={15} aria-hidden="true" />
                  Move to bag
                </button>
                <button
                  type="button"
                  className="icon-button"
                  aria-label={`Remove ${product.title} from wishlist`}
                  onClick={() => removeProduct(product.id)}
                >
                  <Trash2 size={16} aria-hidden="true" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
