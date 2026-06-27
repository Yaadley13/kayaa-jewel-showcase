import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { useProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/product-card";
import { ProductGridSkeleton } from "@/components/product-card-skeleton";
import { BRAND } from "@/lib/brand";
import type { Product } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jewels by Kayaa — Delicate. Timeless. Yours." },
      { name: "description", content: "Handcrafted jewellery designed for women who embrace elegance in every moment." },
      { property: "og:title", content: "Jewels by Kayaa" },
      { property: "og:description", content: "Delicate. Timeless. Yours." },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: products = [], isLoading } = useProducts();
  const featured = products.filter((p) => p.featured).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNew).slice(0, 4);

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden w-full">
        <div className="relative h-[480px] md:h-[580px] w-full">
          <img
            src={heroImg}
            alt="Handcrafted jewellery on cream silk"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
          {/* Overlay gradient — left side fade for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/75 via-white/40 to-transparent" />

          {/* Text content */}
          <div className="relative flex h-full items-center">
            <div className="mx-auto w-full max-w-7xl px-6 md:px-10">
              <div className="max-w-md animate-fadeup">
                <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">
                  Jewels by Kayaa
                </p>
                <h1 className="mt-3 font-serif text-[2.8rem] leading-[1.05] text-[#2b2421] md:text-[3.8rem]">
                  Delicate.<br />
                  Timeless.<br />
                  Yours.
                </h1>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-[#5a5047] max-w-xs">
                  Handcrafted jewellery designed for women who embrace elegance in every moment.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 rounded-full border border-[#2b2421] bg-white px-6 py-2.5 text-[0.75rem] tracking-wider uppercase text-[#2b2421] transition-colors hover:bg-[#2b2421] hover:text-white"
                  >
                    View Collection <ArrowRight size={14} />
                  </Link>
                  <a
                    href={BRAND.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[0.75rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden>
                      <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62a11.96 11.96 0 0 0 5.82 1.48h.01c6.62 0 11.98-5.36 11.98-11.98 0-3.2-1.25-6.21-3.49-8.4ZM12.02 21.8a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.68.96.98-3.59-.23-.37a9.79 9.79 0 0 1-1.5-5.24c0-5.42 4.41-9.83 9.83-9.83 2.63 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 6.96c0 5.42-4.41 9.81-9.87 9.81Zm5.4-7.34c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z" />
                    </svg>
                    DM to Order
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COLLECTION ── */}
      <ProductSection eyebrow="Curated for You" title="Featured Collection" products={featured} isLoading={isLoading} />

      {/* ── BEST SELLERS ── */}
      <ProductSection eyebrow="Most Loved" title="Best Sellers" products={bestsellers} bgClass="bg-white" isLoading={isLoading} />

      {/* ── NEW ARRIVALS ── */}
      <ProductSection eyebrow="Just In" title="New Arrivals" products={newArrivals} isLoading={isLoading} />

      {/* ── BRAND STORY ── */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-xl px-6 text-center md:px-10">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">
            Our Story
          </p>
          <h2 className="mt-3 font-serif text-4xl text-[#2b2421] md:text-5xl">
            Crafted with Intention
          </h2>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-[#7a6f66]">
            Every piece in our collection is thoughtfully designed and handcrafted with care. We believe jewellery should be more than an accessory — it should be an extension of who you are.
          </p>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-[#2b2421] px-7 py-2.5 text-[0.75rem] tracking-wider uppercase text-[#2b2421] transition-colors hover:bg-[#2b2421] hover:text-white"
          >
            Read Our Story <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </>
  );
}

function ProductSection({
  eyebrow,
  title,
  products,
  bgClass = "bg-[#faf7f4]",
  isLoading = false,
}: {
  eyebrow: string;
  title: string;
  products: Product[];
  bgClass?: string;
  isLoading?: boolean;
}) {
  return (
    <section className={`${bgClass} py-16 md:py-20`}>
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-10 text-center">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-serif text-[2.2rem] text-[#2b2421] md:text-[2.6rem]">
            {title}
          </h2>
        </div>
        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

