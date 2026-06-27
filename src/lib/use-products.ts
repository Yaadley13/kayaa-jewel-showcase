import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProducts, upsertProduct, type Product } from "./products";

export const PRODUCTS_KEY = ["products"] as const;

/** Read all products from Supabase */
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: fetchProducts,
  });
}

/** Upsert (create or update) a product */
export function useUpsertProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

/** Delete a product by id */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
