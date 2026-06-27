export const BRAND = {
  name: "Jewels by Kayaa",
  tagline: "Delicate. Timeless. Yours.",
  phone: "919925183696",
  whatsapp: "https://wa.me/919925183696?text=Hi%20Kayaa%2C%20I%27d%20love%20to%20enquire%20about%20a%20piece.",
  instagram: "https://www.instagram.com/jewels_by_kayaa?igsh=M2FpdmszMnVweTc0",
  email: "hello@jewelsbykayaa.com",
};

/**
 * Generates a WhatsApp link with a rich pre-filled message.
 * Pass the full product object so we can include price, category, and a product URL.
 */
export const waLinkFor = ({
  name,
  price,
  category,
  id,
  variant,
}: {
  name: string;
  price: number;
  category: string;
  id: string;
  variant?: string;
}) => {
  const productUrl = `${window.location.origin}/product/${id}`;
  const finishLine = variant ? `Finish: ${variant}` : "";
  const priceFormatted = `₹${price.toLocaleString("en-IN")}`;

  const message = [
    `Hi Kayaa! 👋`,
    ``,
    `I'm interested in ordering this piece:`,
    `*${name}*`,
    `Category: ${category}`,
    finishLine,
    `Price: ${priceFormatted}`,
    ``,
    `Product link: ${productUrl}`,
    ``,
    `Could you please share more details on availability and delivery? Thank you! 🌸`,
  ]
    .filter((line) => line !== undefined)
    .join("\n");

  return `https://wa.me/${BRAND.phone}?text=${encodeURIComponent(message)}`;
};

export const igLinkFor = (_productName: string) =>
  `https://www.instagram.com/jewels_by_kayaa?igsh=M2FpdmszMnVweTc0`;
