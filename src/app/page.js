import Hero from "@/components/Hero";
import ProductGrid from "@/components/ProductGrid";
import AllProducts from "@/components/AllProducts";
import StateMessage from "@/components/StateMessage";
import { getCategories, getProducts, topMovers } from "@/lib/api";

function Movers({ id, title, subtitle, products, emptyText }) {
  return (
    <section aria-labelledby={id}>
      <h2 id={id} className="text-3xl font-bold leading-10">{title}</h2>
      <p className="mt-1 text-ink/70">{subtitle}</p>
      <div className="mt-4">
        {products.length ? <ProductGrid products={products} /> : <p className="rounded-2xl border border-line bg-surface p-6 text-ink/70">{emptyText}</p>}
      </div>
    </section>
  );
}

export default async function HomePage() {
  let products, categories;
  try {
    [products, categories] = await Promise.all([getProducts(), getCategories()]);
  } catch (err) {
    console.error("[bazardor] home data failed:", err.message);
    return (
      <StateMessage
        icon="⚠️"
        title="দাম লোড করা যায়নি"
        message="বাজারের তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। কিছুক্ষণ পর পেজটি রিফ্রেশ করুন।"
      />
    );
  }

  return (
    <div className="space-y-12">
      <Hero />
      <Movers
        id="price-up"
        title="আজ দাম বেড়েছে ▲"
        subtitle="গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি বেড়েছে।"
        products={topMovers(products, "up")}
        emptyText="আজ কোনো পণ্যের দাম বাড়েনি।"
      />
      <Movers
        id="price-down"
        title="আজ দাম কমেছে ▼"
        subtitle="গতকালের তুলনায় যেসব পণ্যের দাম সবচেয়ে বেশি কমেছে।"
        products={topMovers(products, "down")}
        emptyText="আজ কোনো পণ্যের দাম কমেনি।"
      />
      <AllProducts products={products} categories={categories} />
    </div>
  );
}
