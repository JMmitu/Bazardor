import Navbar from "./Navbar";
import Ticker from "./Ticker";
import { getCategories, getProducts } from "@/lib/api";

/** Server component: loads categories + products (cached) for navbar and ticker.
 *  If the API is down the header still renders; pages show their own error. */
export default async function Header() {
  const [categories, products] = await Promise.all([
    getCategories().catch(() => []),
    getProducts().catch(() => []),
  ]);
  return (
    <>
      <Navbar categories={categories} />
      <Ticker products={products} />
    </>
  );
}
