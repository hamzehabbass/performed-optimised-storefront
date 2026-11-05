import { getCartTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import type { CartItem, ShippingMethod } from "@/lib/types";

type CartSummaryProps = {
  items: CartItem[];
  shippingMethod?: ShippingMethod;
};

export function CartSummary({
  items,
  shippingMethod = "standard",
}: CartSummaryProps) {
  const totals = getCartTotals(items, shippingMethod);

  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between gap-4">
        <dt className="text-muted">Subtotal</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.savings > 0 && (
        <div className="flex justify-between gap-4 text-olive dark:text-emerald-300">
          <dt>You saved</dt>
          <dd>−{formatPrice(totals.savings)}</dd>
        </div>
      )}
      <div className="flex justify-between gap-4">
        <dt className="text-muted">
          Shipping {shippingMethod === "express" ? "(express)" : ""}
        </dt>
        <dd>{totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}</dd>
      </div>
      <div className="flex justify-between gap-4 border-t border-line pt-4 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
