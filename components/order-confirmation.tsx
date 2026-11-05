"use client";

import { Suspense, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { discountedPrice } from "@/lib/pricing";
import { savedOrderSchema } from "@/lib/validation";

const orderUpdatedEvent = "noma-order-updated";

function subscribeToOrder(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(orderUpdatedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(orderUpdatedEvent, onStoreChange);
  };
}

function getOrderSnapshot(): string | null {
  try {
    return localStorage.getItem("noma-last-order");
  } catch (error) {
    console.error("Could not read the saved demo order.", error);
    return null;
  }
}

function ConfirmationContent() {
  const params = useSearchParams();
  const orderId = params.get("orderId");
  const savedOrder = useSyncExternalStore(subscribeToOrder, getOrderSnapshot, () => "");
  const order = useMemo(() => {
    if (!savedOrder || !orderId) return null;
    try {
      const parsed: unknown = JSON.parse(savedOrder);
      const result = savedOrderSchema.safeParse(parsed);
      if (!result.success) {
        console.error("The saved demo order has an unexpected shape.", result.error);
        return null;
      }
      return result.data.id === orderId ? result.data : null;
    } catch (error) {
      console.error("Could not parse the saved demo order.", error);
      return null;
    }
  }, [orderId, savedOrder]);

  if (savedOrder === "") {
    return <p className="py-20 text-center text-sm text-muted" role="status">Opening your order…</p>;
  }

  if (!order) {
    return (
      <div className="py-16 text-center">
        <h1 className="section-title">This order isn’t saved here.</h1>
        <p className="mt-3 text-sm text-muted">
          Demo order details are stored only in the browser where checkout was completed.
        </p>
        <Link href="/products/" className="button-primary mt-6">Back to the shop</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-10 sm:py-16">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#e8ecdf] text-olive dark:bg-[#343b2b] dark:text-emerald-200">
        <Check size={24} aria-hidden="true" />
      </div>
      <p className="eyebrow mt-6 text-center">A good thing is on its way</p>
      <h1 className="mt-2 text-center text-3xl font-medium tracking-[-.05em] sm:text-4xl">
        Your demo order is in.
      </h1>
      <p className="mt-3 text-center text-sm text-muted">
        Thanks, {order.customer.fullName.split(" ")[0]}. This is a demo only; nothing will be shipped
        or charged.
      </p>
      <div className="mt-8 rounded-2xl border border-line p-5 sm:p-7">
        <div className="flex flex-wrap justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="text-xs text-muted">Demo order number</p>
            <p className="mt-1 font-semibold">{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Order total</p>
            <p className="mt-1 font-semibold">{formatPrice(order.total)}</p>
          </div>
        </div>
        <ul className="divide-y divide-[var(--line)]">
          {order.items.map((item) => (
            <li key={item.product.id} className="flex justify-between gap-4 py-4 text-sm">
              <span>{item.product.title} <span className="text-muted">× {item.quantity}</span></span>
              <span className="shrink-0">
                {formatPrice(discountedPrice(item.product.price, item.product.discountPercentage) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Savings</dt>
            <dd>−{formatPrice(order.savings)}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted">Shipping</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between gap-3 border-t border-line pt-3 font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-4 border-t border-line pt-4 text-sm">
          <p className="text-muted">Shipping to</p>
          <p className="mt-1">{order.customer.address}, {order.customer.city}, {order.customer.country}</p>
          <p className="mt-3 text-muted">
            {order.shippingMethod === "express" ? "Express" : "Standard"} demo shipping · No tracking or delivery
          </p>
        </div>
      </div>
      <Link href="/products/" className="button-primary mx-auto mt-7 flex w-fit">
        Keep exploring <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function OrderConfirmation() {
  return (
    <div className="page-container min-h-[45vh]">
      <Suspense fallback={<p className="py-20 text-center text-sm text-muted">Loading your order…</p>}>
        <ConfirmationContent />
      </Suspense>
    </div>
  );
}
