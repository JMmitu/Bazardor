// Formatting and number helpers shared across the app.

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Convert western digits in a string/number to Bengali digits. */
export function toBengaliDigits(value) {
  return String(value).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
}

/**
 * Parse a number out of anything: 148, "148", "১৪৮ টাকা", "৳১,২৯০/কেজি".
 * Returns NaN when no number is present. Used for every price comparison so
 * we never sort formatted strings.
 */
export function parsePrice(value) {
  if (typeof value === "number") return value;
  if (value == null) return NaN;
  const ascii = String(value)
    .replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
    .replace(/[,٬،]/g, "")
    .replace("।", ".");
  const match = ascii.match(/-?\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : NaN;
}

/** 1290 -> "১,২৯০" (Bengali digits, western-style thousands grouping). */
export function formatNumber(value, maximumFractionDigits = 0) {
  const n = parsePrice(value);
  if (Number.isNaN(n)) return "—";
  return toBengaliDigits(
    new Intl.NumberFormat("en-US", { maximumFractionDigits }).format(n),
  );
}

/** 148 -> "১৪৮ টাকা" */
export function formatTaka(value) {
  const f = formatNumber(value);
  return f === "—" ? f : `${f} টাকা`;
}

/** 2.1 -> "২.১%" (sign omitted, direction is shown by the arrow) */
export function formatPercent(pct) {
  const n = Math.abs(parsePrice(pct));
  if (Number.isNaN(n)) return "—";
  return `${toBengaliDigits(Number.isInteger(n) ? n : n.toFixed(1))}%`;
}

const UNIT_LABELS = {
  kg: "কেজি",
  litre: "লিটার",
  liter: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
};

export function unitLabel(unit) {
  return UNIT_LABELS[unit] ?? unit ?? "";
}

/** "kg" -> "প্রতি কেজি" */
export function perUnit(unit) {
  return `প্রতি ${unitLabel(unit)}`;
}

/** Full Bengali date, e.g. "শনিবার, ১৭ অক্টোবর, ২০২৬" (Bangladesh time). */
export function formatBengaliDate(date = new Date()) {
  return new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
}

/** Only allow same-site relative paths as post-login redirect targets. */
export function safeCallbackUrl(value, fallback = "/") {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }
  return value;
}
