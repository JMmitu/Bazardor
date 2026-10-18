import Link from "next/link";
import { notFound } from "next/navigation";
import PriceBadge, { changeColorClass } from "@/components/PriceBadge";
import StateMessage from "@/components/StateMessage";
import { getProductBySlug } from "@/lib/api";
import { requireSession } from "@/lib/session";
import { formatNumber, formatTaka, perUnit, unitLabel } from "@/lib/format";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug).catch(() => null);
  return { title: product ? product.name : "পণ্য" };
}

function Stat({ label, value, tone }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-4">
      <p className="text-sm text-ink/70">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${tone ?? ""}`}>{value}</p>
    </div>
  );
}

function changeSentence(p) {
  const diff = Math.abs(p.today - p.yesterday);
  if (p.change.dir === "flat" || !Number.isFinite(diff)) return "গতকালের তুলনায় আজ দাম অপরিবর্তিত";
  return `গতকালের তুলনায় আজ দাম ${p.change.dir === "up" ? "বেড়েছে" : "কমেছে"} · ${formatTaka(diff)}`;
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  // Server-side guard. Unauthenticated visitors are sent to /signin and
  // returned here afterwards.
  await requireSession(`/product/${slug}`);

  let product;
  try {
    product = await getProductBySlug(slug);
  } catch (err) {
    console.error("[bazardor] product data failed:", err.message);
    return <StateMessage icon="⚠️" title="দাম লোড করা যায়নি" message="বাজারের তথ্য এই মুহূর্তে পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।" homeLink />;
  }
  if (!product) notFound();

  const { stats, markets } = product;

  return (
    <div className="space-y-8">
      <nav aria-label="breadcrumb" className="text-sm text-ink/70">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link href="/" className="hover:text-brand">হোম</Link></li>
          <li aria-hidden="true">›</li>
          <li><Link href={`/category/${product.category}`} className="hover:text-brand">{product.categoryName}</Link></li>
          <li aria-hidden="true">›</li>
          <li aria-current="page" className="font-medium text-ink">{product.name}</li>
        </ol>
      </nav>

      <header className="flex flex-col gap-6 rounded-2xl border border-line bg-surface p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl bg-page text-5xl" aria-hidden="true">{product.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold leading-9">{product.name}</h1>
            <ul className="mt-2 flex flex-wrap gap-2 text-sm">
              <li className="rounded-full bg-page px-3 py-1">{perUnit(product.unit)}</li>
              <li>
                <Link href={`/category/${product.category}`} className="rounded-full bg-brand/10 px-3 py-1 text-brand-deep hover:bg-brand/20">
                  {product.categoryIcon} {product.categoryName}
                </Link>
              </li>
            </ul>
            <p className={`mt-2 text-sm font-medium ${changeColorClass(product.change.dir)}`}>{changeSentence(product)}</p>
          </div>
        </div>
        <div className="rounded-2xl bg-page p-4 text-center md:min-w-48">
          <p className="text-sm text-ink/70">আজকের দাম</p>
          <p className="text-3xl font-bold">{formatTaka(product.today)}</p>
          <p className="text-sm text-ink/70">প্রতি {unitLabel(product.unit)}</p>
          <PriceBadge change={product.change} className="mt-2" />
        </div>
      </header>

      <section aria-labelledby="about-title">
        <h2 id="about-title" className="text-xl font-bold">পণ্যের সারসংক্ষেপ</h2>
        <p className="mt-2 text-ink/80">
          {product.name} {perUnit(product.unit)} আজ গড়ে {formatTaka(stats?.avg ?? product.today)} দামে বিক্রি হচ্ছে।
          {markets.length > 0 && ` ${formatNumber(markets.length)}টি বাজারের তথ্য অনুযায়ী দাম ${formatTaka(stats.min)} থেকে ${formatTaka(stats.max)} পর্যন্ত।`}
        </p>
      </section>

      <section aria-labelledby="summary-title">
        <h2 id="summary-title" className="text-xl font-bold">দামের সারসংক্ষেপ</h2>
        {stats ? (
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <Stat label="সর্বনিম্ন দাম" value={formatTaka(stats.min)} tone="text-down" />
            <Stat label="সর্বোচ্চ দাম" value={formatTaka(stats.max)} tone="text-up" />
            <Stat label="গড় দাম" value={formatTaka(stats.avg)} />
          </div>
        ) : (
          <p className="mt-3 rounded-2xl border border-line bg-surface p-4 text-ink/70">এই পণ্যের মূল্যসীমার তথ্য পাওয়া যায়নি।</p>
        )}
      </section>

      <section aria-labelledby="history-title">
        <h2 id="history-title" className="text-xl font-bold">সময়ের তুলনা</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-3">
          <Stat label="গতকাল" value={formatTaka(product.yesterday)} />
          <Stat label="গত সপ্তাহ" value={formatTaka(product.lastWeek)} />
          <Stat label="গত মাস" value={formatTaka(product.lastMonth)} />
        </div>
      </section>

      <section aria-labelledby="markets-title">
        <h2 id="markets-title" className="text-xl font-bold">বাজারভিত্তিক আজকের দাম</h2>
        {markets.length ? (
          <div className="mt-3 overflow-x-auto rounded-2xl border border-line bg-surface">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <caption className="sr-only">{product.name} — বাজারভিত্তিক দাম ({perUnit(product.unit)})</caption>
              <thead className="bg-base-200 text-ink/80">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold">বাজার</th>
                  <th scope="col" className="px-4 py-3 font-semibold">বিভাগ</th>
                  <th scope="col" className="px-4 py-3 font-semibold">সর্বনিম্ন</th>
                  <th scope="col" className="px-4 py-3 font-semibold">সর্বাধিক</th>
                  <th scope="col" className="px-4 py-3 font-semibold">গড়</th>
                </tr>
              </thead>
              <tbody>
                {markets.map((m, i) => (
                  <tr key={`${m.name}-${i}`} className={i % 2 ? "bg-base-200/60" : ""}>
                    <th scope="row" className="px-4 py-3 font-medium">{m.name}</th>
                    <td className="px-4 py-3">{m.division}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-down">{formatTaka(m.min)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-up">{formatTaka(m.max)}</td>
                    <td className="whitespace-nowrap px-4 py-3">{formatTaka(m.avg)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 rounded-2xl border border-line bg-surface p-4 text-ink/70">এই পণ্যের বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।</p>
        )}
        <p className="mt-2 text-xs text-ink/60">“গড়” প্রতিটি বাজারের সর্বনিম্ন ও সর্বাধিক দামের গড় থেকে হিসাব করা।</p>
      </section>
    </div>
  );
}
