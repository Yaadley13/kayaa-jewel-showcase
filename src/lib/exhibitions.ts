/**
 * Exhibition data helpers — all DB access goes through server functions.
 */
import type { Database } from "./database.types";
import {
  apiFetchExhibitions,
  apiFetchExhibition,
  apiUpsertExhibition,
  apiDeleteExhibition,
} from "./api/exhibitions";

export type Exhibition = Database["public"]["Tables"]["exhibitions"]["Row"];

export async function fetchExhibitions(): Promise<Exhibition[]> {
  return apiFetchExhibitions();
}

export async function fetchExhibition(id: string): Promise<Exhibition> {
  return apiFetchExhibition({ data: id });
}

export async function upsertExhibition(
  exhibition: Database["public"]["Tables"]["exhibitions"]["Insert"],
): Promise<Exhibition> {
  return apiUpsertExhibition({ data: exhibition });
}

export async function deleteExhibition(id: string): Promise<void> {
  return apiDeleteExhibition({ data: id });
}
