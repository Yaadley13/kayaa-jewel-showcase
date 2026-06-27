import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import ring from "@/assets/product-ring.jpg";
import bracelet from "@/assets/product-bracelet.jpg";
import { supabase } from "./supabase";
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

// ─── Supabase CRUD ────────────────────────────────────────────────────────────

const PAGE_SIZE = 16;

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(rowToProduct);
}

export type ProductsPage = {
  products: Product[];
  total: number;
  hasMore: boolean;
};

export async function fetchProductsPage(
  page: number,
  filters: {
    category?: string;
    maxPrice?: number;
    sort?: string;
    preFilter?: "featured" | "bestseller" | "new" | null;
  } = {},
): Promise<ProductsPage> {
  const from = page * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("products")
    .select("*", { count: "exact" });

  // Pre-filters from home sections
  if (filters.preFilter === "featured") query = query.eq("featured", true);
  if (filters.preFilter === "bestseller") query = query.eq("is_best_seller", true);
  if (filters.preFilter === "new") query = query.eq("is_new", true);

  // Category
  if (filters.category && filters.category !== "All") {
    query = query.eq("category", filters.category);
  }

  // Price
  if (filters.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }

  // Sort
  if (filters.sort === "price-asc") {
    query = query.order("price", { ascending: true });
  } else if (filters.sort === "price-desc") {
    query = query.order("price", { ascending: false });
  } else if (filters.sort === "new") {
    query = query.order("is_new", { ascending: false }).order("created_at", { ascending: false });
  } else {
    // default: featured first
    query = query.order("featured", { ascending: false }).order("created_at", { ascending: false });
  }

  const { data, error, count } = await query.range(from, to);

  if (error) throw error;

  const total = count ?? 0;
  const products = (data ?? []).map(rowToProduct);

  return {
    products,
    total,
    hasMore: from + products.length < total,
  };
}

export async function upsertProduct(product: Product): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .upsert(productToRow(product), { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  return rowToProduct(data);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function seedIfEmpty(): Promise<void> {
  const { count, error } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  if (error) throw error;
  if ((count ?? 0) > 0) return;

  // Strip local asset imports — use empty string as placeholder image when seeding
  const rows = seedProducts.map((p) => productToRow({ ...p, image: "", imageAlt: "" }));
  const { error: insertError } = await supabase.from("products").insert(rows);
  if (insertError) throw insertError;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
