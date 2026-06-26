import necklace from "@/assets/product-necklace.jpg";
import earrings from "@/assets/product-earrings.jpg";
import ring from "@/assets/product-ring.jpg";
import bracelet from "@/assets/product-bracelet.jpg";

export type Product = {
  id: string;
  name: string;
  price: number;
  category: "Necklaces" | "Earrings" | "Rings" | "Bracelets";
  description: string;
  tags: string[];
  image: string;
  imageAlt?: string;
  featured: boolean;
  isNew?: boolean;
};

export const CATEGORIES: Product["category"][] = ["Necklaces", "Earrings", "Rings", "Bracelets"];

export const seedProducts: Product[] = [
  { id: "p1", name: "Pearl Whisper Necklace", price: 2890, category: "Necklaces", description: "A single freshwater pearl suspended on a fine gold-plated chain. Effortless for everyday, beautiful for forever.", tags: ["bestseller","gold","pearl"], image: necklace, imageAlt: necklace, featured: true, isNew: false },
  { id: "p2", name: "Solene Gold Hoops", price: 1990, category: "Earrings", description: "Featherweight medium hoops crafted in 18k gold-plated brass. The pair you'll reach for every day.", tags: ["bestseller","hoops"], image: earrings, imageAlt: earrings, featured: true, isNew: true },
  { id: "p3", name: "Halo Stacking Ring", price: 1490, category: "Rings", description: "A slim, perfectly polished band designed to stack — wear alone for restraint, layer for impact.", tags: ["minimal","stack"], image: ring, imageAlt: ring, featured: false, isNew: true },
  { id: "p4", name: "Lune Charm Bracelet", price: 2290, category: "Bracelets", description: "A satellite chain finished with a hand-engraved heart charm. Adjustable for the perfect fit.", tags: ["new","charm"], image: bracelet, imageAlt: bracelet, featured: true, isNew: true },
  { id: "p5", name: "Mira Layering Chain", price: 2490, category: "Necklaces", description: "A weightless rope chain designed to layer with your favourites.", tags: ["layering"], image: necklace, imageAlt: necklace, featured: false, isNew: false },
  { id: "p6", name: "Petite Pearl Studs", price: 1290, category: "Earrings", description: "Tiny freshwater pearl studs — quiet, classic, always right.", tags: ["pearl","minimal"], image: earrings, imageAlt: earrings, featured: false, isNew: false },
  { id: "p7", name: "Aura Signet Ring", price: 2190, category: "Rings", description: "A modern take on the signet — smooth, sculptural, weighty.", tags: ["statement"], image: ring, imageAlt: ring, featured: true, isNew: false },
  { id: "p8", name: "Soleil Anklet", price: 1690, category: "Bracelets", description: "A delicate beaded anklet for warm evenings and bare feet.", tags: ["summer"], image: bracelet, imageAlt: bracelet, featured: false, isNew: false },
];

const STORAGE_KEY = "kayaa.products.v1";

export function loadProducts(): Product[] {
  if (typeof window === "undefined") return seedProducts;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedProducts;
    const parsed = JSON.parse(raw) as Product[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedProducts;
    return parsed;
  } catch {
    return seedProducts;
  }
}

export function saveProducts(products: Product[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  window.dispatchEvent(new Event("kayaa:products"));
}

export function formatPrice(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}
