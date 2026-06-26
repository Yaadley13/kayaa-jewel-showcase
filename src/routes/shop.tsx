import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useProducts } from "@/lib/use-products";
import { CATEGORIES } from "@/lib/products";
import { ProductCard } from "@/components/product-card";

export const Route = createFileRoute("/shop")({
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

function Shop() {
  const [products] = useProducts();
  const [cat, setCat] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [sort, setSort] = useState<string>("featured");

  const filtered = useMemo(() => {
    let list = products.filter(p => (cat === "All" || p.category === cat) && p.price <= maxPrice);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "new") list = [...list].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "featured") list = [...list].sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
    return list;
  }, [products, cat, maxPrice, sort]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-12 pb-6 md:px-10 md:pt-20">
        <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Catalog</p>
        <h1 className="mt-2 font-serif text-4xl md:text-6xl">The Collection</h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Tap any piece you love — message us on WhatsApp or Instagram to place an order.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="flex flex-col gap-5 border-y border-border/60 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {["All", ...CATEGORIES].map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`rounded-full border px-4 py-1.5 text-[0.7rem] tracking-luxe uppercase transition-colors ${cat === c ? "border-foreground bg-foreground text-white" : "border-border text-foreground/70 hover:text-foreground"}`}>
                {c}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="tracking-luxe uppercase">Under ₹{maxPrice.toLocaleString("en-IN")}</span>
              <input type="range" min={1000} max={5000} step={100} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="accent-[color:var(--color-pink)]" />
            </label>
            <select value={sort} onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-white px-4 py-1.5 text-[0.7rem] tracking-luxe uppercase outline-none">
              <option value="featured">Featured</option>
              <option value="new">Newest</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
        {filtered.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">No pieces match these filters.</p>
        ) : (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-7 lg:grid-cols-4">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </>
  );
}
