import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout-form";

export const metadata: Metadata = {
  title: "Demo checkout",
  description: "Complete your demo Noma order. No payment is taken.",
};

export default function CheckoutPage() {
  return (
    <div className="page-container min-h-[50vh] py-9 sm:py-12">
      <p className="eyebrow">One last little step</p>
      <h1 className="section-title mt-2">Demo checkout</h1>
      <p className="mt-2 text-sm text-muted">No payment is taken. Your details stay in this browser.</p>
      <div className="mt-7">
        <CheckoutForm />
      </div>
    </div>
  );
}
