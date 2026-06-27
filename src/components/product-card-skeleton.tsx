export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-square rounded-2xl bg-[#ede8e3]" />
      <div className="mt-3 px-0.5 space-y-2">
        <div className="h-4 w-3/4 rounded-full bg-[#ede8e3]" />
        <div className="h-3 w-1/3 rounded-full bg-[#ede8e3]" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
