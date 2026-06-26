import { createFileRoute, Link } from "@tanstack/react-router";
import founderImg from "@/assets/founder.jpg";
import heroImg from "@/assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jewels by Kayaa" },
      { name: "description", content: "The story behind Jewels by Kayaa — a small studio of delicate, handcrafted western jewellery." },
      { property: "og:title", content: "About — Jewels by Kayaa" },
      { property: "og:description", content: "A small studio. A quiet love letter to forever pieces." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <>
      <section className="mx-auto max-w-4xl px-6 pt-16 pb-10 text-center md:pt-24">
        <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Our story</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight md:text-7xl">
          A quiet love letter to <span className="italic text-gradient">forever pieces.</span>
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10 md:px-10">
        <img src={heroImg} alt="" className="aspect-[16/9] w-full rounded-[1.5rem] object-cover shadow-card" />
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-16 md:grid-cols-5 md:px-10">
        <div className="md:col-span-2">
          <img src={founderImg} alt="The studio" className="aspect-[4/5] w-full rounded-2xl object-cover shadow-card" />
          <p className="mt-4 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">A note from the founder</p>
        </div>
        <div className="md:col-span-3">
          <h2 className="font-serif text-3xl md:text-4xl">Made slowly. Worn forever.</h2>
          <div className="mt-6 space-y-5 leading-relaxed text-foreground/80">
            <p>
              Kayaa was born out of a simple frustration — the western jewellery I wanted to wear every day
              either felt disposable or impossibly expensive. So I started sketching the pieces I wished
              existed: delicate, quiet, the kind you forget you're wearing until someone notices.
            </p>
            <p>
              Every piece is hand-finished in our small studio, made in tiny batches, and packed with a
              hand-written note. We don't do big drops or trend chasing — we make the things we'd wear
              ourselves, and we make them to last.
            </p>
            <p className="font-serif text-2xl italic">— Kayaa</p>
          </div>
          <Link to="/shop" className="btn-gradient btn-gradient-hover mt-8">Explore the collection</Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-6 px-6 py-16 text-center md:grid-cols-3 md:px-10">
        {[
          { title: "Hand-finished", body: "Every clasp, every stone, every chain — touched by hand." },
          { title: "Small batches", body: "We make few. So each piece feels rare, even if it isn't." },
          { title: "For everyday", body: "Built tough enough for real life. Pretty enough to dress up." },
        ].map(v => (
          <div key={v.title} className="rounded-2xl bg-white/60 p-7 shadow-card">
            <h3 className="font-serif text-xl">{v.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{v.body}</p>
          </div>
        ))}
      </section>
    </>
  );
}
