"use client";

import type { ProductFilters } from "@/lib/filters";
import { categories } from "@/lib/catalog";
import { formatCategory } from "@/lib/format";

type FilterControlsProps = {
  filters: ProductFilters;
  idPrefix: string;
  onChange: (filters: Partial<ProductFilters>) => void;
};

export function FilterControls({ filters, idPrefix, onChange }: FilterControlsProps) {
  const sortId = `${idPrefix}-sort`;
  const categoryId = `${idPrefix}-category`;
  const minId = `${idPrefix}-min`;
  const maxId = `${idPrefix}-max`;
  const ratingId = `${idPrefix}-rating`;
  const stockId = `${idPrefix}-stock`;

  return (
    <div className="space-y-5">
      <div>
        <label className="field-label" htmlFor={categoryId}>Collection</label>
        <select
          id={categoryId}
          className="field-control"
          value={filters.category}
          onChange={(event) => onChange({ category: event.target.value })}
        >
          <option value="">All collections</option>
          {categories.map((category) => (
            <option key={category} value={category}>{formatCategory(category)}</option>
          ))}
        </select>
      </div>
      <div>
        <span className="field-label">Price range</span>
        <div className="grid grid-cols-2 gap-2">
          <label className="sr-only" htmlFor={minId}>Minimum price in dollars</label>
          <input
            id={minId}
            className="field-control"
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="Min $"
            value={filters.minPrice ?? ""}
            onChange={(event) =>
              onChange({
                minPrice: event.target.value === "" ? null : Math.max(0, Number(event.target.value)),
              })
            }
          />
          <label className="sr-only" htmlFor={maxId}>Maximum price in dollars</label>
          <input
            id={maxId}
            className="field-control"
            type="number"
            inputMode="decimal"
            min="0"
            placeholder="Max $"
            value={filters.maxPrice ?? ""}
            onChange={(event) =>
              onChange({
                maxPrice: event.target.value === "" ? null : Math.max(0, Number(event.target.value)),
              })
            }
          />
        </div>
      </div>
      <div>
        <label className="field-label" htmlFor={ratingId}>Minimum rating</label>
        <select
          id={ratingId}
          className="field-control"
          value={filters.minRating}
          onChange={(event) => onChange({ minRating: Number(event.target.value) })}
        >
          <option value="0">Any rating</option>
          <option value="3">3 stars & up</option>
          <option value="4">4 stars & up</option>
          <option value="4.5">4.5 stars & up</option>
        </select>
      </div>
      <label htmlFor={stockId} className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
        <input
          id={stockId}
          type="checkbox"
          className="h-4 w-4 accent-olive"
          checked={filters.inStock}
          onChange={(event) => onChange({ inStock: event.target.checked })}
        />
        In stock only
      </label>
      <div>
        <label className="field-label" htmlFor={sortId}>Sort by</label>
        <select
          id={sortId}
          className="field-control"
          value={filters.sort}
          onChange={(event) => onChange({ sort: event.target.value as ProductFilters["sort"] })}
        >
          <option value="featured">Featured</option>
          <option value="rating">Top rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="title">Name: A to Z</option>
        </select>
      </div>
    </div>
  );
}
