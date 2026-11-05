import { discountedPrice } from "@/lib/pricing";
import { formatPrice } from "@/lib/format";

type PriceProps = {
  price: number;
  discountPercentage: number;
  compact?: boolean;
};

export function Price({ price, discountPercentage, compact = false }: PriceProps) {
  const currentPrice = discountedPrice(price, discountPercentage);
  const discounted = discountPercentage > 0;

  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className={compact ? "font-semibold" : "text-2xl font-semibold tracking-tight"}>
        {formatPrice(currentPrice)}
      </span>
      {discounted && (
        <>
          <span className="text-sm text-muted line-through">{formatPrice(price)}</span>
          <span className="text-xs font-medium text-clay">
            Save {Math.round(discountPercentage)}%
          </span>
        </>
      )}
    </span>
  );
}
