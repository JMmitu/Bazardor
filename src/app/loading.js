import { SkeletonGrid } from "@/components/ProductSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-64 animate-pulse rounded-3xl bg-base-300 motion-reduce:animate-none" aria-hidden="true" />
      <SkeletonGrid count={6} />
    </div>
  );
}
