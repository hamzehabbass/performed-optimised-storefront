import {
  DEFAULT_FILTERS,
  type ProductFilters,
  type SortOption,
} from "@/lib/filters";

const sortOptions: SortOption[] = [
  "featured",
  "price-asc",
  "price-desc",
  "rating",
  "discount-desc",
  "title",
];

function parseBoundedNumber(value: string | null, min: number, max: number): number | null {
  if (!value || value.trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : null;
}

export function parseProductFilters(
  params: URLSearchParams | Record<string, string | string[] | undefined>,
): ProductFilters & { page: number } {
  const get = (key: string) =>
    params instanceof URLSearchParams
      ? params.get(key)
      : Array.isArray(params[key])
        ? params[key]?.[0] ?? null
        : params[key] ?? null;
  const sort = get("sort");
  const page = parseBoundedNumber(get("page"), 1, 999) ?? 1;
  const rating = parseBoundedNumber(get("rating"), 0, 5) ?? DEFAULT_FILTERS.minRating;

  return {
    ...DEFAULT_FILTERS,
    query: (get("q") ?? "").slice(0, 100),
    category: (get("cat") ?? "").slice(0, 80),
    minPrice: parseBoundedNumber(get("min"), 0, 1_000_000),
    maxPrice: parseBoundedNumber(get("max"), 0, 1_000_000),
    minRating: rating,
    inStock: get("stock") === "1",
    sort: sortOptions.find((option) => option === sort) ?? "featured",
    page: Math.floor(page),
  };
}

export function serializeProductFilters(
  filters: ProductFilters,
  page = 1,
): string {
  const params = new URLSearchParams();
  if (filters.query) params.set("q", filters.query);
  if (filters.category) params.set("cat", filters.category);
  if (filters.minPrice !== null) params.set("min", String(filters.minPrice));
  if (filters.maxPrice !== null) params.set("max", String(filters.maxPrice));
  if (filters.minRating > 0) params.set("rating", String(filters.minRating));
  if (filters.inStock) params.set("stock", "1");
  if (filters.sort !== "featured") params.set("sort", filters.sort);
  if (page > 1) params.set("page", String(page));
  return params.toString();
}
