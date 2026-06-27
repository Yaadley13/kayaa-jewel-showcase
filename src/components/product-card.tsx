import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const soldOut = !!product.isSoldOut;

  return (
    <div className={`group ${soldOut ? "opacity-75" : ""}`}>
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        {/* Image container */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f0eb]">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-700 ease-out ${soldOut ? "grayscale-[40%]" : "group-hover:scale-[1.04]"}`}
          />
          {product.imageAlt && !soldOut && (
            <img
              src={product.imageAlt}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}

          {/* Badges top-left */}
          <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
            {soldOut ? (
              <span className="rounded-full bg-[#2b2421] px-2.5 py-0.5 text-[0.58rem] font-medium tracking-wider uppercase text-white shadow-sm">
                Sold Out
              </span>
            ) : (
              <>
                {product.isNew && (
                  <span className="rounded-full bg-[#d64a86] px-2.5 py-0.5 text-[0.58rem] font-medium tracking-wider uppercase text-white shadow-sm">
                    New
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="rounded-full border border-[#2b2421] bg-white/90 px-2.5 py-0.5 text-[0.58rem] font-medium tracking-wider uppercase text-[#2b2421] shadow-sm">
                    Best Seller
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 px-0.5">
          <h3 className="font-serif text-[1.05rem] leading-snug text-[#2b2421] group-hover:text-[#d64a86] transition-colors">
            {product.name}
          </h3>
          <p className={`mt-1 text-[0.85rem] ${soldOut ? "text-[#b0a499] line-through" : "text-[#7a6f66]"}`}>
            {formatPrice(product.price)}
          </p>
          {soldOut && (
            <p className="mt-0.5 text-[0.75rem] text-[#9a8c82]">Currently unavailable</p>
          )}
        </div>
      </Link>
    </div>
  );
}
