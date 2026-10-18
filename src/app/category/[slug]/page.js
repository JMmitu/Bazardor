import { notFound } from "next/navigation";
import CategoryProducts from "@/components/CategoryProducts";
import StateMessage from "@/components/StateMessage";
import { getCategoryBySlug, getProductsByCategory } from "@/lib/api";
import { formatNumber } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug).catch(() => null);
  return { title: category ? category.name : "ক্যাটাগরি" };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;

  let category, products;
  try {
    [category, products] = await Promise.all([getCategoryBySlug(slug), getProductsByCategory(slug)]);
  } catch (err) {
    console.error("[bazardor] category data failed:", err.message);
    return (
      <StateMessage icon="⚠️" title="দাম লোড করা যায়নি" message="বাজারের তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।" homeLink />
    );
  }

  // Unknown slug or a category with no products -> friendly 404.
  if (!category || products.length === 0) notFound();

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 shadow-sm">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-page text-4xl" aria-hidden="true">{category.icon}</span>
        <div>
          <h1 className="text-2xl font-bold leading-8">{category.name}</h1>
          <p className="text-ink/70">{formatNumber(products.length)}টি পণ্যের আজকের দাম ও পরিবর্তন</p>
        </div>
      </header>
      <CategoryProducts products={products} />
    </div>
  );
}
