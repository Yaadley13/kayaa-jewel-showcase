/**
 * Converts any image file (including HEIC/HEIF from iPhones) to a JPEG data URL.
 * Falls back to plain FileReader for already-supported formats.
 */
export async function fileToJpegDataUrl(file: File): Promise<string> {
  // If it's already a web-safe format, just read it directly
  const webSafe = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
  if (webSafe.includes(file.type)) {
    return readAsDataUrl(file);
  }

  // For HEIC/HEIF and other formats, draw through a canvas to convert to JPEG
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      // Last resort — try plain FileReader
      readAsDataUrl(file).then(resolve).catch(reject);
    };
    img.src = url;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
