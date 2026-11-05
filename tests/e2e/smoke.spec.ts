import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ProductSnapshot } from "@/lib/types";

const snapshot = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/products.json"), "utf8"),
) as ProductSnapshot;
const visibleProduct = [...snapshot.products].sort(
  (a, b) => b.rating - a.rating || a.id - b.id,
)[0];

test("deployed storefront loads and shows real products", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: /Good things for the everyday/i })).toBeVisible();
  await expect(page.getByRole("link", { name: `View ${visibleProduct!.title}` }).first()).toBeVisible();
});
