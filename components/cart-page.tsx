"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import { useCartStore } from "@/stores/cart-store";
import { useStoreHydration } from "@/lib/use-store-hydration";

export function CartPage() {
  const items = useCartStore((state) => state.items);
  const hydrated = useStoreHydration(useCartStore.persist);

  return (
    <div className="page-container min-h-[50vh] py-9 sm:py-12">
      <p className="eyebrow">Saved for your everyday</p>
      <h1 className="section-title mt-2">Your bag</h1>
      {!hydrated ? (
        <p className="mt-10 text-sm text-muted" role="status">Restoring your saved bag…</p>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-soft px-6 py-14 text-center">
          <ShoppingBag size={26} className="mx-auto text-muted" aria-hidden="true" />
          <h2 className="mt-4 text-lg font-medium">Nothing in your bag just yet.</h2>
          <p className="mt-2 text-sm text-muted">A good thing or two might change that.</p>
          <Link href="/products/" className="button-primary mt-6">
            Explore the shop <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_350px] lg:gap-16">
          <section aria-label="Items in your bag">
            {items.map((item) => <CartItem key={item.product.id} item={item} />)}
            <p className="mt-4 text-xs leading-5 text-muted">
              Shipping is calculated at checkout. Free standard shipping over $75.
            </p>
          </section>
          <aside className="h-fit rounded-2xl bg-soft p-5 sm:p-6">
            <h2 className="mb-5 text-base font-semibold">A little summary</h2>
            <CartSummary items={items} />
            <Link href="/checkout/" className="button-primary mt-6 w-full">
              Continue to demo checkout <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-center text-xs text-muted">
              Demo only. No payment details or real payment.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
