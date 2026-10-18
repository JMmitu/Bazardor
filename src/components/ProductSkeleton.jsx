export function ProductSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4" aria-hidden="true">
      <div className="size-12 shrink-0 animate-pulse rounded-xl bg-base-300 motion-reduce:animate-none" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-base-300 motion-reduce:animate-none" />
        <div className="h-3 w-1/3 animate-pulse rounded bg-base-300 motion-reduce:animate-none" />
        <div className="h-6 w-1/2 animate-pulse rounded bg-base-300 motion-reduce:animate-none" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <div role="status" aria-label="লোড হচ্ছে" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductSkeleton;
