import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Jewels by Kayaa" },
      { name: "description", content: "The story behind Jewels by Kayaa — a small studio of delicate, handcrafted jewellery." },
      { property: "og:title", content: "About — Jewels by Kayaa" },
      { property: "og:description", content: "Where elegance meets soul." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div className="bg-[#faf7f4] w-full">
      {/* Hero section */}
      <section className="mx-auto max-w-3xl px-6 pt-16 pb-12 text-center md:px-10 md:pt-24">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">
          Our Story
        </p>
        <h1 className="mt-3 font-serif text-[2.8rem] leading-tight text-[#2b2421] md:text-[3.8rem]">
          Where Elegance Meets Soul
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-[#7a6f66] max-w-xl mx-auto">
          Jewels by Kayaa was born from a passion for delicate beauty and the belief that every woman deserves to feel extraordinary.
        </p>
      </section>

      {/* Story text */}
      <section className="mx-auto max-w-2xl px-6 pb-16 md:px-10">
        <h2 className="font-serif text-2xl text-[#2b2421] mb-4">The Beginning</h2>
        <div className="space-y-5 text-[0.95rem] leading-relaxed text-[#5a5047]">
          <p>
            What started as a personal quest for the perfect piece of jewellery became something much bigger. Unable to find pieces that felt both luxurious and personal, Kayaa began designing her own — and the response was overwhelming.
          </p>
          <p>
            Today, every piece in our collection reflects that same ethos: jewellery that feels like it was made just for you. We work with skilled artisans who share our commitment to quality and attention to detail.
          </p>
        </div>
      </section>

      {/* Founder quote card */}
      <section className="mx-auto max-w-2xl px-6 pb-16 md:px-10">
        <div className="rounded-2xl bg-white p-8 md:p-10 shadow-sm">
          <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium mb-5">
            From the Founder
          </p>
          <blockquote className="font-serif text-[1.2rem] italic leading-relaxed text-[#2b2421] md:text-[1.35rem]">
            "I believe jewellery should whisper, not shout. Each piece we create is designed to make you feel quietly confident — like wearing a secret that only you know about."
          </blockquote>
          <p className="mt-5 text-sm text-[#7a6f66]">— Kayaa</p>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-2xl px-6 pb-16 md:px-10">
        <h2 className="font-serif text-2xl text-[#2b2421] mb-7">Our Values</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Quality",
              body: "Every piece is crafted with the finest materials and meticulous attention to detail.",
            },
            {
              title: "Individuality",
              body: "We celebrate what makes you unique. Our jewellery is designed to complement your personal style.",
            },
            {
              title: "Sustainability",
              body: "We are committed to responsible sourcing and sustainable practices in everything we do.",
            },
          ].map((v) => (
            <div key={v.title} className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="font-serif text-[1.1rem] text-[#2b2421] mb-2">{v.title}</h3>
              <p className="text-[0.85rem] leading-relaxed text-[#7a6f66]">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#eee8e0] py-16">
        <div className="mx-auto max-w-2xl px-6 text-center md:px-10">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 rounded-full px-9 py-3.5 text-[0.78rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
            style={{ backgroundImage: "var(--gradient-brand)" }}
          >
            Explore the Collection <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
