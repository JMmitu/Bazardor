"use client";

import { useMemo, useState } from "react";
import { Button } from "@heroui/react";
import ProductGrid from "./ProductGrid";
import SortSelect from "./SortSelect";
import StateMessage from "./StateMessage";
import { sortProducts } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export default function AllProducts({ products, categories }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("default");

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = products.filter(
      (p) => (category === "all" || p.category === category) && (!q || p.name.toLowerCase().includes(q)),
    );
    return sortProducts(filtered, sort);
  }, [products, query, category, sort]);

  const reset = () => { setQuery(""); setCategory("all"); setSort("default"); };

  return (
    <section id="সব-পণ্য" aria-labelledby="all-products-title" className="scroll-mt-40">
      <h2 id="all-products-title" className="text-3xl font-bold leading-10">সব পণ্য</h2>
      <p className="mt-1 text-ink/70">আজকের সব নিত্যপ্রয়োজনীয় পণ্যের দাম ও পরিবর্তন।</p>

      <div className="mt-5 space-y-4 rounded-2xl border border-line bg-surface p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-md">
            <label htmlFor="product-search" className="sr-only">পণ্যের নাম খুঁজুন</label>
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="পণ্যের নাম লিখুন…"
              className="h-10 w-full rounded-lg border border-line bg-base-100 px-3 outline-none focus:border-brand"
            />
          </div>
          <SortSelect value={sort} onChange={setSort} id="home-sort" />
        </div>
        <div role="group" aria-label="ক্যাটাগরি ফিল্টার" className="flex flex-wrap gap-2">
          {[{ slug: "all", name: "সব" }, ...categories].map((c) => (
            <button
              key={c.slug}
              type="button"
              aria-pressed={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={`h-9 rounded-lg px-3 text-sm font-medium transition motion-reduce:transition-none ${
                category === c.slug ? "bg-brand text-white" : "bg-page text-ink hover:bg-base-300"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-ink/70" aria-live="polite">
        মোট {formatNumber(visible.length)}টি পণ্য দেখানো হচ্ছে
      </p>

      <div className="mt-3">
        {visible.length ? (
          <ProductGrid products={visible} />
        ) : (
          <StateMessage
            icon="🔍"
            title="কোনো পণ্য পাওয়া যায়নি"
            message="অন্য নাম বা ক্যাটাগরি দিয়ে চেষ্টা করুন।"
            action={<Button variant="outline" size="lg" onPress={reset}>ফিল্টার মুছুন</Button>}
          />
        )}
      </div>
    </section>
  );
}
