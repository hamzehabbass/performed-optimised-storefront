import type { Metadata } from "next";
import { WishlistPage } from "@/components/wishlist-page";

export const metadata: Metadata = {
  title: "Your wishlist",
  description: "Keep track of your Noma favourites.",
};

export default function Page() {
  return <WishlistPage />;
}
