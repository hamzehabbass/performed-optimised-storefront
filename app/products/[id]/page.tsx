import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck } from "lucide-react";
import { ProductGallery } from "@/components/product-gallery";
import { ProductBuyBox } from "@/components/product-buy-box";
import { ProductGrid } from "@/components/product-grid";
import { getProduct, getRelatedProducts, products } from "@/lib/products";
import { formatCategory } from "@/lib/format";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.description.slice(0, 155),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 155),
      images: product.images.slice(0, 1),
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(Number(id));
  if (!product) notFound();

  const related = getRelatedProducts(product);
  const reviewCount = product.reviews.length;

  return (
    <div className="page-container pb-20 pt-7 sm:pt-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs text-muted">
        <Link href="/" className="hover:underline">Home</Link>
        <span aria-hidden="true" className="px-2">/</span>
        <Link href="/products/" className="hover:underline">Shop</Link>
        <span aria-hidden="true" className="px-2">/</span>
        <Link
          href={`/products/?cat=${encodeURIComponent(product.category)}`}
          className="hover:underline"
        >
          {formatCategory(product.category)}
        </Link>
        <span aria-hidden="true" className="px-2">/</span>
        <span aria-current="page">{product.title}</span>
      </nav>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
        <ProductGallery images={product.images} title={product.title} />
        <section className="md:sticky md:top-[145px] md:self-start">
          <p className="eyebrow">{product.brand || formatCategory(product.category)}</p>
          <h1 className="mt-2 text-3xl font-medium leading-tight tracking-[-.045em] sm:text-4xl">
            {product.title}
          </h1>
          <a
            href="#reviews"
            className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm text-muted"
          >
            <span className="text-amber-500" aria-label={`${product.rating} out of 5 stars`}>
              {"★".repeat(Math.round(product.rating))}
            </span>
            <span>{product.rating.toFixed(1)} ({reviewCount} reviews)</span>
          </a>
          <ProductBuyBox
            product={{
              id: product.id,
              title: product.title,
              price: product.price,
              discountPercentage: product.discountPercentage,
              rating: product.rating,
              stock: product.stock,
              brand: product.brand,
              category: product.category,
              thumbnail: product.thumbnail,
            }}
          />
          <p className="mt-6 text-sm leading-7 text-muted">{product.description}</p>
          <div className="mt-6 grid gap-3 border-y border-line py-5 text-xs text-muted sm:grid-cols-2">
            <p className="flex items-center gap-2">
              <Truck size={16} className="shrink-0" aria-hidden="true" />
              Free shipping on orders over $75
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck size={16} className="shrink-0" aria-hidden="true" />
              Easy 30-day returns
            </p>
          </div>
          <p className="mt-4 text-xs leading-5 text-muted">
            Demo shop: product information is provided by DummyJSON. No real purchase is made.
          </p>
        </section>
      </div>

      <section id="reviews" className="mt-16 border-t border-line pt-10">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">From people like you</p>
            <h2 className="section-title mt-2">A few kind words</h2>
          </div>
          <p className="text-sm text-muted">
            {product.rating.toFixed(1)} out of 5 · {reviewCount} reviews
          </p>
        </div>
        {reviewCount > 0 ? (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {product.reviews.map((review, index) => (
              <li key={`${review.reviewerName}-${index}`} className="rounded-xl bg-soft p-5">
                <p className="text-amber-500" aria-label={`${review.rating} out of 5 stars`}>
                  {"★".repeat(review.rating)}
                </p>
                <p className="mt-3 text-sm leading-6">{review.comment}</p>
                <p className="mt-4 text-xs text-muted">
                  {review.reviewerName} · {new Date(review.date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-5 text-sm text-muted">No reviews just yet.</p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">A few more good things</p>
              <h2 className="section-title mt-2">You might also like</h2>
            </div>
            <Link
              href={`/products/?cat=${encodeURIComponent(product.category)}`}
              className="text-link"
            >
              More like this <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
          <ProductGrid products={related} />
        </section>
      )}

    </div>
  );
}
