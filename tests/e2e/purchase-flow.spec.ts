import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ProductSnapshot } from "@/lib/types";

const snapshot = JSON.parse(
  readFileSync(resolve(process.cwd(), "data/products.json"), "utf8"),
) as ProductSnapshot;
const purchasableProduct = snapshot.products.find((product) => product.stock > 0);

if (!purchasableProduct) {
  throw new Error("The committed DummyJSON snapshot has no purchasable products.");
}

test("category browse, product add, refresh persistence and demo checkout", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/products/");
  await expect(page.getByRole("heading", { name: "The good things shop" })).toBeVisible();

  await page.locator("#desktop-category").selectOption(purchasableProduct.category);
  await expect(page).toHaveURL(new RegExp(`cat=${purchasableProduct.category}`));
  await page.getByRole("link", { name: `View ${purchasableProduct.title}` }).click();
  await expect(page.getByRole("heading", { name: purchasableProduct.title })).toBeVisible();

  await page.getByRole("button", { name: "Add to bag", exact: true }).click();
  await expect(page.getByRole("button", { name: "Open bag, 1 item" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("button", { name: "Open bag, 1 item" })).toBeVisible();

  const bagButton = page.getByRole("button", { name: "Open bag, 1 item" });
  await bagButton.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(bagButton).toBeFocused();
  await bagButton.click();
  await page.getByRole("link", { name: "View bag" }).click();
  await page.getByRole("link", { name: "Continue to demo checkout" }).click();
  await expect(page.getByRole("heading", { name: "Demo checkout" })).toBeVisible();
  await expect(page.getByText("Demo checkout. No payment is taken.")).toBeVisible();

  await page.getByRole("button", { name: "Place demo order" }).click();
  await expect(page.getByText("Enter your full name.")).toBeVisible();
  await page.getByLabel("Full name").fill("Sam Taylor");
  await page.getByLabel("Email").fill("sam@example.com");
  await page.getByLabel("Phone").fill("+1 555 0100");
  await page.getByLabel("Street address").fill("123 Example Street");
  await page.getByLabel("City").fill("Portland");
  await page.getByLabel("Country").selectOption("United States");
  await page.getByRole("button", { name: "Place demo order" }).click();

  await expect(page.getByRole("heading", { name: "Your demo order is in." })).toBeVisible();
  await expect(page.getByText(/^NOMA-[A-F0-9]{8}$/)).toBeVisible();
});
