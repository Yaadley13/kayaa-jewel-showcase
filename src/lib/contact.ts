/**
 * Contact form helpers — all DB access goes through server functions.
 */
import type { Database } from "./database.types";
import {
  apiSubmitContactForm,
  apiFetchContactSubmissions,
  apiMarkAsRead,
  apiDeleteSubmission,
} from "./api/contact";

export type ContactSubmission = Database["public"]["Tables"]["contact_submissions"]["Row"];

export async function submitContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  return apiSubmitContactForm({ data });
}

export async function fetchContactSubmissions(): Promise<ContactSubmission[]> {
  return apiFetchContactSubmissions();
}

export async function markAsRead(id: string, read: boolean): Promise<void> {
  return apiMarkAsRead({ data: { id, read } });
}

export async function deleteSubmission(id: string): Promise<void> {
  return apiDeleteSubmission({ data: id });
}
