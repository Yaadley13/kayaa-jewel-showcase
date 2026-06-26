import { Link } from "@tanstack/react-router";
import { Instagram, Mail } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60 bg-[color:var(--color-cream)]">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-10">
        <div className="md:col-span-2">
          <h3 className="font-serif text-2xl">Jewels <span className="italic text-gradient">by</span> Kayaa</h3>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Delicate. Timeless. Yours. — A small studio crafting western jewellery for the woman who loves the quiet details.
          </p>
        </div>
        <div>
          <p className="mb-4 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Explore</p>
          <ul className="space-y-2 text-sm">
            <li><Link to="/shop" className="hover:text-foreground/80">Shop</Link></li>
            <li><Link to="/about" className="hover:text-foreground/80">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground/80">Contact</Link></li>
            <li><Link to="/admin" className="text-muted-foreground hover:text-foreground/80">Admin</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Reach us</p>
          <ul className="space-y-3 text-sm">
            <li><a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-2"><Mail size={14}/> {BRAND.email}</a></li>
            <li><a href={BRAND.instagram} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2"><Instagram size={14}/> @jewelsbykayaa</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Jewels by Kayaa. Made with care.
      </div>
    </footer>
  );
}
