import type { Metadata } from "next";
import { CartPage } from "@/components/cart-page";

export const metadata: Metadata = {
  title: "Your bag",
  description: "Review your Noma demo order.",
};

export default function Page() {
  return <CartPage />;
}
