import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ProductSnapshot } from "@/lib/types";

const snapshot = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/products.json"), "utf8"),
) as ProductSnapshot;
const sampleProduct = snapshot.products.find((product) => product.stock > 0);

if (!sampleProduct) {
  throw new Error("The committed DummyJSON snapshot has no in-stock products for responsive tests.");
}

test("main purchase pages have no horizontal page scroll from 320px to 1440px", async ({ page }) => {
  const viewports = [320, 375, 768, 1024, 1440];
  const routes = ["/", "/products/", `/products/${sampleProduct.id}/`, "/cart/", "/checkout/"];

  for (const width of viewports) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await expect.poll(async () =>
        page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth),
      ).toBe(true);
    }
  }
});
