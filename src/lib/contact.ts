import { supabase } from "./supabase";
import type { Database } from "./database.types";

export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  const { error } = await supabase.from("contact_submissions").insert(data);
  if (error) throw error;
}

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function markAsRead(id: string, read: boolean): Promise<void> {
  const { error } = await supabase
    .from("contact_submissions")
    .update({ read })
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSubmission(id: string): Promise<void> {
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
