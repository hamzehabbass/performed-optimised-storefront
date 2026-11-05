"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Heart, Search, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { useWishlistStore } from "@/stores/wishlist-store";
import { ThemeToggle } from "@/components/theme-toggle";

const CartDrawer = dynamic(
  () => import("@/components/cart-drawer").then((module) => module.CartDrawer),
  { ssr: false },
);

export function StoreHeader() {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartMounted, setCartMounted] = useState(false);
  const items = useCartStore((state) => state.items);
  const announcement = useCartStore((state) => state.announcement);
  const wishlistAnnouncement = useWishlistStore((state) => state.announcement);
  const wishlistCount = useWishlistStore((state) => state.products.length);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    void Promise.resolve()
      .then(() => useCartStore.persist.rehydrate())
      .catch((error: unknown) => {
      console.error("Could not restore your saved bag.", error);
      });
    void Promise.resolve()
      .then(() => useWishlistStore.persist.rehydrate())
      .catch((error: unknown) => {
      console.error("Could not restore your wishlist.", error);
      });
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur-md">
        <div className="announcement-bar px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[.13em] sm:text-[11px]">
          Thoughtfully chosen. Easy to love. Free shipping over $75.
        </div>
        <div className="page-container flex h-[68px] items-center justify-between gap-3">
          <Link
            href="/"
            className="shrink-0 text-[23px] font-semibold tracking-[-.08em]"
            aria-label="Noma home"
          >
            noma<span className="text-clay">.</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
            <Link className="nav-link" href="/products/">Shop all</Link>
            <Link className="nav-link" href="/products/?sort=rating">Best sellers</Link>
            <Link className="nav-link" href="/products/?sort=price-asc">Under $50</Link>
            <Link className="nav-link" href="/about/">Our story</Link>
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <Link
              href="/products/"
              className="icon-button hidden sm:inline-flex"
              aria-label="Search products"
            >
              <Search size={19} aria-hidden="true" />
            </Link>
            <ThemeToggle />
            <Link href="/wishlist/" className="icon-button relative" aria-label="Wishlist">
              <Heart size={19} aria-hidden="true" />
              {wishlistCount > 0 && (
                <span className="count-badge" aria-hidden="true">{wishlistCount}</span>
              )}
            </Link>
            <button
              type="button"
              className="icon-button relative"
              aria-label={`Open bag, ${count} ${count === 1 ? "item" : "items"}`}
              onClick={() => {
                setCartMounted(true);
                setCartOpen(true);
              }}
            >
              <ShoppingBag size={19} aria-hidden="true" />
              <span className="count-badge" aria-hidden="true">{count}</span>
            </button>
          </div>
        </div>
        <div className="border-t border-line md:hidden">
          <nav aria-label="Mobile navigation" className="page-container flex h-11 items-center gap-6 overflow-x-auto">
            <Link className="nav-link shrink-0" href="/products/">Shop all</Link>
            <Link className="nav-link shrink-0" href="/products/?sort=rating">Best sellers</Link>
            <Link className="nav-link shrink-0" href="/products/?sort=price-asc">Under $50</Link>
            <Link className="nav-link shrink-0" href="/about/">Our story</Link>
          </nav>
        </div>
        <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {[announcement, wishlistAnnouncement].filter(Boolean).join(" ")}
        </p>
      </header>
      {cartMounted && <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />}
    </>
  );
}
