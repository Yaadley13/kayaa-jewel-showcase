import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import founderImg from "@/assets/founder.jpg";
import { useProducts } from "@/lib/use-products";
import { ProductCard } from "@/components/product-card";
import { BRAND } from "@/lib/brand";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jewels by Kayaa — Delicate. Timeless. Yours." },
      { name: "description", content: "Handcrafted western jewellery — delicate, timeless pieces designed to be worn every day and treasured forever." },
      { property: "og:title", content: "Jewels by Kayaa" },
      { property: "og:description", content: "Delicate. Timeless. Yours." },
    ],
  }),
  component: Home,
});

function Home() {
  const [products] = useProducts();
  const featured = products.filter(p => p.featured).slice(0, 4);
  const bestsellers = products.slice(0, 4);
  const newArrivals = products.filter(p => p.isNew).slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 pt-10 pb-16 md:grid-cols-2 md:px-10 md:pt-16 md:pb-24">
          <div className="animate-fadeup">
            <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">{BRAND.tagline}</p>
            <h1 className="mt-5 font-serif text-[2.6rem] leading-[1.05] md:text-[4.2rem]">
              Quiet pieces,<br/>
              <span className="italic text-gradient">loud feelings.</span>
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
              Hand-finished western jewellery for the woman who notices the small, precious things.
              Designed slowly, in tiny editions.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/shop" className="btn-gradient btn-gradient-hover">DM to Order</Link>
              <Link to="/shop" className="btn-outline-luxe">View Collection</Link>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[color:var(--color-nude)]/50 blur-2xl" />
            <img src={heroImg} alt="Delicate pearl necklace on cream silk" width={1600} height={1200}
              className="aspect-[4/5] w-full rounded-[1.5rem] object-cover shadow-card" />
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <Section eyebrow="Collections" title="Featured this season">
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {featured.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* BESTSELLERS */}
      <Section eyebrow="Loved by you" title="Best sellers" cta={{ to: "/shop", label: "Shop all" }}>
        <div className="grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-6">
          {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* NEW ARRIVALS */}
      <Section eyebrow="Just in" title="New arrivals">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </Section>

      {/* BRAND STORY */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <img src={founderImg} alt="The Kayaa studio" loading="lazy" width={1000} height={1200}
            className="aspect-[4/5] w-full rounded-[1.5rem] object-cover shadow-card" />
          <div>
            <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Our story</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">A studio built on stillness.</h2>
            <p className="mt-5 leading-relaxed text-muted-foreground">
              Kayaa started as a small notebook of sketches and an even smaller table by the window.
              Today, every piece is still drawn by hand, made in tiny batches, and packed with care
              — because jewellery you wear forever deserves that kind of attention.
            </p>
            <Link to="/about" className="mt-7 inline-flex items-center gap-2 text-sm tracking-luxe uppercase">
              Read the story <ArrowRight size={16}/>
            </Link>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <Newsletter />
    </>
  );
}

function Section({ eyebrow, title, cta, children }: { eyebrow: string; title: string; cta?: { to: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:px-10 md:py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">{eyebrow}</p>
          <h2 className="mt-2 font-serif text-3xl md:text-4xl">{title}</h2>
        </div>
        {cta && (
          <Link to={cta.to} className="hidden text-sm tracking-luxe uppercase md:inline-flex md:items-center md:gap-2">
            {cta.label} <ArrowRight size={16}/>
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  return (
    <section className="mx-auto max-w-3xl px-6 py-20 text-center">
      <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Stay close</p>
      <h2 className="mt-3 font-serif text-3xl md:text-4xl">Letters from the studio</h2>
      <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
        New pieces, behind-the-scenes, and the occasional early access — straight to your inbox.
      </p>
      <form
        onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
        className="mx-auto mt-7 flex max-w-md flex-col gap-3 sm:flex-row"
      >
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 rounded-full border border-border bg-white px-5 py-3 text-sm outline-none transition-colors focus:border-foreground/40"
        />
        <button type="submit" className="btn-gradient btn-gradient-hover">Subscribe</button>
      </form>
      {done && <p className="mt-4 text-sm text-muted-foreground">Thank you — see you soon.</p>}
    </section>
  );
}
