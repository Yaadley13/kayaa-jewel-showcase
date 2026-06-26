export const BRAND = {
  name: "Jewels by Kayaa",
  tagline: "Delicate. Timeless. Yours.",
  whatsapp: "https://wa.me/919999999999?text=Hi%20Kayaa%2C%20I%27d%20love%20to%20enquire%20about%20a%20piece.",
  instagram: "https://instagram.com/jewelsbykayaa",
  email: "hello@jewelsbykayaa.com",
};

export const waLinkFor = (productName: string) =>
  `https://wa.me/919999999999?text=${encodeURIComponent(`Hi Kayaa, I'd love to order: ${productName}`)}`;

export const igLinkFor = (productName: string) =>
  `https://instagram.com/jewelsbykayaa?text=${encodeURIComponent(productName)}`;
