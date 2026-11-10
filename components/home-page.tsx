import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import { ProductGrid } from "@/components/product-grid";
import { categories, products } from "@/lib/catalog";
import { formatCategory } from "@/lib/format";

const featuredCategories = ["home-decoration", "furniture", "beauty", "smartphones"];

export function HomePage() {
  const heroProduct =
    products.find((product) => product.category === "furniture") ?? products[0];
  const topRated = [...products]
    .sort((a, b) => b.rating - a.rating || a.id - b.id)
    .slice(0, 4);
  const bestDeals = [...products]
    .sort((a, b) => b.discountPercentage - a.discountPercentage || a.id - b.id)
    .slice(0, 4);

  return (
    <>
      <section className="page-container pt-5 sm:pt-8">
        <div className="relative grid min-h-[480px] overflow-hidden rounded-[18px] bg-[#ece9df] dark:bg-[#33352d] md:min-h-[550px] md:grid-cols-[1.05fr_.95fr]">
          <div className="relative z-10 flex flex-col items-start justify-center px-6 py-10 sm:px-12 md:px-14 lg:px-[72px]">
            <p className="mb-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.17em] text-olive dark:text-emerald-200">
              <Sparkles size={14} aria-hidden="true" />
              Little things, considered
            </p>
            <h1 className="max-w-[510px] text-[clamp(2.6rem,6.6vw,5.25rem)] font-medium leading-[.99] tracking-[-.065em]">
              Good things for the <span className="font-serif italic">everyday.</span>
            </h1>
            <p className="mt-5 max-w-[390px] text-sm leading-6 text-[#52534c] dark:text-[#d1d1c6] sm:text-base">
              Useful, lovely, and just a little unexpected. Find a new favourite in our thoughtfully
              chosen collection.
            </p>
            <Link href="/products/" className="button-primary mt-7">
              Find your something <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <p className="mt-5 text-xs text-[#52534c] dark:text-[#d1d1c6]">
              Independent finds. Everyday prices.
            </p>
          </div>
          <div className="absolute inset-y-0 right-0 w-[52%] md:relative md:w-auto">
            <Image
              src={heroProduct.thumbnail}
              alt={heroProduct.title}
              fill
              priority
              sizes="(max-width: 767px) 52vw, 48vw"
              className="object-contain p-8 md:p-12"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#ece9df] via-[#ece9df]/30 to-transparent dark:from-[#33352d] dark:via-[#33352d]/30 md:bg-gradient-to-r" />
          </div>
          <div className="absolute bottom-5 right-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink/60 md:bottom-8 md:right-8">
            <ArrowDownRight size={18} aria-hidden="true" />
          </div>
        </div>
      </section>

      <section className="page-container pt-16 sm:pt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">A good place to start</p>
            <h2 className="section-title mt-2">Browse by feeling</h2>
          </div>
          <Link href="/products/" className="text-link hidden sm:inline-flex">
            All collections <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {featuredCategories.map((category, index) => {
            const cover =
              products.find((product) => product.category === category) ?? products[index];
            return (
              <Link
                key={category}
                href={`/products/?cat=${encodeURIComponent(category)}`}
                className="category-card"
              >
                <Image
                  src={cover.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 48vw, 24vw"
                  className="object-contain p-5"
                />
                <span className="relative z-10 px-4 pb-4 text-sm font-medium text-white sm:px-5 sm:pb-5">
                  {formatCategory(category)}
                </span>
              </Link>
            );
          })}
        </div>
        <Link href="/products/" className="text-link mt-5 inline-flex sm:hidden">
          All collections <ArrowUpRight size={15} aria-hidden="true" />
        </Link>
        <p className="sr-only">{categories.length} collections available in the shop.</p>
      </section>

      <section className="page-container pt-16 sm:pt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Tried, loved, kept</p>
            <h2 className="section-title mt-2">A few favourites</h2>
          </div>
          <Link href="/products/?sort=rating" className="text-link">
            See all <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ProductGrid products={topRated} />
      </section>

      <section className="page-container pt-16 sm:pt-20">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">A little lovely for less</p>
            <h2 className="section-title mt-2">Good things on offer</h2>
          </div>
          <Link href="/products/?sort=discount-desc" className="text-link">
            Shop all deals <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <ProductGrid products={bestDeals} />
      </section>

      <section className="page-container pt-16 sm:pt-20">
        <div className="grid gap-8 rounded-[18px] bg-soft px-6 py-9 sm:grid-cols-3 sm:gap-5 sm:px-9 sm:py-11">
          {[
            ["01", "A smaller, better edit", "Only the good stuff, from the everyday to the unexpected."],
            ["02", "Easy does it", "Straightforward prices, simple shipping, no surprises."],
            ["03", "Made for real life", "Useful little things that earn their place at home."],
          ].map(([number, title, description]) => (
            <div key={number} className="flex gap-4">
              <span className="pt-1 text-xs text-muted">{number}</span>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
