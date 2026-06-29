import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { fetchExhibitions, type Exhibition } from "@/lib/exhibitions";

export const Route = createFileRoute("/exhibitions")({
  loader: ({ context: { queryClient } }) => {
    void queryClient.prefetchQuery({
      queryKey: ["exhibitions"],
      queryFn: fetchExhibitions,
      staleTime: 5 * 60 * 1000,
    });
  },
  head: () => ({
    meta: [
      { title: "Exhibitions — Jewels by Kayaa" },
      { name: "description", content: "Visit Jewels by Kayaa at exhibitions and pop-up events across India." },
    ],
  }),
  component: Exhibitions,
});

function Exhibitions() {
  const { data: exhibitions = [], isLoading } = useQuery({
    queryKey: ["exhibitions"],
    queryFn: fetchExhibitions,
    staleTime: 5 * 60 * 1000,
  });

  const upcoming = exhibitions.filter((e) => e.is_upcoming);
  const past = exhibitions.filter((e) => !e.is_upcoming);

  return (
    <div className="bg-[#faf7f4] min-h-screen">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-12 text-center md:px-10 md:pt-24">
        <p className="text-[0.65rem] tracking-[0.22em] uppercase text-[#d64a86] font-medium">Find us in person</p>
        <h1 className="mt-3 font-serif text-[2.6rem] text-[#2b2421] md:text-[3.2rem]">Exhibitions</h1>
        <p className="mt-4 mx-auto max-w-md text-sm leading-relaxed text-[#7a6f66]">
          Come see the pieces in person — touch the delicate chains, feel the weight of a pendant, try on that ring.
        </p>
      </div>

      {isLoading && (
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-white overflow-hidden">
                <div className="aspect-[4/3] bg-[#ede8e3]" />
                <div className="p-6 space-y-3">
                  <div className="h-5 w-2/3 rounded-full bg-[#ede8e3]" />
                  <div className="h-3 w-1/2 rounded-full bg-[#ede8e3]" />
                  <div className="h-3 w-3/4 rounded-full bg-[#ede8e3]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!isLoading && exhibitions.length === 0 && (
        <div className="mx-auto max-w-xl px-6 py-16 text-center md:px-10">
          <p className="text-[#9a8c82]">No exhibitions yet — follow us on Instagram to stay updated. 🌸</p>
        </div>
      )}

      {/* Upcoming */}
      {!isLoading && upcoming.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-16 md:px-10">
          <h2 className="mb-8 font-serif text-2xl text-[#2b2421]">
            <span className="mr-2 inline-block rounded-full bg-[#d64a86] px-3 py-0.5 text-[0.6rem] text-white uppercase tracking-wider align-middle">Upcoming</span>
            Coming Up
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e) => <ExhibitionCard key={e.id} exhibition={e} />)}
          </div>
        </section>
      )}

      {/* Past */}
      {!isLoading && past.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 pb-20 md:px-10">
          {upcoming.length > 0 && (
            <h2 className="mb-8 font-serif text-2xl text-[#2b2421]">Past Exhibitions</h2>
          )}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {past.map((e) => <ExhibitionCard key={e.id} exhibition={e} />)}
          </div>
        </section>
      )}
    </div>
  );
}

function ExhibitionCard({ exhibition: e }: { exhibition: Exhibition }) {
  return (
    <Link
      to="/exhibition/$id"
      params={{ id: e.id }}
      className="group block overflow-hidden rounded-3xl bg-white shadow-card transition-shadow hover:shadow-soft"
    >
      {/* Cover image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f0eb]">
        {e.cover_image ? (
          <img
            src={e.cover_image}
            alt={e.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="h-full w-full grid place-items-center text-[#c4b8ae] text-sm">No image</div>
        )}
        {e.is_upcoming && (
          <span className="absolute top-3 left-3 rounded-full bg-[#d64a86] px-3 py-1 text-[0.6rem] font-medium uppercase tracking-wider text-white">
            Upcoming
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-6">
        <h3 className="font-serif text-xl text-[#2b2421] group-hover:text-[#d64a86] transition-colors">
          {e.title}
        </h3>
        <div className="mt-3 space-y-1.5">
          {e.date && (
            <p className="flex items-center gap-2 text-xs text-[#9a8c82]">
              <CalendarDays size={13} /> {e.date}
            </p>
          )}
          {e.location && (
            <p className="flex items-center gap-2 text-xs text-[#9a8c82]">
              <MapPin size={13} /> {e.location}
            </p>
          )}
        </div>
        {e.description && (
          <p className="mt-3 text-sm leading-relaxed text-[#7a6f66] line-clamp-2">{e.description}</p>
        )}
        <p className="mt-4 flex items-center gap-1.5 text-[0.72rem] uppercase tracking-wider text-[#d64a86] font-medium">
          View details <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
        </p>
      </div>
    </Link>
  );
}
