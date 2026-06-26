import { useEffect, useState } from "react";
import { loadProducts, type Product } from "./products";

export function useProducts(): [Product[], (next: Product[]) => void] {
  const [products, setProducts] = useState<Product[]>(() => loadProducts());

  useEffect(() => {
    setProducts(loadProducts());
    const onChange = () => setProducts(loadProducts());
    window.addEventListener("kayaa:products", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("kayaa:products", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);

  return [products, setProducts];
}
