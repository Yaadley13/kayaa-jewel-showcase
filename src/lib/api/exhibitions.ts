/**
 * Server functions for exhibition data fetching.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabase } from "./supabase-server";
import type { Exhibition } from "../exhibitions";

const ExhibitionInsertSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string().optional().default(""),
  location: z.string().nullable().optional(),
  date: z.string().nullable().optional(),
  cover_image: z.string().optional().default(""),
  photos: z.array(z.string()).optional().default([]),
  is_upcoming: z.boolean().optional().default(false),
  created_at: z.string().optional(),
});

export const apiFetchExhibitions = createServerFn({ method: "GET" })
  .handler(async (): Promise<Exhibition[]> => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("exhibitions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const apiFetchExhibition = createServerFn({ method: "GET" })
  .validator(z.string())
  .handler(async ({ data: id }): Promise<Exhibition> => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("exhibitions")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  });

export const apiUpsertExhibition = createServerFn({ method: "POST" })
  .validator(ExhibitionInsertSchema)
  .handler(async ({ data: exhibition }): Promise<Exhibition> => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("exhibitions")
      .upsert(exhibition, { onConflict: "id" })
      .select()
      .single();
    if (error) throw error;
    return data;
  });

export const apiDeleteExhibition = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: id }): Promise<void> => {
    const supabase = getSupabase();
    const { error } = await supabase.from("exhibitions").delete().eq("id", id);
    if (error) throw error;
  });
