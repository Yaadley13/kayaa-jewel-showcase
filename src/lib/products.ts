import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import ring from "@/assets/product-ring.jpg";
import bracelet from "@/assets/product-bracelet.jpg";
import type { Database } from "./database.types";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Necklaces" | "Earrings" | "Rings" | "Bracelets" | "Anklets";
  description: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  featured: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSoldOut?: boolean;
};

export const CATEGORIES: Product["category"][] = ["Necklaces", "Rings", "Earrings", "Bracelets", "Anklets"];

// Seed data used as fallback when DB is empty
export const seedProducts: Product[] = [
  { id: "p1", name: "Celestia Solitaire Ring", price: 4200, category: "Rings", description: "A delicate solitaire ring featuring a brilliant-cut stone set in fine gold-plated brass. Minimal, luminous, and made for everyday wear.", tags: ["bestseller","ring","gold"], image: ring, imageAlt: ring, featured: true, isNew: false, isBestSeller: true },
  { id: "p2", name: "Luna Chain Bracelet", price: 2800, category: "Bracelets", description: "A fine satellite chain bracelet with a subtle adjustable clasp. Light as air, pretty as moonlight.", tags: ["new","bracelet","chain"], image: bracelet, imageAlt: bracelet, featured: true, isNew: true, isBestSeller: false },
  { id: "p3", name: "Layered Rose Necklace Set", price: 6800, category: "Necklaces", description: "A two-piece layering set — a delicate rose-quartz pendant paired with a fine gold link chain. Wear together or separate.", tags: ["new","bestseller","necklace","layered"], image: necklace, imageAlt: necklace, featured: true, isNew: true, isBestSeller: true },
  { id: "p4", name: "Charm Anklet", price: 2200, category: "Anklets", description: "A dainty gold anklet adorned with tiny charm pendants. Perfect for bare feet and warm evenings.", tags: ["new","anklet","charm"], image: bracelet, imageAlt: bracelet, featured: true, isNew: true, isBestSeller: false },
  { id: "p5", name: "Aurora Hoop Earrings", price: 3500, category: "Earrings", description: "Medium-sized seamless gold hoops with a mirror polish finish. The pair you'll reach for every single day.", tags: ["bestseller","hoops","earrings"], image: earrings, imageAlt: earrings, featured: false, isNew: false, isBestSeller: true },
  { id: "p6", name: "Pearl Stud Earrings", price: 1800, category: "Earrings", description: "Lustrous freshwater pearl studs set in gold-plated posts. Classic, quiet, always right.", tags: ["bestseller","pearl","earrings"], image: earrings, imageAlt: earrings, featured: false, isNew: false, isBestSeller: true },
  { id: "p7", name: "Stacking Ring Set", price: 5400, category: "Rings", description: "Three slim bands designed to stack — wear as a set or mix with your own. Minimalist perfection.", tags: ["bestseller","rings","stack"], image: ring, imageAlt: ring, featured: false, isNew: false, isBestSeller: true },
  { id: "p8", name: "Moonstone Pendant", price: 3900, category: "Necklaces", description: "A glowing oval moonstone set in a simple gold bezel on a delicate chain. Ethereal and understated.", tags: ["new","necklace","pendant","moonstone"], image: necklace, imageAlt: necklace, featured: false, isNew: true, isBestSeller: false },
];

// ─── DB row ↔ Product mappers ────────────────────────────────────────────────

type DbRow = Database["public"]["Tables"]["products"]["Row"];

export function rowToProduct(row: DbRow): Product {
  return {
    id: row.id,
    name: row.name,
    price: row.price,
    category: row.category,
    description: row.description,
    tags: row.tags ?? [],
    image: row.image,
    imageAlt: row.image_alt ?? undefined,
    featured: row.featured,
    isNew: row.is_new,
    isBestSeller: row.is_best_seller,
    isSoldOut: row.is_sold_out,
  };
}

export function productToRow(p: Product): Database["public"]["Tables"]["products"]["Insert"] {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category,
    description: p.description,
    tags: p.tags,
    image: p.image,
    image_alt: p.imageAlt ?? null,
    featured: p.featured,
    is_new: p.isNew ?? false,
    is_best_seller: p.isBestSeller ?? false,
    is_sold_out: p.isSoldOut ?? false,
  };
}

// ─── API (server functions) ───────────────────────────────────────────────────
// All Supabase access is now server-side via createServerFn — no direct DB
// calls from the browser. Import here to keep a single call-site for consumers.

import {
  apiFetchProducts,
  apiFetchHomeProducts,
  apiFetchProduct,
  apiFetchRelatedProducts,
  apiFetchProductsPage,
  apiUpsertProduct,
  apiDeleteProduct,
  apiSeedIfEmpty,
} from "./api/products";

export type ProductsPage = {
  products: Product[];
  total: number;
  hasMore: boolean;
};

export type HomeProducts = {
  featured: Product[];
  bestSellers: Product[];
  newArrivals: Product[];
};

export async function fetchProducts(): Promise<Product[]> {
  return apiFetchProducts();
}

export async function fetchHomeProducts(): Promise<HomeProducts> {
  return apiFetchHomeProducts();
}

export async function fetchProduct(id: string): Promise<Product | null> {
  return apiFetchProduct({ data: id });
}

export async function fetchRelatedProducts(id: string, category: string): Promise<Product[]> {
  return apiFetchRelatedProducts({ data: { id, category } });
}

export async function fetchProductsPage(
  page: number,
  filters: {
    category?: string;
    maxPrice?: number;
    sort?: string;
    preFilter?: "featured" | "bestseller" | "new" | null;
  } = {},
): Promise<ProductsPage> {
  return apiFetchProductsPage({
    data: {
      page,
      category: filters.category,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      preFilter: filters.preFilter ?? null,
    },
  });
}

export async function upsertProduct(product: Product): Promise<Product> {
  return apiUpsertProduct({ data: product });
}

export async function deleteProduct(id: string): Promise<void> {
  return apiDeleteProduct({ data: id });
}

export async function seedIfEmpty(): Promise<void> {
  return apiSeedIfEmpty();
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
