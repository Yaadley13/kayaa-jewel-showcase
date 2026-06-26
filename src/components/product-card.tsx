import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/products";
import { waLinkFor } from "@/lib/brand";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group">
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-muted">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
          {product.imageAlt && (
            <img
              src={product.imageAlt}
              alt=""
              loading="lazy"
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[0.6rem] tracking-luxe uppercase text-foreground">
              New
            </span>
          )}
          <a
            href={waLinkFor(product.name)}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 rounded-full bg-white/95 px-4 py-2 text-[0.65rem] tracking-luxe uppercase opacity-0 shadow-card transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Enquire
          </a>
        </div>
        <div className="mt-3 flex items-baseline justify-between gap-3 px-1">
          <h3 className="truncate font-serif text-lg">{product.name}</h3>
          <span className="text-sm text-muted-foreground">{formatPrice(product.price)}</span>
        </div>
        <p className="px-1 text-[0.7rem] tracking-luxe uppercase text-muted-foreground">{product.category}</p>
      </Link>
    </div>
  );
}
