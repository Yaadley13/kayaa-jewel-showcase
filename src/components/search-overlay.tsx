import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useProducts } from "@/lib/use-products";
import { formatPrice } from "@/lib/products";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { data: products = [] } = useProducts();

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const results = q.length < 2 ? [] : products.filter((p) =>
    p.name.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.tags.some((t) => t.toLowerCase().includes(q))
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-white/95 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      {/* Search bar */}
      <div className="border-b border-[#e8e0d5]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4 md:px-10">
          <Search size={20} className="shrink-0 text-[#9a8c82]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pieces, categories, tags…"
            className="flex-1 bg-transparent text-lg text-[#2b2421] outline-none placeholder:text-[#c4b8ae]"
          />
          <button
            onClick={onClose}
            aria-label="Close search"
            className="shrink-0 rounded-full p-1.5 text-[#9a8c82] transition-colors hover:bg-[#f5f0eb] hover:text-[#2b2421]"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-6 py-6 md:px-10">

          {/* Idle state */}
          {q.length < 2 && (
            <p className="text-center text-sm text-[#9a8c82] mt-12">
              Start typing to search the collection…
            </p>
          )}

          {/* No results */}
          {q.length >= 2 && results.length === 0 && (
            <p className="text-center text-sm text-[#9a8c82] mt-12">
              No pieces found for "<span className="text-[#2b2421]">{query}</span>"
            </p>
          )}

          {/* Results list */}
          {results.length > 0 && (
            <>
              <p className="mb-4 text-[0.7rem] tracking-widest uppercase text-[#9a8c82]">
                {results.length} {results.length === 1 ? "piece" : "pieces"} found
              </p>
              <ul className="divide-y divide-[#f0ece6]">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to="/product/$id"
                      params={{ id: p.id }}
                      onClick={onClose}
                      className="flex items-center gap-4 py-4 transition-colors hover:text-[#d64a86]"
                    >
                      {/* Thumbnail */}
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#f5f0eb]">
                        {p.image
                          ? <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                          : <div className="h-full w-full" />}
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1">
                        <p className="font-serif text-[1.05rem] text-[#2b2421] leading-snug truncate">
                          {p.name}
                        </p>
                        <p className="mt-0.5 text-xs text-[#9a8c82]">{p.category}</p>
                      </div>

                      {/* Price */}
                      <p className="shrink-0 text-sm font-medium text-[#2b2421]">
                        {formatPrice(p.price)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
