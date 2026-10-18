import Link from "next/link";
import PriceBadge from "./PriceBadge";
import { formatTaka, perUnit } from "@/lib/format";

export default function ProductCard({ product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-4 shadow-sm transition hover:border-brand hover:shadow-md focus-visible:border-brand motion-reduce:transition-none"
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-page text-2xl"
        aria-hidden="true"
      >
        {product.emoji}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-base font-semibold leading-6">{product.name}</span>
        <span className="block text-xs text-ink/70">{perUnit(product.unit)}</span>
        <span className="mt-2 flex items-end justify-between gap-2">
          <span>
            <span className="block text-xs text-ink/70">আজকের দাম</span>
            <span className="block text-xl font-bold leading-7">{formatTaka(product.today)}</span>
          </span>
          <PriceBadge change={product.change} />
        </span>
      </span>
    </Link>
  );
}
