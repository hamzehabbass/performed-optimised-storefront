"use client";

import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, X } from "lucide-react";
import { Drawer } from "hamzehabbass-accessible-ui";
import { ProductGrid } from "@/components/product-grid";
import { FilterControls } from "@/components/filter-controls";
import { products } from "@/lib/catalog";
import { filterProducts } from "@/lib/filters";
import { parseProductFilters, serializeProductFilters } from "@/lib/url-state";
import { formatCategory } from "@/lib/format";
import Link from "next/link";

const PAGE_SIZE = 24;

function CatalogFallback() {
  return (
    <div className="page-container py-8 sm:py-12" aria-busy="true">
      <p className="sr-only" role="status">Loading products…</p>
      <nav aria-hidden="true" className="mb-5 h-4">
        <div className="h-3 w-24 rounded bg-soft" />
      </nav>
      <div aria-hidden="true" className="flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
        <div className="w-full max-w-xl">
          <div className="h-3 w-40 rounded bg-soft" />
          <div className="mt-3 h-10 w-72 max-w-full rounded bg-soft" />
          <div className="mt-3 h-4 w-full max-w-md rounded bg-soft" />
        </div>
        <div className="h-11 w-full rounded-full bg-soft sm:max-w-[300px]" />
      </div>
      <div aria-hidden="true" className="mt-7 grid gap-8 md:grid-cols-[210px_1fr] lg:grid-cols-[230px_1fr]">
        <aside className="hidden md:block">
          <div className="h-96 rounded-xl bg-soft" />
        </aside>
        <section>
          <div className="mb-5 flex h-10 items-center justify-between">
            <div className="h-4 w-28 rounded bg-soft" />
            <div className="h-10 w-24 rounded-full bg-soft md:hidden" />
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: PAGE_SIZE }, (_, index) => (
              <article key={index} className="min-w-0">
                <div className="product-card-image animate-pulse" />
                <div className="pt-3">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="w-2/3">
                      <div className="mb-1 h-3 w-3/4 rounded bg-soft" />
                      <div className="h-4 w-full rounded bg-soft" />
                    </div>
                    <div className="h-3 w-8 rounded bg-soft" />
                  </div>
                  <div className="mt-2 h-4 w-16 rounded bg-soft" />
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function CatalogContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filters = parseProductFilters(searchParams);
  const filteredProducts = useMemo(() => filterProducts(products, filters), [filters]);
  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(filters.page, pageCount);
  const pageProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function updateFilters(partial: Partial<typeof filters>) {
    const next = { ...filters, ...partial, page: 1 };
    const query = serializeProductFilters(next, 1);
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function goToPage(page: number) {
    const query = serializeProductFilters(filters, page);
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  function clearFilters() {
    router.replace(pathname, { scroll: false });
  }

  const activeFilters =
    Boolean(filters.query || filters.category || filters.minPrice !== null ||
      filters.maxPrice !== null || filters.minRating > 0 || filters.inStock);

  return (
    <div className="page-container py-8 sm:py-12">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs text-muted">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden="true" className="px-2">/</span>
        <span aria-current="page">Shop all</span>
      </nav>
      <div className="flex flex-col justify-between gap-5 border-b border-line pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow">A little bit of everything</p>
          <h1 className="section-title mt-2">The good things shop</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Thoughtful everyday finds, picked with care and priced to feel good.
          </p>
        </div>
        <form
          role="search"
          onSubmit={(event) => event.preventDefault()}
          className="relative w-full sm:max-w-[300px]"
        >
          <label htmlFor="catalog-search" className="sr-only">Search products</label>
          <Search
            size={17}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
            aria-hidden="true"
          />
          <input
            id="catalog-search"
            className="field-control !rounded-full !pl-11"
            type="search"
            placeholder="Search something lovely…"
            value={filters.query}
            onChange={(event) => updateFilters({ query: event.target.value })}
          />
          {filters.query && (
            <button
              type="button"
              className="icon-button absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2"
              aria-label="Clear search"
              onClick={() => updateFilters({ query: "" })}
            >
              <X size={15} aria-hidden="true" />
            </button>
          )}
        </form>
      </div>

      {filters.category && (
        <div className="mt-5 flex items-center gap-2 text-sm">
          <span className="rounded-full bg-soft px-3 py-1.5">
            {formatCategory(filters.category)}
          </span>
          <button type="button" className="text-xs text-muted underline" onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      )}

      <div className="mt-7 grid gap-8 md:grid-cols-[210px_1fr] lg:grid-cols-[230px_1fr]">
        <aside className="hidden md:block">
          <div className="sticky top-[150px]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-sm font-semibold">Filters</h2>
              {activeFilters && (
                <button className="text-xs text-muted underline" onClick={clearFilters} type="button">
                  Reset
                </button>
              )}
            </div>
            <FilterControls filters={filters} idPrefix="desktop" onChange={updateFilters} />
          </div>
        </aside>
        <section aria-labelledby="results-heading" className="min-w-0">
          <div className="mb-5 flex items-center justify-between gap-3">
            <p className="text-sm text-muted" id="results-heading">
              <span className="font-medium text-ink">{filteredProducts.length}</span>{" "}
              {filteredProducts.length === 1 ? "good thing" : "good things"}
            </p>
            <button
              type="button"
              className="button-secondary !min-h-10 !px-4 md:hidden"
              onClick={() => setFiltersOpen(true)}
            >
              <Filter size={15} aria-hidden="true" /> Filters
            </button>
          </div>
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {filteredProducts.length} products found.
          </p>
          <ProductGrid products={pageProducts} />
          {pageCount > 1 && (
            <nav aria-label="Product pages" className="mt-10 flex items-center justify-center gap-2">
              <button
                type="button"
                className="button-secondary !min-h-10 !px-4"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
              >
                Previous
              </button>
              <span className="px-3 text-sm text-muted" aria-live="polite">
                Page {currentPage} of {pageCount}
              </span>
              <button
                type="button"
                className="button-secondary !min-h-10 !px-4"
                disabled={currentPage === pageCount}
                onClick={() => goToPage(currentPage + 1)}
              >
                Next
              </button>
            </nav>
          )}
        </section>
      </div>
      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filter and sort"
        placement="end"
        className="noma-filter-drawer"
      >
        <FilterControls filters={filters} idPrefix="mobile" onChange={updateFilters} />
        <button
          type="button"
          className="button-primary mt-7 w-full"
          onClick={() => setFiltersOpen(false)}
        >
          Show {filteredProducts.length} results
        </button>
      </Drawer>
    </div>
  );
}

export function CatalogPage() {
  return (
    <Suspense fallback={<CatalogFallback />}>
      <CatalogContent />
    </Suspense>
  );
}
