import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ProductSnapshot } from "@/lib/types";

const snapshot = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/products.json"), "utf8"),
) as ProductSnapshot;
const sampleProduct = snapshot.products.find((product) => product.stock > 0);

if (!sampleProduct) {
  throw new Error("The committed DummyJSON snapshot has no in-stock products for accessibility tests.");
}

async function seedCart(page: Page) {
  await page.addInitScript((product) => {
    localStorage.setItem("noma-cart", JSON.stringify({
      state: { items: [{ product, quantity: 1 }], announcement: "" },
      version: 0,
    }));
  }, sampleProduct);
}

async function setTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((initialTheme) => {
    localStorage.setItem("noma-theme", initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, theme);
}

async function expectAccessible(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
}

for (const theme of ["light", "dark"] as const) {
  test(`${theme} home page has no axe violations`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto("/");
    await expectAccessible(page);
  });

  test(`${theme} catalogue has no axe violations`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto("/products/");
    await expectAccessible(page);
  });

  test(`${theme} product page has no axe violations`, async ({ page }) => {
    await setTheme(page, theme);
    await page.goto(`/products/${sampleProduct!.id}/`);
    await expectAccessible(page);
  });

  test(`${theme} cart has no axe violations`, async ({ page }) => {
    await setTheme(page, theme);
    await seedCart(page);
    await page.goto("/cart/");
    await expectAccessible(page);
  });

  test(`${theme} cart drawer has no axe violations`, async ({ page }) => {
    await setTheme(page, theme);
    await seedCart(page);
    await page.goto("/");
    await page.getByRole("button", { name: "Open bag, 1 item" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectAccessible(page);
  });

  test(`${theme} checkout has no axe violations`, async ({ page }) => {
    await setTheme(page, theme);
    await seedCart(page);
    await page.goto("/checkout/");
    await expectAccessible(page);
  });
}
