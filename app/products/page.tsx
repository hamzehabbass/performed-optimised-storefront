import type { Metadata } from "next";
import { CatalogPage } from "@/components/catalog-page";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Explore the Noma collection of thoughtful everyday finds.",
};

export default function ProductsPage() {
  return <CatalogPage />;
}
