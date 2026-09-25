interface PropertyMapProps {
  lat: number;
  lng: number;
  title: string;
}

export default function PropertyMap({ lat, lng, title }: PropertyMapProps) {
  const src = `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`;

  return (
    <div className="h-[400px] w-full overflow-hidden rounded-xl border border-border bg-off-white shadow-sm">
      <iframe
        title={`Map of ${title}`}
        src={src}
        className="block h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}