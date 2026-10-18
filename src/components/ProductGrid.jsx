import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <li key={p.slug}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
