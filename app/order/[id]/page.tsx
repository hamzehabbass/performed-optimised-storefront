import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/order-confirmation";

export const metadata: Metadata = {
  title: "Order confirmed",
  description: "Your Noma demo order confirmation.",
};

export function generateStaticParams() {
  return [{ id: "confirmation" }];
}

export default function Page() {
  return <OrderConfirmation />;
}
