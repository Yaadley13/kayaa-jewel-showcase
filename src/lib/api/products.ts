/**
 * Server functions for product data fetching.
 * All Supabase access is server-side only — keeps the anon key off the wire
 * and avoids browser cold-start latency.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabase } from "./supabase-server";
import { rowToProduct, productToRow, seedProducts, type Product } from "../products";

// ─── Validators ───────────────────────────────────────────────────────────────

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  category: z.enum(["Necklaces", "Earrings", "Rings", "Bracelets", "Anklets"]),
  description: z.string(),
  tags: z.array(z.string()),
  image: z.string(),
  imageAlt: z.string().optional(),
  featured: z.boolean(),
  isNew: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isSoldOut: z.boolean().optional(),
});

const FetchPageSchema = z.object({
  page: z.number().int().min(0),
  category: z.string().optional(),
  maxPrice: z.number().optional(),
  sort: z.string().optional(),
  preFilter: z.enum(["featured", "bestseller", "new"]).nullable().optional(),
});

// ─── Read ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 16;

/** Fetch all products ordered by created_at (admin, product detail) */
export const apiFetchProducts = createServerFn({ method: "GET" })
  .handler(async (): Promise<Product[]> => {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data ?? []).map(rowToProduct);
  });

/**
 * Fetch the three home-page sections in a single round-trip.
 * Returns only up to 4 products per section — no over-fetching.
 */
export const apiFetchHomeProducts = createServerFn({ method: "GET" })
  .handler(async () => {
    const supabase = getSupabase();

    // Fire all three queries in parallel — one network round-trip each,
    // but they start at the same time so total wait ≈ slowest single query.
    const [featuredRes, bestsellersRes, newArrivalsRes] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("products")
        .select("*")
        .eq("is_best_seller", true)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("products")
        .select("*")
        .eq("is_new", true)
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    if (featuredRes.error) throw featuredRes.error;
    if (bestsellersRes.error) throw bestsellersRes.error;
    if (newArrivalsRes.error) throw newArrivalsRes.error;

    return {
      featured: (featuredRes.data ?? []).map(rowToProduct),
      bestSellers: (bestsellersRes.data ?? []).map(rowToProduct),
      newArrivals: (newArrivalsRes.data ?? []).map(rowToProduct),
    };
  });

/** Fetch a single product by id */
export const apiFetchProduct = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: id }): Promise<Product | null> => {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) throw error;
    return data ? rowToProduct(data) : null;
  });

/** Fetch related products (same category, excluding the current one) */
export const apiFetchRelatedProducts = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string(), category: z.string() }))
  .handler(async ({ data: { id, category } }): Promise<Product[]> => {
    const { data, error } = await getSupabase()
      .from("products")
      .select("*")
      .eq("category", category)
      .neq("id", id)
      .limit(4);

    if (error) throw error;
    return (data ?? []).map(rowToProduct);
  });

/** Paginated product listing with filters (shop page) */
export const apiFetchProductsPage = createServerFn({ method: "GET" })
  .validator(FetchPageSchema)
  .handler(async ({ data: params }) => {
    const { page, category, maxPrice, sort, preFilter } = params;
    const from = page * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = getSupabase().from("products").select("*", { count: "exact" });

    if (preFilter === "featured") query = query.eq("featured", true);
    if (preFilter === "bestseller") query = query.eq("is_best_seller", true);
    if (preFilter === "new") query = query.eq("is_new", true);

    if (category && category !== "All") query = query.eq("category", category);
    if (maxPrice) query = query.lte("price", maxPrice);

    if (sort === "price-asc") {
      query = query.order("price", { ascending: true });
    } else if (sort === "price-desc") {
      query = query.order("price", { ascending: false });
    } else if (sort === "new") {
      query = query
        .order("is_new", { ascending: false })
        .order("created_at", { ascending: false });
    } else {
      query = query
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw error;

    const total = count ?? 0;
    const products = (data ?? []).map(rowToProduct);

    return { products, total, hasMore: from + products.length < total };
  });

// ─── Write ────────────────────────────────────────────────────────────────────

/** Create or update a product (admin only) */
export const apiUpsertProduct = createServerFn({ method: "POST" })
  .validator(ProductSchema)
  .handler(async ({ data: product }): Promise<Product> => {
    const { data, error } = await getSupabase()
      .from("products")
      .upsert(productToRow(product), { onConflict: "id" })
      .select()
      .single();

    if (error) throw error;
    return rowToProduct(data);
  });

/** Delete a product by id (admin only) */
export const apiDeleteProduct = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: id }): Promise<void> => {
    const { error } = await getSupabase().from("products").delete().eq("id", id);
    if (error) throw error;
  });

/** Seed the DB with sample data if it's empty */
export const apiSeedIfEmpty = createServerFn({ method: "POST" })
  .handler(async (): Promise<void> => {
    const supabase = getSupabase();
    const { count, error } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    if ((count ?? 0) > 0) return;

    const rows = seedProducts.map((p) => productToRow({ ...p, image: "", imageAlt: "" }));
    const { error: insertError } = await supabase.from("products").insert(rows);
    if (insertError) throw insertError;
  });
