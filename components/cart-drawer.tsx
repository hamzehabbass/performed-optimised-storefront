"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";

type CartDrawerProps = {
  open: boolean;
  onClose: () => void;
};

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const items = useCartStore((state) => state.items);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className="cart-dialog"
      aria-labelledby="cart-dialog-title"
      onClose={onClose}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-line px-5 py-5 sm:px-7">
          <div>
            <h2 id="cart-dialog-title" className="text-lg font-semibold">
              Your bag
            </h2>
            <p className="mt-1 text-xs text-muted">
              {count} {count === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            className="icon-button"
            onClick={onClose}
            aria-label="Close bag"
            autoFocus
          >
            <X size={19} aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 sm:px-7">
          {items.length > 0 ? (
            items.map((item) => <CartItem key={item.product.id} item={item} />)
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-base font-medium">Your bag is taking a breather.</p>
              <p className="mt-2 text-sm text-muted">Find something you love and it’ll be here.</p>
              <Link href="/products/" className="button-primary mt-6" onClick={onClose}>
                Explore the shop <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
        {items.length > 0 && (
          <div className="border-t border-line bg-surface px-5 py-5 sm:px-7">
            <CartSummary items={items} />
            <Link
              href="/cart/"
              className="button-primary mt-5 w-full"
              onClick={onClose}
            >
              View bag <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </dialog>
  );
}
