export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          price: number;
          category: "Necklaces" | "Earrings" | "Rings" | "Bracelets" | "Anklets";
          description: string;
          tags: string[];
          image: string;
          image_alt: string | null;
          featured: boolean;
          is_new: boolean;
          is_best_seller: boolean;
          is_sold_out: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          price: number;
          category: "Necklaces" | "Earrings" | "Rings" | "Bracelets" | "Anklets";
          description: string;
          tags?: string[];
          image: string;
          image_alt?: string | null;
          featured?: boolean;
          is_new?: boolean;
          is_best_seller?: boolean;
          is_sold_out?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
