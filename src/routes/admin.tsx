import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Loader2, Mail, MailOpen, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { CATEGORIES, formatPrice, type Product } from "@/lib/products";
import { useDeleteProduct, useProducts, useUpsertProduct } from "@/lib/use-products";
import { fetchContactSubmissions, markAsRead, deleteSubmission } from "@/lib/contact";
import { fetchExhibitions, upsertExhibition, deleteExhibition, type Exhibition } from "@/lib/exhibitions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Jewels by Kayaa" }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

function Admin() {
  const [tab, setTab] = useState<"products" | "exhibitions" | "contacts">("products");

  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-16">
      {/* Tab switcher */}
      <div className="mb-8 flex gap-2 border-b border-border/60">
        {(["products", "exhibitions", "contacts"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 px-1 text-[0.78rem] tracking-luxe uppercase transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-[color:var(--color-pink)] text-[#2b2421] font-medium"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "products" ? "Products" : t === "exhibitions" ? "Exhibitions" : "Messages"}
          </button>
        ))}
      </div>

      {tab === "products" ? <ProductsTab /> : tab === "exhibitions" ? <ExhibitionsTab /> : <ContactsTab />}
    </section>
  );
}

  const toggleFeatured = (p: Product) => upsert.mutate({ ...p, featured: !p.featured });

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

