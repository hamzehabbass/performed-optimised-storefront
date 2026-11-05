"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ProductSummary } from "@/lib/types";

type WishlistState = {
  products: ProductSummary[];
  announcement: string;
  toggleProduct: (product: ProductSummary) => void;
  removeProduct: (id: number) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      products: [],
      announcement: "",
      toggleProduct: (product) => {
        const exists = get().products.some((item) => item.id === product.id);
        set({
          products: exists
            ? get().products.filter((item) => item.id !== product.id)
            : [...get().products, product],
          announcement: exists
            ? `${product.title} removed from your wishlist.`
            : `${product.title} saved to your wishlist.`,
        });
      },
      removeProduct: (id) =>
        set((state) => {
          const removed = state.products.find((product) => product.id === id);
          return {
            products: state.products.filter((product) => product.id !== id),
            announcement: removed
              ? `${removed.title} removed from your wishlist.`
              : "",
          };
        }),
    }),
    {
      name: "noma-wishlist",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ products: state.products }),
    },
  ),
);
