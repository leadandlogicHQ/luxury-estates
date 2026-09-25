// lib/image.ts
export function resolveImage(src: string): string {
  if (!src) return "/villa-exterior.webp";
  return src.startsWith("http") ? src : `/${src}`;
}