function ProductsTab() {
  const { data: products = [], isLoading, isError } = useProducts();
  const upsert = useUpsertProduct();
  const remove = useDeleteProduct();
  const [editing, setEditing] = useState<Product | null>(null);

  const handleDelete = (id: string) => {
    if (!confirm("Delete this piece?")) return;
    remove.mutate(id);
  };

  const handleSave = (p: Product) => {
    upsert.mutate(p, { onSuccess: () => setEditing(null) });
  };

  return (
    <>
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
    </>
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

function ContactsTab() {
  const queryClient = useQueryClient();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["contact_submissions"],
    queryFn: fetchContactSubmissions,
  });

  const toggleRead = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => markAsRead(id, read),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_submissions"] }),
  });

  const remove = useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["contact_submissions"] }),
  });

  const unread = submissions.filter((s) => !s.read).length;

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Inbox</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Contact Submissions</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {unread > 0 ? (
              <span className="font-medium text-[#d64a86]">{unread} unread</span>
            ) : "All caught up 🌸"}
          </p>
        </div>
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-card">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-16 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" /> Loading submissions…
          </div>
        )}

        {!isLoading && submissions.length === 0 && (
          <p className="p-10 text-center text-muted-foreground">No messages yet.</p>
        )}

        {!isLoading && submissions.length > 0 && (
          <ul className="divide-y divide-border/40">
            {submissions.map((s) => (
              <li key={s.id} className={`p-5 md:p-6 ${s.read ? "bg-white" : "bg-[#fdf8f5]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className={`mt-0.5 shrink-0 ${s.read ? "text-muted-foreground" : "text-[#d64a86]"}`}>
                      {s.read ? <MailOpen size={16} /> : <Mail size={16} />}
                    </span>
                    <div>
                      <p className={`text-sm font-medium ${s.read ? "text-foreground" : "text-[#2b2421]"}`}>
                        {s.name}
                        {!s.read && <span className="ml-2 inline-block rounded-full bg-[#d64a86] px-2 py-0.5 text-[0.6rem] text-white uppercase tracking-wider">New</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[0.7rem] text-muted-foreground">
                      {new Date(s.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <button
                      onClick={() => toggleRead.mutate({ id: s.id, read: !s.read })}
                      title={s.read ? "Mark unread" : "Mark read"}
                      className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {s.read ? <Mail size={13} /> : <MailOpen size={13} />}
                    </button>
                    <button
                      onClick={() => { if (confirm("Delete this message?")) remove.mutate(s.id); }}
                      className="grid h-8 w-8 place-items-center rounded-full bg-muted hover:bg-destructive hover:text-white transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {s.subject && (
                  <p className="mt-2 ml-7 text-xs font-medium text-[#5a5047]">Re: {s.subject}</p>
                )}
                <p className="mt-2 ml-7 text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">{s.message}</p>
                <a
                  href={`mailto:${s.email}?subject=Re: ${encodeURIComponent(s.subject ?? "Your message to Jewels by Kayaa")}`}
                  className="mt-3 ml-7 inline-flex items-center gap-1.5 text-[0.72rem] tracking-wider uppercase text-[#d64a86] hover:underline"
                >
                  <Mail size={12} /> Reply via email
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

// ─── Exhibitions Tab ──────────────────────────────────────────────────────────

const blankExhibition = (): Exhibition => ({
  id: crypto.randomUUID(),
  title: "",
  description: "",
  location: "",
  date: "",
  cover_image: "",
  photos: [],
  is_upcoming: false,
  created_at: new Date().toISOString(),
});

function ExhibitionsTab() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState<Exhibition | null>(null);

  const { data: exhibitions = [], isLoading } = useQuery({
    queryKey: ["exhibitions"],
    queryFn: fetchExhibitions,
  });

  const upsert = useMutation({
    mutationFn: upsertExhibition,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["exhibitions"] }); setEditing(null); },
  });

  const remove = useMutation({
    mutationFn: deleteExhibition,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["exhibitions"] }),
  });

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Events</p>
          <h1 className="mt-2 font-serif text-4xl md:text-5xl">Exhibitions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage your exhibition listings and photo galleries.</p>
        </div>
        <button onClick={() => setEditing(blankExhibition())} className="btn-gradient btn-gradient-hover">
          <Plus size={16} /> Add exhibition
        </button>
      </header>

      <div className="mt-10 overflow-hidden rounded-2xl bg-white shadow-card">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 p-16 text-muted-foreground">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        )}
        {!isLoading && exhibitions.length === 0 && (
          <p className="p-10 text-center text-muted-foreground">No exhibitions yet.</p>
        )}
        {!isLoading && exhibitions.length > 0 && (
          <div className="divide-y divide-border/40">
            {exhibitions.map((e) => (
              <div key={e.id} className="flex items-center gap-4 p-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {e.cover_image
                    ? <img src={e.cover_image} alt="" className="h-full w-full object-cover" />
                    : <div className="grid h-full w-full place-items-center text-muted-foreground"><ImagePlus size={18} /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-serif text-base truncate">{e.title}</p>
                  <p className="text-xs text-muted-foreground">{e.date}{e.location ? ` · ${e.location}` : ""}</p>
                  <p className="text-xs text-muted-foreground">{e.photos?.length ?? 0} gallery photos</p>
                </div>
                {e.is_upcoming && (
                  <span className="shrink-0 rounded-full bg-[#d64a86] px-2.5 py-0.5 text-[0.6rem] text-white uppercase tracking-wider">Upcoming</span>
                )}
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setEditing(e)} className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-secondary"><Pencil size={14} /></button>
                  <button
                    onClick={() => { if (confirm("Delete this exhibition?")) remove.mutate(e.id); }}
                    className="grid h-9 w-9 place-items-center rounded-full bg-muted hover:bg-destructive hover:text-white"
                  ><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <ExhibitionModal
          exhibition={editing}
          isSaving={upsert.isPending}
          onClose={() => setEditing(null)}
          onSave={(ex) => upsert.mutate(ex)}
        />
      )}
    </>
  );
}

function ExhibitionModal({
  exhibition,
  isSaving,
  onClose,
  onSave,
}: {
  exhibition: Exhibition;
  isSaving: boolean;
  onClose: () => void;
  onSave: (e: Exhibition) => void;
}) {
  const [draft, setDraft] = useState<Exhibition>(exhibition);
  const upd = <K extends keyof Exhibition>(k: K, v: Exhibition[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const readImage = (file: File, cb: (url: string) => void) => {
    const r = new FileReader();
    r.onload = () => cb(String(r.result));
    r.readAsDataURL(file);
  };

  const addPhotos = (files: FileList) => {
    Array.from(files).forEach((file) =>
      readImage(file, (url) => setDraft((d) => ({ ...d, photos: [...(d.photos ?? []), url] })))
    );
  };

  const removePhoto = (i: number) =>
    setDraft((d) => ({ ...d, photos: d.photos.filter((_, idx) => idx !== i) }));

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-7 shadow-soft md:p-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl">{exhibition.title ? "Edit exhibition" : "New exhibition"}</h2>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-muted"><X size={18} /></button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); onSave(draft); }} className="space-y-4">
          {/* Cover image */}
          <label className="block">
            <span className="mb-2 block text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Cover Image</span>
            <div className="overflow-hidden rounded-xl border border-dashed border-border bg-muted aspect-[16/7]">
              {draft.cover_image
                ? <img src={draft.cover_image} alt="" className="h-full w-full object-cover" />
                : <div className="grid h-full place-items-center text-xs text-muted-foreground">No cover image</div>}
            </div>
            <input type="file" accept="image/*"
              onChange={(e) => e.target.files?.[0] && readImage(e.target.files[0], (url) => upd("cover_image", url))}
              className="mt-2 w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--color-cream)] file:px-3 file:py-2 file:text-xs file:tracking-luxe file:uppercase" />
          </label>

          <EField label="Title"><input required value={draft.title} onChange={(e) => upd("title", e.target.value)} className="ki" /></EField>
          <div className="grid grid-cols-2 gap-3">
            <EField label="Date"><input value={draft.date ?? ""} onChange={(e) => upd("date", e.target.value)} placeholder="e.g. Dec 12–14, 2025" className="ki" /></EField>
            <EField label="Location"><input value={draft.location ?? ""} onChange={(e) => upd("location", e.target.value)} placeholder="City, Venue" className="ki" /></EField>
          </div>
          <EField label="Description"><textarea rows={4} value={draft.description} onChange={(e) => upd("description", e.target.value)} className="ki resize-none" /></EField>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={draft.is_upcoming} onChange={(e) => upd("is_upcoming", e.target.checked)} />
            Mark as Upcoming
          </label>

          {/* Gallery photos */}
          <div>
            <span className="mb-2 block text-[0.7rem] tracking-luxe uppercase text-muted-foreground">Gallery Photos</span>
            {(draft.photos ?? []).length > 0 && (
              <div className="mb-3 grid grid-cols-4 gap-2">
                {draft.photos.map((p, i) => (
                  <div key={i} className="relative group">
                    <img src={p} alt="" className="aspect-square w-full rounded-lg object-cover" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 hidden group-hover:grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white text-xs">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple
              onChange={(e) => e.target.files && addPhotos(e.target.files)}
              className="w-full text-xs text-muted-foreground file:mr-3 file:rounded-full file:border-0 file:bg-[color:var(--color-cream)] file:px-3 file:py-2 file:text-xs file:tracking-luxe file:uppercase" />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="btn-outline-luxe">Cancel</button>
            <button type="submit" disabled={isSaving} className="btn-gradient btn-gradient-hover disabled:opacity-60 flex items-center gap-2">
              {isSaving && <Loader2 size={14} className="animate-spin" />}
              Save exhibition
            </button>
          </div>
        </form>
        <style>{`.ki{width:100%;border:1px solid var(--border);background:var(--color-cream);padding:0.7rem 0.9rem;border-radius:0.6rem;font-size:0.9rem;outline:none}.ki:focus{border-color:var(--color-pink)}`}</style>
      </div>
    </div>
  );
}

function EField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.7rem] tracking-luxe uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
