import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { useProducts } from "@/lib/use-products";
import { formatPrice } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { waLinkFor } from "@/lib/brand";
import { InstagramDmButton } from "@/components/instagram-dm-button";

export const Route = createFileRoute("/product/$id")({
  component: ProductDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-serif text-3xl">Piece not found</h1>
      <Link to="/shop" className="mt-6 inline-flex btn-outline-luxe">Back to shop</Link>
    </div>
  ),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const { data: products = [] } = useProducts();
  const product = products.find(p => p.id === id);
  const [active, setActive] = useState(0);

  if (!product) throw notFound();

  const gallery = [product.image, product.imageAlt ?? product.image, product.image];
  const related = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 pt-10 pb-20 md:grid-cols-2 md:px-10 md:pt-16">
        {/* Gallery */}
        <div>
          <div className="overflow-hidden rounded-2xl bg-[#f5f0eb]">
            <img src={gallery[active]} alt={product.name} className="aspect-[4/5] w-full object-cover" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {gallery.map((g, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`overflow-hidden rounded-xl border-2 transition-colors ${active === i ? "border-[#2b2421]" : "border-transparent"}`}>
                <img src={g} alt="" className="aspect-square w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">{product.category}</p>
          <h1 className="mt-2 font-serif text-4xl text-[#2b2421] md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl text-[#2b2421]">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-[#9a8c82]">Price shown for reference. Enquire to order.</p>

          <p className="mt-8 leading-relaxed text-[#5a5047]">{product.description}</p>

          {product.isSoldOut ? (
            <div className="mt-9 rounded-2xl border border-[#e8e0d5] bg-[#faf7f4] px-5 py-4 text-center">
              <p className="font-serif text-lg text-[#2b2421]">Currently Sold Out</p>
              <p className="mt-1 text-sm text-[#9a8c82]">DM us on Instagram to join the waitlist for this piece.</p>
              <InstagramDmButton
                productName={product.name}
                productPrice={product.price}
                productCategory={product.category}
                productId={product.id}
                className="mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-[#2b2421] px-6 py-2.5 text-[0.75rem] tracking-wider uppercase text-[#2b2421] transition-colors hover:bg-[#2b2421] hover:text-white"
              />
            </div>
          ) : (
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href={waLinkFor({ name: product.name, price: product.price, category: product.category, id: product.id })} target="_blank" rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full py-3 text-[0.75rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
                style={{ backgroundImage: "var(--gradient-brand)" }}>
                Order via WhatsApp
              </a>
              <InstagramDmButton
                productName={product.name}
                productPrice={product.price}
                productCategory={product.category}
                productId={product.id}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-[#2b2421] py-3 text-[0.75rem] tracking-wider uppercase text-[#2b2421] transition-colors hover:bg-[#2b2421] hover:text-white"
              />
            </div>
          )}

          <ul className="mt-10 grid grid-cols-2 gap-4 border-t border-[#e8e0d5] pt-6 text-xs text-[#7a6f66]">
            <li>✦ Handcrafted in small batches</li>
            <li>✦ Hypoallergenic, skin-safe</li>
            <li>✦ Gift-wrapped on request</li>
            <li>✦ Pan-India shipping</li>
          </ul>
        </div>
      </div>

      {/* Reviews */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Customer notes</p>
        <h2 className="mt-2 font-serif text-3xl">Loved by Kayaa girls</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[
            { name: "Aanya", text: "Even more delicate in person. I haven't taken it off." },
            { name: "Riya", text: "The packaging alone made me cry. The piece is perfection." },
            { name: "Tanya", text: "So well made. Feels like a forever piece, not a trend." },
          ].map((r, i) => (
            <div key={i} className="rounded-2xl bg-white p-6 shadow-card">
              <div className="flex gap-0.5 text-[color:var(--color-peach)]">
                {[...Array(5)].map((_, k) => <Star key={k} size={14} fill="currentColor" stroke="none" />)}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground/80">"{r.text}"</p>
              <p className="mt-3 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">— {r.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          <h2 className="mb-8 font-serif text-3xl">You may also love</h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
            {related.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </>
  );
}
