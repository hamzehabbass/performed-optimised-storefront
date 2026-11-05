import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { snapshotDate } from "@/lib/catalog";

export function StoreFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-soft">
      <div className="page-container grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <Link href="/" className="text-[27px] font-semibold tracking-[-.08em]">
            noma<span className="text-clay">.</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-muted">
            A little more considered. Everyday things, chosen to make the everyday feel special.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.14em]">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li><Link href="/products/" className="hover:text-ink dark:hover:text-white">Shop all</Link></li>
            <li><Link href="/wishlist/" className="hover:text-ink dark:hover:text-white">Your wishlist</Link></li>
            <li><Link href="/about/" className="hover:text-ink dark:hover:text-white">About Noma</Link></li>
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[.14em]">The small print</h2>
          <p className="mt-4 text-sm leading-6 text-muted">
            This is a demo store. No real orders or payments are processed.
          </p>
          <a
            href="https://dummyjson.com"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs text-muted underline underline-offset-4 hover:text-ink dark:hover:text-white"
          >
            Product data from DummyJSON <ArrowUpRight size={12} aria-hidden="true" />
          </a>
          <p className="mt-2 text-xs text-muted">Snapshot taken {snapshotDate}.</p>
        </div>
      </div>
      <div className="page-container flex flex-col gap-2 border-t border-line py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Noma Market. Made for everyday living.</p>
        <p>Thoughtful finds, no fuss.</p>
      </div>
    </footer>
  );
}
