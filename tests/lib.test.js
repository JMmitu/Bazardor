import test from "node:test";
import assert from "node:assert/strict";
import {
  parsePrice, toBengaliDigits, formatNumber, formatTaka, formatPercent, perUnit, safeCallbackUrl,
} from "../src/lib/format.js";
import { normalizeProduct, sortProducts, topMovers } from "../src/lib/api.js";

test("parsePrice handles Bengali digits, commas, symbols and unit text", () => {
  assert.equal(parsePrice("১,২৯০ টাকা"), 1290);
  assert.equal(parsePrice("৳১৪৮/কেজি"), 148);
  assert.equal(parsePrice("2.5%"), 2.5);
  assert.equal(parsePrice(66), 66);
  assert.ok(Number.isNaN(parsePrice("n/a")));
});

test("Bengali formatting", () => {
  assert.equal(toBengaliDigits(2026), "২০২৬");
  assert.equal(formatNumber(1290), "১,২৯০");
  assert.equal(formatTaka(148), "১৪৮ টাকা");
  assert.equal(formatPercent(-12.4), "১২.৪%");
  assert.equal(formatPercent(3), "৩%");
  assert.equal(perUnit("dozen"), "প্রতি ডজন");
});

test("safeCallbackUrl rejects open redirects", () => {
  assert.equal(safeCallbackUrl("/product/alu"), "/product/alu");
  assert.equal(safeCallbackUrl("https://evil.com"), "/");
  assert.equal(safeCallbackUrl("//evil.com"), "/");
  assert.equal(safeCallbackUrl(undefined), "/");
});

const raw = (id, slug, today, yesterday, change) => ({
  id, slug, nameBn: slug, category: "c", categoryNameBn: "C", categoryIcon: "🍚", unit: "kg",
  image: "🍚", today, yesterday, lastWeek: 1, lastMonth: 1, change,
  markets: [
    { market: "A", division: "ঢাকা", min: 10, max: 20 },
    { market: "B", division: "ঢাকা", min: 20, max: 30 },
  ],
});

test("normalizeProduct keeps API change and computes market stats from API data", () => {
  const p = normalizeProduct(raw(1, "x", 148, 145, { dir: "up", pct: 2.1 }));
  assert.deepEqual(p.change, { dir: "up", pct: 2.1 });
  assert.deepEqual(p.stats, { min: 10, max: 30, avg: 20 });
  assert.equal(p.markets[0].avg, 15);
});

test("normalizeProduct derives change only when the API omits it", () => {
  const p = normalizeProduct(raw(2, "y", 99, 102, undefined));
  assert.equal(p.change.dir, "down");
  assert.equal(p.change.pct, -2.9);
  const flat = normalizeProduct(raw(3, "z", 74, 74, { dir: "flat", pct: 0 }));
  assert.equal(flat.change.dir, "flat");
});

test("sorting uses numeric prices (1850 sorts after 330, not before)", () => {
  const list = [raw(1, "a", 1850, 1, {dir:"up",pct:1}), raw(2, "b", 330, 1, {dir:"up",pct:1}), raw(3, "c", 92, 1, {dir:"up",pct:1})].map(normalizeProduct);
  assert.deepEqual(sortProducts(list, "price-asc").map((p) => p.slug), ["c", "b", "a"]);
  assert.deepEqual(sortProducts(list, "price-desc").map((p) => p.slug), ["a", "b", "c"]);
  assert.deepEqual(sortProducts(list, "default").map((p) => p.slug), ["a", "b", "c"]);
});

test("topMovers returns the biggest movers in one direction", () => {
  const list = [
    raw(1, "a", 1, 1, { dir: "up", pct: 2 }),
    raw(2, "b", 1, 1, { dir: "up", pct: 9 }),
    raw(3, "c", 1, 1, { dir: "down", pct: -5 }),
  ].map(normalizeProduct);
  assert.deepEqual(topMovers(list, "up").map((p) => p.slug), ["b", "a"]);
  assert.deepEqual(topMovers(list, "down").map((p) => p.slug), ["c"]);
});

import { validateName, validateEmail, validatePassword, authErrorMessage } from "../src/lib/validation.js";

test("form validation", () => {
  assert.equal(validateName("মিতু"), "");
  assert.notEqual(validateName(" "), "");
  assert.notEqual(validateName("ম"), "");
  assert.equal(validateEmail("a@b.co"), "");
  assert.notEqual(validateEmail("a@b"), "");
  assert.notEqual(validateEmail(""), "");
  assert.equal(validatePassword("12345678"), "");
  assert.notEqual(validatePassword("1234567"), "");
});

test("auth error codes map to Bengali, unknown codes get a generic message", () => {
  assert.match(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD" }), /সঠিক নয়/);
  assert.match(authErrorMessage({ code: "SOMETHING_NEW" }), /ভুল/);
});
