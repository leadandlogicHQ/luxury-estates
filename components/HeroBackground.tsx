import Image from "next/image";

export default function HeroBackground({
  src,
  alt = "",
}: {
  src: string;
  alt?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority
      fetchPriority="high"
      sizes="100vw"
      className="object-cover"
    />
  );
}