"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { CartItem, ProductSummary } from "@/lib/types";

type CartState = {
  items: CartItem[];
  announcement: string;
  addItem: (product: ProductSummary, quantity?: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      announcement: "",
      addItem: (product, quantity = 1) => {
        if (product.stock < 1) {
          set({ announcement: `${product.title} is out of stock.` });
          return;
        }
        const existing = get().items.find((item) => item.product.id === product.id);
        const requestedQuantity = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
        const nextQuantity = Math.min(
          product.stock,
          (existing?.quantity ?? 0) + requestedQuantity,
        );
        set({
          items: existing
            ? get().items.map((item) =>
                item.product.id === product.id
                  ? { ...item, quantity: nextQuantity }
                  : item,
              )
            : [...get().items, { product, quantity: nextQuantity }],
          announcement: `${product.title} added to your bag.`,
        });
      },
      updateQuantity: (productId, quantity) =>
        set((state) => {
          const currentItem = state.items.find((item) => item.product.id === productId);
          const nextQuantity = Number.isFinite(quantity) ? Math.floor(quantity) : 1;
          return {
            items:
              nextQuantity < 1
                ? state.items.filter((item) => item.product.id !== productId)
                : state.items.map((item) =>
                    item.product.id === productId && currentItem
                      ? {
                          ...item,
                          quantity: Math.min(item.product.stock, nextQuantity),
                        }
                      : item,
                  ),
          };
        }),
      removeItem: (productId) =>
        set((state) => {
          const removed = state.items.find((item) => item.product.id === productId);
          return {
            items: state.items.filter((item) => item.product.id !== productId),
            announcement: removed ? `${removed.product.title} removed from your bag.` : "",
          };
        }),
      clearCart: () => set({ items: [], announcement: "Your bag is now empty." }),
    }),
    {
      name: "noma-cart",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
