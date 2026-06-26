import { Instagram } from "lucide-react";
import { BRAND } from "@/lib/brand";

export function FloatingContacts() {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 md:bottom-8 md:right-8">
      <a
        href={BRAND.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="DM on Instagram"
        className="grid h-12 w-12 place-items-center rounded-full bg-white text-foreground shadow-card transition-transform hover:-translate-y-0.5"
      >
        <Instagram size={20} />
      </a>
      <a
        href={BRAND.whatsapp}
        target="_blank"
        rel="noreferrer"
        aria-label="Order on WhatsApp"
        className="grid h-14 w-14 place-items-center rounded-full text-white shadow-soft transition-transform hover:-translate-y-0.5"
        style={{ backgroundImage: "var(--gradient-brand)" }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden>
          <path d="M20.52 3.48A11.78 11.78 0 0 0 12.02 0C5.4 0 .04 5.36.04 11.98c0 2.11.55 4.17 1.6 5.98L0 24l6.2-1.62a11.96 11.96 0 0 0 5.82 1.48h.01c6.62 0 11.98-5.36 11.98-11.98 0-3.2-1.25-6.21-3.49-8.4ZM12.02 21.8a9.83 9.83 0 0 1-5.01-1.37l-.36-.21-3.68.96.98-3.59-.23-.37a9.79 9.79 0 0 1-1.5-5.24c0-5.42 4.41-9.83 9.83-9.83 2.63 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 6.96c0 5.42-4.41 9.81-9.87 9.81Zm5.4-7.34c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15s-.77.96-.94 1.16c-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.21-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.22 1.35.19 1.86.12.57-.08 1.75-.71 2-1.4.25-.69.25-1.28.17-1.4-.07-.12-.27-.2-.57-.35Z"/>
        </svg>
      </a>
    </div>
  );
}
