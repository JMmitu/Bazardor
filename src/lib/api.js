import { cache } from "react";
import { parsePrice } from "./format.js";

/**
 * Market-price API client.
 *
 * Order of attempts: primary host first, then the alternatives. A response is
 * only accepted from a host if it has the expected shape (see isCompatible),
 * so an incompatible alternative can never silently feed bad data to the UI.
 */
export const API_BASES = [
  process.env.BAZARDOR_API_URL || "https://openapi.programming-hero.com/api/bazardor",
  "https://api.api-store.workers.dev/api/bazardor",
  "https://api.abcz.workers.dev/api/bazardor",
];

const REVALIDATE_SECONDS = 300;
const TIMEOUT_MS = 8000;

export class ApiError extends Error {
  constructor(message, options) {
    super(message, options);
    this.name = "ApiError";
  }
}

function unwrap(json) {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    for (const key of ["data", "products", "categories", "items", "results"]) {
      if (Array.isArray(json[key])) return json[key];
    }
  }
  return json;
}

const isProductList = (list) =>
  Array.isArray(list) &&
  list.every((p) => p && typeof p === "object" && p.slug && Number.isFinite(parsePrice(p.today)));

const isCategoryList = (list) =>
  Array.isArray(list) && list.every((c) => c && typeof c === "object" && c.slug && c.nameBn);

async function fetchFromBases(path, isCompatible) {
  const failures = [];
  for (const base of API_BASES) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        signal: AbortSignal.timeout(TIMEOUT_MS),
        headers: { accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = unwrap(await res.json());
      if (!isCompatible(data)) throw new Error("unexpected response shape");
      return data;
    } catch (err) {
      failures.push(`${base}: ${err.message}`);
    }
  }
  throw new ApiError(`All market API hosts failed (${failures.join("; ")})`);
}

/* ---------------------------- normalisation ----------------------------- */

function directionOf(today, previous) {
  if (!Number.isFinite(today) || !Number.isFinite(previous)) return "flat";
  if (today > previous) return "up";
  if (today < previous) return "down";
  return "flat";
}

export function normalizeProduct(raw) {
  const today = parsePrice(raw.today);
  const yesterday = parsePrice(raw.yesterday);

  // Prefer the change the API reports; derive it from today/yesterday only if
  // the API omitted it. Either way it comes from real API prices.
  let dir = raw.change?.dir;
  let pct = parsePrice(raw.change?.pct);
  if (!["up", "down", "flat"].includes(dir) || Number.isNaN(pct)) {
    dir = directionOf(today, yesterday);
    pct =
      Number.isFinite(yesterday) && yesterday !== 0
        ? Math.round(((today - yesterday) / yesterday) * 1000) / 10
        : 0;
  }

  const markets = (Array.isArray(raw.markets) ? raw.markets : [])
    .map((m) => ({
      name: m.market,
      division: m.division,
      min: parsePrice(m.min),
      max: parsePrice(m.max),
    }))
    .filter((m) => m.name && Number.isFinite(m.min) && Number.isFinite(m.max))
    .map((m) => ({ ...m, avg: Math.round((m.min + m.max) / 2) }));

  const stats = markets.length
    ? {
        min: Math.min(...markets.map((m) => m.min)),
        max: Math.max(...markets.map((m) => m.max)),
        avg: Math.round(markets.reduce((sum, m) => sum + m.avg, 0) / markets.length),
      }
    : null;

  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.nameBn ?? raw.name,
    category: raw.category,
    categoryName: raw.categoryNameBn ?? raw.category,
    categoryIcon: raw.categoryIcon ?? "🛒",
    emoji: raw.image || raw.categoryIcon || "🛒",
    unit: raw.unit,
    today,
    yesterday,
    lastWeek: parsePrice(raw.lastWeek),
    lastMonth: parsePrice(raw.lastMonth),
    change: { dir, pct },
    markets,
    stats,
  };
}

export function normalizeCategory(raw) {
  return { id: raw.id ?? raw.slug, slug: raw.slug, name: raw.nameBn, icon: raw.icon ?? "🛒" };
}

/* ------------------------------ public API ------------------------------ */

// React `cache` dedupes identical calls within one render pass; the fetch
// itself is cached by Next for REVALIDATE_SECONDS.
export const getProducts = cache(async () => {
  const data = await fetchFromBases("/products", isProductList);
  return data.map(normalizeProduct);
});

export const getCategories = cache(async () => {
  const data = await fetchFromBases("/categories", isCategoryList);
  return data.map(normalizeCategory);
});

export async function getProductBySlug(slug) {
  const products = await getProducts();
  return products.find((p) => p.slug === slug) ?? null;
}

export async function getCategoryBySlug(slug) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

export async function getProductsByCategory(slug) {
  const products = await getProducts();
  return products.filter((p) => p.category === slug);
}

/** Top `limit` movers in one direction, biggest percentage change first. */
export function topMovers(products, dir, limit = 6) {
  return products
    .filter((p) => p.change.dir === dir)
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, limit);
}

export const SORT_OPTIONS = [
  { value: "default", label: "ডিফল্ট" },
  { value: "price-asc", label: "দাম: কম থেকে বেশি" },
  { value: "price-desc", label: "দাম: বেশি থেকে কম" },
];

/** Sorts a copy by numeric price. "default" keeps the API order. */
export function sortProducts(products, mode) {
  if (mode === "price-asc") return [...products].sort((a, b) => parsePrice(a.today) - parsePrice(b.today));
  if (mode === "price-desc") return [...products].sort((a, b) => parsePrice(b.today) - parsePrice(a.today));
  return products;
}
