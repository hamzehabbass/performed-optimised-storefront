"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button, FormField } from "hamzehabbass-accessible-ui";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Truck } from "lucide-react";
import { CartItem } from "@/components/cart-item";
import { CartSummary } from "@/components/cart-summary";
import { checkoutSchema, type CheckoutValues } from "@/lib/validation";
import { getCartTotals } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";
import { useCartStore } from "@/stores/cart-store";
import { useStoreHydration } from "@/lib/use-store-hydration";
import type { SavedOrder } from "@/lib/types";

const countries = [
  "Australia",
  "Canada",
  "France",
  "Germany",
  "India",
  "Ireland",
  "Italy",
  "Netherlands",
  "New Zealand",
  "Pakistan",
  "Spain",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
];

export function CheckoutForm() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const hydrated = useStoreHydration(useCartStore.persist);
  const {
    register,
    handleSubmit,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      shippingMethod: "standard",
    },
    shouldFocusError: true,
  });
  const shippingMethod = useWatch({ control, name: "shippingMethod" });
  const totals = getCartTotals(items, shippingMethod);

  function fieldError(id: keyof CheckoutValues) {
    return errors[id]?.message;
  }

  function onSubmit(values: CheckoutValues) {
    if (items.length === 0) {
      setError("root", { message: "Your bag is empty. Add something lovely before checkout." });
      return;
    }

    const order: SavedOrder = {
      id: `NOMA-${globalThis.crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: values.fullName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        country: values.country,
      },
      shippingMethod: values.shippingMethod,
      items,
      ...getCartTotals(items, values.shippingMethod),
    };

    try {
      localStorage.setItem("noma-last-order", JSON.stringify(order));
    } catch (error) {
      console.error("Could not save your demo order.", error);
      setError("root", {
        message: "We couldn’t save this demo order in your browser. Please check your browser storage and try again.",
      });
      return;
    }

    clearCart();
    router.push(`/order/confirmation?orderId=${encodeURIComponent(order.id)}`);
  }

  if (!hydrated) {
    return <p className="py-12 text-sm text-muted" role="status">Restoring your saved bag…</p>;
  }

  if (items.length === 0) {
    return (
      <div className="mt-7 rounded-2xl bg-soft px-6 py-12 text-center">
        <p className="font-medium">Your bag is empty.</p>
        <p className="mt-2 text-sm text-muted">Let’s find something worth bringing home.</p>
        <Link href="/products/" className="button-primary mt-5">Explore the shop</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-10 lg:grid-cols-[1fr_350px] lg:gap-16">
        <div>
          <div className="mb-7 rounded-xl border border-clay/40 bg-clay/5 p-4">
            <p className="font-medium">Demo checkout. No payment is taken.</p>
            <p className="mt-1 text-sm text-muted">
              This is a portfolio demo. We will not ask for or collect card details.
            </p>
          </div>

          <section aria-labelledby="contact-heading">
            <h2 id="contact-heading" className="text-lg font-semibold">Your details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <FormField
                label="Full name"
                id="fullName"
                required
                error={fieldError("fullName")}
              >
                <input
                  id="fullName"
                  autoComplete="name"
                  className="field-control"
                  aria-invalid={Boolean(fieldError("fullName"))}
                  {...register("fullName")}
                />
              </FormField>
              <FormField label="Email" id="email" required error={fieldError("email")}>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="field-control"
                  aria-invalid={Boolean(fieldError("email"))}
                  {...register("email")}
                />
              </FormField>
              <FormField label="Phone" id="phone" required error={fieldError("phone")}>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  className="field-control"
                  aria-invalid={Boolean(fieldError("phone"))}
                  {...register("phone")}
                />
              </FormField>
            </div>
          </section>

          <section aria-labelledby="delivery-heading" className="mt-8">
            <h2 id="delivery-heading" className="text-lg font-semibold">Where to send it</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <FormField label="Street address" id="address" required error={fieldError("address")}>
                  <input
                    id="address"
                    autoComplete="street-address"
                    className="field-control"
                    aria-invalid={Boolean(fieldError("address"))}
                    {...register("address")}
                  />
                </FormField>
              </div>
              <FormField label="City" id="city" required error={fieldError("city")}>
                <input
                  id="city"
                  autoComplete="address-level2"
                  className="field-control"
                  aria-invalid={Boolean(fieldError("city"))}
                  {...register("city")}
                />
              </FormField>
              <FormField label="Country" id="country" required error={fieldError("country")}>
                <select
                  id="country"
                  className="field-control"
                  autoComplete="country-name"
                  aria-invalid={Boolean(fieldError("country"))}
                  {...register("country")}
                >
                  <option value="">Choose a country</option>
                  {countries.map((country) => <option key={country}>{country}</option>)}
                </select>
              </FormField>
            </div>
          </section>

          <fieldset className="mt-8">
            <legend className="text-lg font-semibold">How it gets there</legend>
            <div className="mt-4 grid gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
                <input
                  type="radio"
                  value="standard"
                  className="mt-1 accent-olive"
                  {...register("shippingMethod")}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3 text-sm font-medium">
                    <span className="inline-flex items-center gap-2">
                      <Truck size={16} aria-hidden="true" /> Standard, 5–7 days
                    </span>
                    <span>{totals.subtotal >= 75 ? "Free" : formatPrice(6.99)}</span>
                  </span>
                  <span className="mt-1 block text-xs text-muted">A little patience, no rush.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-line p-4">
                <input
                  type="radio"
                  value="express"
                  className="mt-1 accent-olive"
                  {...register("shippingMethod")}
                />
                <span className="min-w-0 flex-1">
                  <span className="flex items-center justify-between gap-3 text-sm font-medium">
                    <span className="inline-flex items-center gap-2">
                      <ArrowRight size={16} aria-hidden="true" /> Express, 2–3 days
                    </span>
                    <span>{formatPrice(14.99)}</span>
                  </span>
                  <span className="mt-1 block text-xs text-muted">For the can’t-wait moments.</span>
                </span>
              </label>
            </div>
          </fieldset>
        </div>

        <aside className="h-fit rounded-2xl bg-soft p-5 sm:p-6 lg:sticky lg:top-[145px]">
          <h2 className="text-base font-semibold">Your order</h2>
          <div className="my-4 max-h-64 overflow-y-auto border-y border-line">
            {items.map((item) => <CartItem key={item.product.id} item={item} />)}
          </div>
          <CartSummary items={items} shippingMethod={shippingMethod} />
          {errors.root?.message && (
            <p className="mt-4 text-sm text-clay" role="alert">{errors.root.message}</p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="button-primary mt-6 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving your demo order…" : "Place demo order"}
            <ArrowRight size={16} aria-hidden="true" />
          </Button>
          <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-xs text-muted">
            <LockKeyhole size={13} aria-hidden="true" />
            No card details. No real payment.
          </p>
        </aside>
      </div>
    </form>
  );
}
