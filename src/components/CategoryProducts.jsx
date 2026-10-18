"use client";

import { useMemo, useState } from "react";
import ProductGrid from "./ProductGrid";
import SortSelect from "./SortSelect";
import { sortProducts } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export default function CategoryProducts({ products }) {
  const [sort, setSort] = useState("default");
  const sorted = useMemo(() => sortProducts(products, sort), [products, sort]);
  return (
    <>
      <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/70" aria-live="polite">
          মোট {formatNumber(sorted.length)}টি পণ্য দেখানো হচ্ছে
        </p>
        <SortSelect value={sort} onChange={setSort} id="category-sort" />
      </div>
      <div className="mt-4">
        <ProductGrid products={sorted} />
      </div>
    </>
  );
}
