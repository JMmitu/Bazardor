// LOCAL TEST HARNESS ONLY — never imported by the app.
// The sandbox used to develop this project cannot reach the real market API,
// so this serves a fixture with the same JSON shape as the real response
// (verified against https://api.api-store.workers.dev/api/bazardor).
// Prices/changes mirror the real response; per-market numbers are synthetic.
// Usage: node tests/fixtures/mock-api-server.mjs  (port 4010)
import http from "node:http";

const cats = [
  ["chal", "চাল", "🍚"], ["dal", "ডাল", "🫘"], ["tel", "তেল", "🛢️"], ["sobji", "সবজি", "🥬"],
  ["mach", "মাছ", "🐟"], ["mangsho", "মাংস", "🍗"], ["dim-dui", "ডিম-দুধ", "🥛"], ["mosla", "মসলা", "🌶️"],
];
// [id, slug, nameBn, cat, unit, image, today, yesterday, lastWeek, lastMonth]
const rows = [
  [1,"sorno-machi-chal","স্বর্ণমাছি চাল","chal","kg","🍚",148,145,142,138],
  [2,"miniket-chal","মিনিকেট চাল","chal","kg","🍚",99,102,105,100],
  [3,"nazir-chal","নাজির চাল","chal","kg","🍚",74,74,72,70],
  [4,"batam-size-chal","বাটাম সাইজ চাল","chal","kg","🍚",66,64,63,61],
  [5,"mosur-dal","মসুর ডাল","dal","kg","🫘",142,138,135,132],
  [6,"mug-dal","মুগ ডাল","dal","kg","🫘",135,135,130,128],
  [7,"chola-dal","ছোলা","dal","kg","🫘",120,123,122,118],
  [8,"aman-dal-khosasila","আমন ডাল (খোসাসিলা)","dal","kg","🫘",156,152,148,145],
  [9,"sorishar-tel","সরিষার তেল","tel","litre","🫙",192,188,184,180],
  [10,"pam-tel","পাম তেল","tel","kg","🛢️",168,172,175,178],
  [11,"ghani-banga-sorishar-tel","ঘানি ভাঙা সরিষার তেল","tel","litre","🫙",215,210,198,195],
  [12,"alu","আলু","sobji","kg","🥔",30,32,34,36],
  [13,"peyaj","পেঁয়াজ","sobji","kg","🧅",54,48,45,60],
  [14,"kaccha-moric","কাঁচামরিচ","sobji","kg","🌶️",92,105,120,140],
  [15,"begun","বেগুন","sobji","kg","🍆",44,42,40,45],
  [16,"dhenders","ঢেঁড়স","sobji","kg","🟢",38,38,36,35],
  [17,"rui-mach","রুই মাছ","mach","kg","🐟",46,44,42,40],
  [18,"telapiya-mach","তেলাপিয়া","mach","kg","🐟",36,36,35,34],
  [19,"ilish-mach","ইলিশ মাছ","mach","kg","🐠",1850,1790,1700,1650],
  [20,"katla-mach","কাতলা মাছ","mach","kg","🐠",43,45,44,42],
  [21,"chingri-mach","চিংড়ি মাছ (খোলা)","mach","kg","🦐",330,320,310,300],
  [22,"murgi-r-mangsho","মুরগির মাংস","mangsho","kg","🍗",225,228,220,215],
  [23,"goru-r-mangsho","গরুর মাংস","mangsho","kg","🥩",790,800,780,760],
  [24,"khasir-mangsho","খাসির মাংস","mangsho","kg","🍖",1290,1330,1300,1280],
  [25,"hanser-mangsho","হাঁসের মাংস","mangsho","kg","🦆",285,295,310,320],
  [26,"dim","ডিম","dim-dui","dozen","🥚",158,152,148,145],
  [27,"dui-dudh","দুধ","dim-dui","litre","🥛",102,100,98,96],
  [28,"doi","দই","dim-dui","litre","🥣",92,92,90,88],
  [29,"mokhhan","মাখন (১০০ গ্রাম)","dim-dui","piece","🧈",145,140,138,135],
  [30,"ada","আদা","mosla","kg","🫚",85,78,72,70],
  [31,"roshun","রসুন","mosla","kg","🧄",125,135,140,150],
  [32,"morich-gunda","মরিচ গুঁড়া","mosla","kg","🌶️",245,250,240,235],
  [33,"dhanepata-gunda","ধনেপাতা গুঁড়া","mosla","kg","🍃",265,265,258,250],
];
const markets = [
  ["কারওয়ান বাজার","ঢাকা"],["গ্রীন মার্কেট, মিরপুর","ঢাকা"],["চৌদগ্রাম বাজার","চট্টগ্রাম"],["আমতলী বাজার","চট্টগ্রাম"],
  ["সদর বাজার","রাজশাহী"],["বাসারহাট বাজার","রাজশাহী"],["মাঠ বাজার","ময়মনসিংহ"],["চৌর বাজার","ময়মনসিংহ"],
  ["বাজারহাট","খুলনা"],["ডবলগেট বাজার","খুলনা"],["আমবাজার","সিলেট"],["চৌরাস্তা বাজার","সিলেট"],
];
const catName = Object.fromEntries(cats.map(([s, n]) => [s, n]));
const catIcon = Object.fromEntries(cats.map(([s, , i]) => [s, i]));
const products = rows.map(([id, slug, nameBn, category, unit, image, today, yesterday, lastWeek, lastMonth]) => {
  const pct = yesterday ? Math.round(((today - yesterday) / yesterday) * 1000) / 10 : 0;
  return {
    id, slug, nameBn, category, categoryNameBn: catName[category], categoryIcon: catIcon[category], unit, image,
    today, yesterday, lastWeek, lastMonth,
    change: { dir: pct > 0 ? "up" : pct < 0 ? "down" : "flat", pct },
    markets: markets.map(([market, division], i) => ({
      market, division, min: Math.round(today * (0.93 + (i % 5) * 0.015)), max: Math.round(today * (1.06 + (i % 4) * 0.02)),
    })),
  };
});
const categories = cats.map(([slug, nameBn, icon]) => ({ id: slug, slug, nameBn, icon }));

http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const send = (code, body) => { res.writeHead(code, { "content-type": "application/json; charset=utf-8" }); res.end(JSON.stringify(body)); };
  const p = url.pathname.replace(/^\/api\/bazardor/, "");
  if (process.env.MOCK_FAIL === "1") return send(500, { error: "forced failure" });
  if (p === "/products") {
    const c = url.searchParams.get("category");
    return send(200, c ? products.filter((x) => x.category === c) : products);
  }
  if (p.startsWith("/products/")) { const x = products.find((q) => String(q.id) === p.split("/")[2]); return x ? send(200, x) : send(404, { error: "not found" }); }
  if (p === "/categories") return send(200, categories);
  if (p.startsWith("/categories/")) { const x = categories.find((q) => q.slug === p.split("/")[2]); return x ? send(200, x) : send(404, { error: "not found" }); }
  send(404, { error: "not found" });
}).listen(4010, () => console.log("mock API on :4010"));
