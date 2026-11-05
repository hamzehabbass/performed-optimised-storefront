import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="page-container flex min-h-[55vh] flex-col items-center justify-center py-16 text-center">
      <p className="eyebrow">A little detour</p>
      <h1 className="mt-3 text-5xl font-medium tracking-[-.07em]">404</h1>
      <h2 className="mt-2 text-xl font-medium">This page wandered off.</h2>
      <p className="mt-3 max-w-sm text-sm leading-6 text-muted">
        The link may be old, or the thing you’re looking for has moved along.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="button-secondary">
          <ArrowLeft size={15} aria-hidden="true" /> Back home
        </Link>
        <Link href="/products/" className="button-primary">
          <Search size={15} aria-hidden="true" /> Find something
        </Link>
      </div>
    </div>
  );
}
