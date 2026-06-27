import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import { fetchExhibition } from "@/lib/exhibitions";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/exhibition/$id")({
  component: ExhibitionDetail,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-6 py-32 text-center">
      <h1 className="font-serif text-3xl">Exhibition not found</h1>
      <Link to="/exhibitions" className="mt-6 inline-flex btn-outline-luxe">Back to Exhibitions</Link>
    </div>
  ),
});

function ExhibitionDetail() {
  const { id } = Route.useParams();
  const { data: exhibition, isLoading } = useQuery({
    queryKey: ["exhibitions", id],
    queryFn: () => fetchExhibition(id),
    staleTime: 5 * 60 * 1000,
  });

  const [lightbox, setLightbox] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-20 md:px-10 animate-pulse space-y-6">
        <div className="aspect-[16/7] rounded-3xl bg-[#ede8e3]" />
        <div className="h-8 w-1/2 rounded-full bg-[#ede8e3]" />
        <div className="h-4 w-full rounded-full bg-[#ede8e3]" />
        <div className="h-4 w-3/4 rounded-full bg-[#ede8e3]" />
      </div>
    );
  }

  if (!exhibition) throw notFound();

  const allPhotos = [
    ...(exhibition.cover_image ? [exhibition.cover_image] : []),
    ...(exhibition.photos ?? []),
  ];

  return (
    <div className="bg-[#faf7f4] min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-12 md:px-10 md:py-16">

        {/* Back */}
        <Link
          to="/exhibitions"
          className="mb-8 inline-flex items-center gap-2 text-[0.72rem] uppercase tracking-wider text-[#9a8c82] hover:text-[#2b2421] transition-colors"
        >
          <ArrowLeft size={13} /> All Exhibitions
        </Link>

        {/* Cover image */}
        {exhibition.cover_image && (
          <div
            className="overflow-hidden rounded-3xl cursor-zoom-in"
            onClick={() => setLightbox(exhibition.cover_image)}
          >
            <img
              src={exhibition.cover_image}
              alt={exhibition.title}
              className="aspect-[16/9] w-full object-cover md:aspect-[16/7]"
            />
          </div>
        )}

        {/* Title + meta */}
        <div className="mt-8 md:mt-10">
          {exhibition.is_upcoming && (
            <span className="mb-3 inline-block rounded-full bg-[#d64a86] px-3 py-1 text-[0.6rem] font-medium uppercase tracking-wider text-white">
              Upcoming
            </span>
          )}
          <h1 className="font-serif text-4xl text-[#2b2421] md:text-5xl">{exhibition.title}</h1>

          <div className="mt-4 flex flex-wrap gap-5">
            {exhibition.date && (
              <p className="flex items-center gap-2 text-sm text-[#7a6f66]">
                <CalendarDays size={15} /> {exhibition.date}
              </p>
            )}
            {exhibition.location && (
              <p className="flex items-center gap-2 text-sm text-[#7a6f66]">
                <MapPin size={15} /> {exhibition.location}
              </p>
            )}
          </div>

          {exhibition.description && (
            <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-[#5a5047] whitespace-pre-wrap">
              {exhibition.description}
            </p>
          )}

          {exhibition.is_upcoming && (
            <a
              href={BRAND.whatsapp}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[0.75rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              Ask us about this exhibition
            </a>
          )}
        </div>

        {/* Photo gallery */}
        {exhibition.photos && exhibition.photos.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 font-serif text-2xl text-[#2b2421]">Gallery</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
              {exhibition.photos.map((photo, i) => (
                <button
                  key={i}
                  onClick={() => setLightbox(photo)}
                  className="overflow-hidden rounded-2xl bg-[#f5f0eb] cursor-zoom-in"
                >
                  <img
                    src={photo}
                    alt={`${exhibition.title} — photo ${i + 1}`}
                    className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox}
            alt=""
            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white/20 text-white hover:bg-white/30 text-xl"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
