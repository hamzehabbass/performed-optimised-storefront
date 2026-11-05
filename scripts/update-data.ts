import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number(),
  comment: z.string(),
  reviewerName: z.string(),
  date: z.string(),
});

const productSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  description: z.string(),
  price: z.number().nonnegative(),
  discountPercentage: z.number().nonnegative(),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
  brand: z.string().optional(),
  category: z.string(),
  thumbnail: z.string().url(),
  images: z.array(z.string().url()),
  tags: z.array(z.string()).default([]),
  reviews: z.array(reviewSchema).default([]),
}).passthrough();

const productsResponseSchema = z.object({
  total: z.number().int().nonnegative(),
  products: z.array(productSchema),
});

const categorySchema = z.array(z.string().min(1));
const outputDirectory = resolve(process.cwd(), "data");

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) {
    throw new Error(`Request to ${url} failed with HTTP ${response.status}.`);
  }
  return response.json();
}

async function updateSnapshot() {
  const [productsPayload, categoriesPayload] = await Promise.all([
    fetchJson("https://dummyjson.com/products?limit=0"),
    fetchJson("https://dummyjson.com/products/category-list"),
  ]);
  const parsedProducts = productsResponseSchema.safeParse(productsPayload);
  const parsedCategories = categorySchema.safeParse(categoriesPayload);

  if (!parsedProducts.success) {
    throw new Error(`DummyJSON product response changed shape: ${parsedProducts.error.message}`);
  }
  if (!parsedCategories.success) {
    throw new Error(`DummyJSON category response changed shape: ${parsedCategories.error.message}`);
  }

  const { products, total } = parsedProducts.data;
  const categories = parsedCategories.data;
  if (products.length !== total) {
    throw new Error(`Expected ${total} products from DummyJSON, received ${products.length}.`);
  }

  const snapshotDate = new Date().toISOString().slice(0, 10);
  const summaries = products.map(
    ({ id, title, price, discountPercentage, rating, stock, brand, category, thumbnail }) => ({
      id,
      title,
      price,
      discountPercentage,
      rating,
      stock,
      ...(brand ? { brand } : {}),
      category,
      thumbnail,
    }),
  );
  const details = products.map(
    ({
      id,
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
      brand,
      thumbnail,
      images,
      tags,
      reviews,
    }) => ({
      id,
      title,
      description,
      category,
      price,
      discountPercentage,
      rating,
      stock,
      ...(brand ? { brand } : {}),
      thumbnail,
      images,
      tags,
      reviews,
    }),
  );

  await mkdir(outputDirectory, { recursive: true });
  await Promise.all([
    writeFile(
      resolve(outputDirectory, "products.json"),
      `${JSON.stringify({ snapshotDate, total, categories, products: summaries }, null, 2)}\n`,
    ),
    writeFile(resolve(outputDirectory, "products-full.json"), `${JSON.stringify(details, null, 2)}\n`),
  ]);

  console.log(`Saved ${products.length} products and ${categories.length} categories (${snapshotDate}).`);
}

void updateSnapshot().catch((error: unknown) => {
  console.error("Could not update the DummyJSON snapshot.", error);
  process.exitCode = 1;
});
