import { supabase } from "./supabase";
import type { Database } from "./database.types";

export type Exhibition = Database["public"]["Tables"]["exhibitions"]["Row"];

export async function fetchExhibitions(): Promise<Exhibition[]> {
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchExhibition(id: string): Promise<Exhibition> {
  const { data, error } = await supabase
    .from("exhibitions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function upsertExhibition(
  exhibition: Database["public"]["Tables"]["exhibitions"]["Insert"],
): Promise<Exhibition> {
  const { data, error } = await supabase
    .from("exhibitions")
    .upsert(exhibition, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteExhibition(id: string): Promise<void> {
  const { error } = await supabase.from("exhibitions").delete().eq("id", id);
  if (error) throw error;
}
