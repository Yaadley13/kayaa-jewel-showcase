import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { CATEGORIES, fetchProductsPage } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { z } from "zod";

const searchSchema = z.object({
  filter: z.enum(["featured", "bestseller", "new"]).optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Jewels by Kayaa" },
      { name: "description", content: "Browse the full collection of delicate, timeless jewellery by Kayaa." },
      { property: "og:title", content: "Shop — Jewels by Kayaa" },
      { property: "og:description", content: "The full Kayaa collection." },
    ],
  }),
  component: Shop,
});

const PRICE_OPTIONS = [
  { label: "All Prices", value: "all" },
  { label: "Under ₹400", value: "400" },
  { label: "Under ₹500", value: "500" },
  { label: "Under ₹700", value: "700" },
  { label: "Under ₹1,000", value: "1000" },
];

const SORT_OPTIONS = [
  { label: "Featured", value: "featured" },
  { label: "Newest", value: "new" },
  { label: "Price: Low → High", value: "price-asc" },
  { label: "Price: High → Low", value: "price-desc" },
];

const FILTER_LABELS: Record<string, string> = {
  featured: "Featured Collection",
  bestseller: "Best Sellers",
  new: "New Arrivals",
};

function Shop() {
  const { filter } = useSearch({ from: "/shop" });
  const [cat, setCat] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<string>("all");
  const [sort, setSort] = useState<string>("featured");

  const activeFilter = filter ?? null;

  const queryKey = ["products-page", { cat, maxPrice, sort, activeFilter }];

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam = 0 }) =>
      fetchProductsPage(pageParam as number, {
        category: cat,
        maxPrice: maxPrice !== "all" ? Number(maxPrice) : undefined,
        sort,
        preFilter: activeFilter,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length : undefined,
    staleTime: 2 * 60 * 1000,
  });

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Infinite scroll — watch a sentinel div at the bottom
  const sentinelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" } // start loading 200px before reaching the bottom
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const pageTitle = activeFilter ? FILTER_LABELS[activeFilter] : "Our Collection";

  return (
    <div className="bg-[#faf7f4] w-full">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pt-14 pb-10 text-center md:px-10 md:pt-20">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">Browse</p>
        <h1 className="mt-3 font-serif text-[2.6rem] text-[#2b2421] md:text-[3.2rem]">{pageTitle}</h1>
        {!isLoading && total > 0 && (
          <p className="mt-2 text-xs text-[#9a8c82]">{total} piece{total !== 1 ? "s" : ""}</p>
        )}
      </div>

      {/* Filters */}
      <div className="mx-auto max-w-7xl px-6 pb-8 md:px-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-[0.7rem] tracking-wider uppercase transition-all ${
                  cat === c
                    ? "border-transparent text-white shadow-sm"
                    : "border-[#d8d0c6] bg-white text-[#5a5047] hover:border-[#2b2421] hover:text-[#2b2421]"
                }`}
                style={cat === c ? { backgroundImage: "var(--gradient-brand)" } : undefined}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Sort + Price dropdowns */}
          <div className="flex flex-wrap gap-3">
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="rounded-full border border-[#d8d0c6] bg-white px-4 py-1.5 text-[0.72rem] tracking-wide text-[#5a5047] outline-none appearance-none pr-8 cursor-pointer hover:border-[#2b2421] transition-colors"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5047' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              {PRICE_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-[#d8d0c6] bg-white px-4 py-1.5 text-[0.72rem] tracking-wide text-[#5a5047] outline-none appearance-none pr-8 cursor-pointer hover:border-[#2b2421] transition-colors"
              style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%235a5047' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Products grid */}
      <div className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
        {isLoading ? (
          <ProductGridSkeleton count={16} />
        ) : products.length === 0 ? (
          <p className="py-20 text-center text-[#7a6f66]">No pieces match these filters.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {/* Infinite scroll sentinel */}
            <div ref={sentinelRef} className="h-4" />

            {/* Loading spinner when fetching next page */}
            {isFetchingNextPage && (
              <div className="mt-8 flex justify-center">
                <Loader2 size={22} className="animate-spin text-[#d64a86]" />
              </div>
            )}

            {/* End of results */}
            {!hasNextPage && products.length > 0 && (
              <p className="mt-10 text-center text-xs text-[#9a8c82] tracking-wider">
                — {products.length} of {total} pieces —
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
