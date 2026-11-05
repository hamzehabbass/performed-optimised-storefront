import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Leaf, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Our story",
  description: "A little about Noma Market and the thinking behind the edit.",
};

const principles = [
  {
    icon: Sparkles,
    title: "A thoughtful edit",
    description: "A considered collection of useful, lovely things for the everyday.",
  },
  {
    icon: Heart,
    title: "Everyday, made easier",
    description: "A calmer way to find the little things you’ll actually use and enjoy.",
  },
  {
    icon: Leaf,
    title: "A lighter footprint",
    description: "We believe good choices can feel simple, clear and easy to understand.",
  },
];

export default function AboutPage() {
  return (
    <div className="page-container">
      <section className="mx-auto max-w-3xl py-16 text-center sm:py-24">
        <p className="eyebrow">A little about us</p>
        <h1 className="mt-4 text-4xl font-medium leading-tight tracking-[-.06em] sm:text-6xl">
          Less scrolling. More <span className="font-serif italic">good stuff.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted">
          Noma started with a simple thought: finding something lovely for home or life should feel
          easy. So we put together a thoughtful collection of everyday finds, kept the experience
          calm, and left out the fuss.
        </p>
      </section>
      <section className="grid gap-4 border-y border-line py-9 sm:grid-cols-3 sm:gap-8 sm:py-12">
        {principles.map(({ icon: Icon, title, description }) => (
          <div key={title} className="rounded-xl bg-soft p-5 sm:p-6">
            <Icon size={20} className="text-olive dark:text-emerald-300" aria-hidden="true" />
            <h2 className="mt-4 font-medium">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
          </div>
        ))}
      </section>
      <section className="mx-auto max-w-2xl py-14 text-center sm:py-20">
        <h2 className="text-2xl font-medium tracking-tight">A note about this little shop</h2>
        <p className="mt-4 text-sm leading-7 text-muted">
          Noma is a demo storefront created to explore a fast, accessible shopping experience.
          Product information is a real, committed snapshot from DummyJSON. There is no backend,
          account system or payment processor, and no real order is ever placed.
        </p>
        <Link href="/products/" className="button-primary mx-auto mt-6 w-fit">
          Explore the shop <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}
