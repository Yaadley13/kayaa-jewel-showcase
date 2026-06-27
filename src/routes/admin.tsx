import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { CATEGORIES, formatPrice, type Product } from "@/lib/products";
import { useDeleteProduct, useProducts, useUpsertProduct } from "@/lib/use-products";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Jewels by Kayaa" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const blank = (): Product => ({
  id: crypto.randomUUID(),
  name: "",
  price: 0,
  category: "Necklaces",
  description: "",
  tags: [],
  image: "",
  featured: false,
  isNew: true,
  isBestSeller: false,
});

function Admin() {
  const { data: products = [], isLoading, isError } = useProducts();
  const upsert = useUpsertProduct();
  const remove = useDeleteProduct();
  const [editing, setEditing] = useState<Product | null>(null);

  const toggleFeatured = (p: Product) => upsert.mutate({ ...p, featured: !p.featured });

  const handleDelete = (id: string) => {
    if (!confirm("Delete this piece?")) return;
    remove.mutate(id);
  };

  const handleSave = (p: Product) => {
    upsert.mutate(p, { onSuccess: () => setEditing(null) });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Studio</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Product Management</h1>
          <p className="mt-2 max-w-lg text-sm text-muted-foreground">Add, edit, and curate the pieces shown on the storefront.</p>
        </div>
        <button onClick={() => setEditing(blank())} className="btn-gradient btn-gradient-hover">
          <Plus size={16}/> Add product
        </button>
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-card">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-16 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" /> Loading products…
          </div>
        )}

        {isError && (
          <div className="p-10 text-center text-destructive text-sm">
            Failed to load products. Check your Supabase connection.
          </div>
        )}

        {!isLoading && !isError && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="border-b border-border/60 bg-[color:var(--color-cream)]">
                <tr className="text-left text-[0.7rem] tracking-luxe uppercase text-muted-foreground">
                  <th className="p-4">Image</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4 text-center">Featured</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-border/40 last:border-0">
                    <td className="p-3">
                      {p.image
                        ? <img src={p.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                        : <div className="grid h-14 w-14 place-items-center rounded-lg bg-muted text-xs text-muted-foreground">—</div>}
                    </td>
                    <td className="p-4 font-serif text-base">{p.name}</td>
                    <td className="p-4 text-muted-foreground">{p.category}</td>
                    <td className="p-4">{formatPrice(p.price)}</td>
                    <td className="p-4 text-xs text-muted-foreground">{p.tags.join(", ") || "—"}</td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => toggleFeatured(p)}
                        disabled={upsert.isPending}
                        aria-label="Toggle featured"
                        className={`grid h-9 w-9 place-items-center rounded-full transition-colors disabled:opacity-50 ${p.featured ? "bg-[color:var(--color-pink)] text-white" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
                        <Star size={15} fill={p.featured ? "currentColor" : "none"} />
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditing(p)} className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-secondary"><Pencil size={14}/></button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={remove.isPending}
                          className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-destructive hover:text-white disabled:opacity-50">
                          <Trash2 size={14}/>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr><td colSpan={7} className="p-10 text-center text-muted-foreground">No products yet. Add your first piece.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <EditorModal
          product={editing}
          isSaving={upsert.isPending}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </section>
  );
}

function EditorModal({
  product,
  isSaving,
  onClose,
  onSave,
}: {
  product: Product;
  isSaving: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
}) {
  const [draft, setDraft] = useState<Product>(product);
  const update = <K extends keyof Product>(k: K, v: Product[K]) => setDraft(d => ({ ...d, [k]: v }));

  const onImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => update("image", String(reader.result));
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-soft md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{product.name ? "Edit piece" : "New piece"}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted"><X size={18}/></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(draft); }} className="space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[160px_1fr]">
            <label className="block">
              <span className="mb-2 block text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Image</span>
              <div className="grid aspect-square place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-muted">
                {draft.image
                  ? <img src={draft.image} alt="" className="h-full w-full object-cover" />
                  : <span className="px-2 text-center text-xs text-muted-foreground">No image</span>}
              </div>
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && onImage(e.target.files[0])}
                className="mt-2 w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--color-cream)] file:px-3 file:py-2 file:text-xs file:tracking-luxe file:uppercase" />
            </label>
            <div className="space-y-3">
              <Field label="Name"><input required value={draft.name} onChange={(e) => update("name", e.target.value)} className="ki" /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Price (₹)"><input type="number" required min={0} value={draft.price} onChange={(e) => update("price", Number(e.target.value))} className="ki" /></Field>
                <Field label="Category">
                  <select value={draft.category} onChange={(e) => update("category", e.target.value as Product["category"])} className="ki">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Field>
              </div>
            </div>
          </div>

          <Field label="Description"><textarea rows={4} value={draft.description} onChange={(e) => update("description", e.target.value)} className="ki resize-none" /></Field>
          <Field label="Tags (comma separated)">
            <input value={draft.tags.join(", ")} onChange={(e) => update("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))} className="ki" />
          </Field>

          <div className="flex flex-wrap gap-5 pt-2 text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={draft.featured} onChange={(e) => update("featured", e.target.checked)} /> Featured
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!draft.isNew} onChange={(e) => update("isNew", e.target.checked)} /> New arrival
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!draft.isBestSeller} onChange={(e) => update("isBestSeller", e.target.checked)} /> Best Seller
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={!!draft.isSoldOut} onChange={(e) => update("isSoldOut", e.target.checked)} /> Sold Out
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline-luxe">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-gradient btn-gradient-hover disabled:opacity-60 flex items-center gap-2">
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save piece
            </button>
          </div>
        </form>

        <style>{`.ki{width:100%;border:1px solid var(--border);background:var(--color-cream);padding:0.7rem 0.9rem;border-radius:0.6rem;font-size:0.9rem;outline:none}.ki:focus{border-color:var(--color-pink)}`}</style>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] tracking-luxe uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
