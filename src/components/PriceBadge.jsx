import { formatPercent } from "@/lib/format";

const STYLES = {
  up: { cls: "text-up bg-up/10", icon: "▲", word: "বেড়েছে" },
  down: { cls: "text-down bg-down/10", icon: "▼", word: "কমেছে" },
  flat: { cls: "text-ink/70 bg-base-300", icon: "–", word: "অপরিবর্তিত" },
};

export default function PriceBadge({ change, className = "" }) {
  const s = STYLES[change.dir] ?? STYLES.flat;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-semibold ${s.cls} ${className}`}
      aria-label={change.dir === "flat" ? "দাম অপরিবর্তিত" : `দাম ${formatPercent(change.pct)} ${s.word}`}
    >
      <span aria-hidden="true">{s.icon}</span>
      <span>{formatPercent(change.pct)}</span>
    </span>
  );
}

export function changeColorClass(dir) {
  return dir === "up" ? "text-up" : dir === "down" ? "text-down" : "text-ink/60";
}
