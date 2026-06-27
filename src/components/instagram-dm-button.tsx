import { useState } from "react";
import { Check, Copy, Instagram, X } from "lucide-react";
import { igLinkFor } from "@/lib/brand";

interface Props {
  productName: string;
  productPrice: number;
  productCategory: string;
  productId: string;
  variant?: string;
  className?: string;
}

export function InstagramDmButton({
  productName,
  productPrice,
  productCategory,
  productId,
  variant,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = `${window.location.origin}/product/${productId}`;
  const priceFormatted = `₹${productPrice.toLocaleString("en-IN")}`;
  const finishLine = variant ? `Finish: ${variant}` : "";

  const dmMessage = [
    `Hi Kayaa! 👋`,
    ``,
    `I'm interested in this piece:`,
    `${productName}`,
    `Category: ${productCategory}`,
    finishLine,
    `Price: ${priceFormatted}`,
    ``,
    `Product link: ${productUrl}`,
    ``,
    `Could you share more details on availability? 🌸`,
  ]
    .filter((l) => l !== undefined)
    .join("\n");

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(true);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(dmMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenInstagram = () => {
    window.open(igLinkFor(productName), "_blank", "noreferrer");
    setOpen(false);
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleClick}
        className={className}
      >
        <Instagram size={16} /> DM on Instagram
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-7 shadow-soft"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white">
                  <Instagram size={16} />
                </span>
                <p className="font-serif text-lg text-[#2b2421]">DM on Instagram</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-1.5 hover:bg-muted"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <p className="mb-3 text-sm text-[#7a6f66]">
              Copy this message, then paste it in your DM to{" "}
              <span className="font-medium text-[#2b2421]">@jewels_by_kayaa</span>.
            </p>

            {/* Message preview */}
            <div className="rounded-2xl border border-[#e8e0d5] bg-[#faf7f4] p-4 text-sm leading-relaxed whitespace-pre-wrap text-[#5a5047]">
              {dmMessage}
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-3">
              <button
                onClick={handleCopy}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-[#2b2421] py-2.5 text-[0.75rem] tracking-wider uppercase text-[#2b2421] transition-colors hover:bg-[#2b2421] hover:text-white"
              >
                {copied ? (
                  <>
                    <Check size={14} className="text-green-500" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={14} /> Copy Message
                  </>
                )}
              </button>

              <button
                onClick={handleOpenInstagram}
                className="flex w-full items-center justify-center gap-2 rounded-full py-2.5 text-[0.75rem] tracking-wider uppercase text-white transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, #f9ce34 0%, #ee2a7b 50%, #6228d7 100%)",
                }}
              >
                <Instagram size={14} /> Open Instagram
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
