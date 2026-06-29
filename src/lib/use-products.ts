import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProduct,
  fetchHomeProducts,
  fetchProducts,
  upsertProduct,
  type Product,
} from "./products";

export const PRODUCTS_KEY = ["products"] as const;
export const HOME_PRODUCTS_KEY = ["home-products"] as const;

/** Fetch only the 3 home sections (featured/bestsellers/new arrivals) — 3 parallel DB queries, no over-fetching */
export function useHomeProducts() {
  return useQuery({
    queryKey: HOME_PRODUCTS_KEY,
    queryFn: fetchHomeProducts,
  });
}

/** Fetch all products (admin, product detail lookup) */
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: HOME_PRODUCTS_KEY });
    },
  });
}

/** Delete a product by id */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_KEY });
      queryClient.invalidateQueries({ queryKey: HOME_PRODUCTS_KEY });
    },
  });
}
