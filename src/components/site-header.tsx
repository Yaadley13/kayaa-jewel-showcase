import { Link } from "@tanstack/react-router";
import { Instagram, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/lib/brand";
import { SearchOverlay } from "@/components/search-overlay";

const WaIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62a11.96 11.96 0 0 0 5.82 1.48h.01c6.62 0 11.98-5.36 11.98-11.98 0-3.2-1.25-6.21-3.49-8.4ZM12.02 21.8a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.68.96.98-3.59-.23-.37a9.79 9.79 0 0 1-1.5-5.24c0-5.42 4.41-9.83 9.83-9.83 2.63 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 6.96c0 5.42-4.41 9.81-9.87 9.81Zm5.4-7.34c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z"/>
  </svg>
);

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/exhibitions", label: "Exhibitions" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#e8e0d5]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-10">
          {/* Brand */}
          <Link to="/" className="flex flex-col leading-none">
            <span className="font-serif text-[1.35rem] font-bold tracking-tight text-[#2b2421]">
              Jewels by Kayaa
            </span>
            <span className="text-[0.55rem] tracking-[0.22em] uppercase text-[#9a8c82] mt-1.5">
              Delicate&nbsp;&nbsp;·&nbsp;&nbsp;Timeless&nbsp;&nbsp;·&nbsp;&nbsp;Yours
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[0.78rem] tracking-wider uppercase text-[#5a5047] transition-colors hover:text-[#d64a86]"
                activeProps={{ className: "text-[#d64a86]" }}
                activeOptions={{ exact: n.to === "/" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-1">
            {/* Search — desktop & mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5a5047] transition-colors hover:bg-[#f5f0eb] hover:text-[#2b2421]"
            >
              <Search size={17} />
            </button>
            <a
              href={BRAND.instagram}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5a5047] transition-colors hover:bg-[#f5f0eb] hover:text-[#2b2421]"
            >
              <Instagram size={17} />
            </a>
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="hidden md:inline-flex h-9 w-9 items-center justify-center rounded-full text-[#5a5047] transition-colors hover:bg-[#f5f0eb] hover:text-[#2b2421]"
            >
              <WaIcon className="h-[17px] w-[17px]" />
            </a>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Menu"
              className="inline-flex md:hidden h-9 w-9 items-center justify-center rounded-full text-[#2b2421]"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="border-t border-[#e8e0d5] bg-white md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col px-6 py-4">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-[#f0ece6] py-3 text-[0.78rem] tracking-wider uppercase text-[#5a5047]"
                  activeProps={{ className: "text-[#d64a86]" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              ))}
              <div className="mt-4 flex gap-3 pt-2">
                <a href={BRAND.instagram} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-[#f5f0eb] text-[#5a5047]">
                  <Instagram size={17} />
                </a>
                <a href={BRAND.whatsapp} target="_blank" rel="noreferrer" className="h-10 w-10 grid place-items-center rounded-full bg-[#f5f0eb] text-[#5a5047]">
                  <WaIcon className="h-[17px] w-[17px]" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
