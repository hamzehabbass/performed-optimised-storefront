import { describe, expect, it } from "vitest";
import { parseProductFilters, serializeProductFilters } from "@/lib/url-state";

describe("catalogue URL state", () => {
  it("round-trips the shareable filter parameters", () => {
    const filters = {
      query: "phone",
      category: "smartphones",
      minPrice: 100,
      maxPrice: 900,
      minRating: 4,
      inStock: true,
      sort: "discount-desc" as const,
    };
    const query = serializeProductFilters(filters, 2);

    expect(parseProductFilters(new URLSearchParams(query))).toEqual({ ...filters, page: 2 });
  });

  it("recovers safely from malformed, excessive and unknown parameters", () => {
    const parsed = parseProductFilters(
      new URLSearchParams("min=nope&max=-8&rating=22&page=Infinity&sort=made-up&stock=yes&q=%20%20"),
    );

    expect(parsed).toMatchObject({
      query: "  ",
      minPrice: null,
      maxPrice: 0,
      minRating: 5,
      page: 1,
      sort: "featured",
      inStock: false,
    });
  });
});
