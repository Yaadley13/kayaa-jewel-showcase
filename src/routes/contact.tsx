import { createFileRoute } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { submitContactForm } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Jewels by Kayaa" },
      { name: "description", content: "Get in touch with Jewels by Kayaa. Order via WhatsApp or DM on Instagram." },
      { property: "og:title", content: "Contact — Jewels by Kayaa" },
      { property: "og:description", content: "We'd love to hear from you." },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitContactForm(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
      <div>
        <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Say hello</p>
        <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
          We'd love to <span className="italic text-gradient">hear from you.</span>
        </h1>
        <p className="mt-5 max-w-md text-muted-foreground">
          Questions, custom pieces, gifting — we read every message and reply personally, usually within a day.
        </p>
        <ul className="mt-10 space-y-4 text-sm">
          <li className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card">
              <Mail size={16} />
            </span>
            <a href={`mailto:${BRAND.email}`}>{BRAND.email}</a>
          </li>
          <li className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white shadow-card">
              <Instagram size={16} />
            </span>
            <a href={BRAND.instagram} target="_blank" rel="noreferrer">@jewels_by_kayaa</a>
          </li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="btn-gradient btn-gradient-hover">
            WhatsApp us
          </a>
          <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="btn-outline-luxe">
            DM on Instagram
          </a>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-7 shadow-card md:p-10">
        <Field label="Your name">
          <input required value={form.name} onChange={update("name")} className="kayaa-input" placeholder="Aanya" />
        </Field>
        <Field label="Email">
          <input type="email" required value={form.email} onChange={update("email")} className="kayaa-input" placeholder="you@email.com" />
        </Field>
        <Field label="Subject">
          <input value={form.subject} onChange={update("subject")} className="kayaa-input" placeholder="A question about..." />
        </Field>
        <Field label="Message">
          <textarea required rows={5} value={form.message} onChange={update("message")} className="kayaa-input resize-none" placeholder="Tell us a little..." />
        </Field>

        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="btn-gradient btn-gradient-hover mt-3 w-full disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : status === "sent" ? "Message sent ✓" : "Send message"}
        </button>

        {status === "sent" && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            Thank you — we'll be in touch soon. 🌸
          </p>
        )}
        {status === "error" && (
          <p className="mt-4 text-center text-sm text-destructive">
            Something went wrong. Please try WhatsApp or email directly.
          </p>
        )}

        <style>{`
          .kayaa-input { width:100%; border:1px solid var(--border); background:var(--color-cream); padding:0.85rem 1rem; border-radius:0.75rem; font-size:0.9rem; outline:none; transition: border-color .2s; }
          .kayaa-input:focus { border-color: var(--color-pink); }
        `}</style>
      </form>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-[0.7rem] tracking-luxe uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
