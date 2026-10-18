import { changeColorClass } from "./PriceBadge";
import { formatNumber, unitLabel } from "@/lib/format";

function TickerItem({ p, hidden = false }) {
  const icon = p.change.dir === "up" ? "▲" : p.change.dir === "down" ? "▼" : "–";
  return (
    <li className="flex shrink-0 items-center gap-2 px-5 text-sm" aria-hidden={hidden || undefined}>
      <span aria-hidden="true">{p.emoji}</span>
      <span className="font-medium">{p.name}</span>
      <span>
        {formatNumber(p.today)} টাকা/{unitLabel(p.unit)}
      </span>
      <span className={`font-semibold ${changeColorClass(p.change.dir)}`}>
        <span aria-hidden="true">{icon} </span>
        {p.change.pct === 0 ? "০%" : `${formatNumber(Math.abs(p.change.pct), 1)}%`}
        <span className="sr-only">
          {p.change.dir === "up" ? " বেড়েছে" : p.change.dir === "down" ? " কমেছে" : " অপরিবর্তিত"}
        </span>
      </span>
    </li>
  );
}

/** Continuously scrolling price strip. Content is repeated once so the loop is
 *  seamless; the repeat is hidden from assistive tech. With reduced motion the
 *  animation stops and the strip becomes manually scrollable. */
export default function Ticker({ products }) {
  if (!products?.length) return null;
  return (
    <div
      className="ticker-viewport overflow-hidden border-b border-line bg-surface"
      role="region"
      aria-label="আজকের পণ্যের দামের তালিকা"
      tabIndex={0}
    >
      <ul className="ticker-track flex w-max animate-ticker py-2">
        {products.map((p) => (
          <TickerItem key={p.slug} p={p} />
        ))}
        {products.map((p) => (
          <TickerItem key={`dup-${p.slug}`} p={p} hidden />
        ))}
      </ul>
    </div>
  );
}
