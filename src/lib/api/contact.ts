/**
 * Server functions for contact submissions.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSupabase } from "./supabase-server";
import type { ContactSubmission } from "../contact";

const SubmitContactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string(),
  message: z.string().min(1),
});

const MarkAsReadSchema = z.object({
  id: z.string(),
  read: z.boolean(),
});

export const apiSubmitContactForm = createServerFn({ method: "POST" })
  .validator(SubmitContactSchema)
  .handler(async ({ data }): Promise<void> => {
    const supabase = getSupabase();
    const { error } = await supabase.from("contact_submissions").insert(data);
    if (error) throw error;
  });

export const apiFetchContactSubmissions = createServerFn({ method: "GET" })
  .handler(async (): Promise<ContactSubmission[]> => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data ?? [];
  });

export const apiMarkAsRead = createServerFn({ method: "POST" })
  .validator(MarkAsReadSchema)
  .handler(async ({ data: { id, read } }): Promise<void> => {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("contact_submissions")
      .update({ read })
      .eq("id", id);
    if (error) throw error;
  });

export const apiDeleteSubmission = createServerFn({ method: "POST" })
  .validator(z.string())
  .handler(async ({ data: id }): Promise<void> => {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("contact_submissions")
      .delete()
      .eq("id", id);
    if (error) throw error;
  });
