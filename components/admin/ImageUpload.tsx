"use client";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — matches the helper text

interface ImageUploadProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  multiple?: boolean;
}

export default function ImageUpload({ value, onChange, multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const values: string[] = Array.isArray(value) ? value : value ? [value] : [];

  const uploadFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET!);
    formData.append("folder", "luxury-estates");
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.secure_url as string;
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    const ok: File[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_BYTES) {
        setError(`"${file.name}" is larger than 10 MB — skipped.`);
        continue;
      }
      ok.push(file);
    }
    if (ok.length === 0) return;
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const file of ok) urls.push(await uploadFile(file));
      if (multiple) onChange([...values, ...urls]);
      else onChange(urls[0] ?? "");
    } catch {
      setError("Upload failed. Please check your Cloudinary credentials and try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    const next = values.filter((_, i) => i !== idx);
    onChange(multiple ? next : (next[0] ?? ""));
  };

  return (
    <div className="space-y-3">
      {/* Drop zone — click, drag, or keyboard */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload images"
        onClick={() => !uploading && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !uploading) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 ${
          dragOver ? "border-primary bg-primary/5" : "border-border bg-off-white hover:border-primary/50"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-text-light">
            <Loader2 className="animate-spin text-primary" size={28} />
            <p className="text-sm font-semibold">Uploading to Cloudinary…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-text-light">
            <ImagePlus className="text-primary" size={28} />
            <p className="text-sm font-semibold text-text">Click or drag images here</p>
            <p className="text-xs">PNG, JPG or WEBP · up to 10 MB each</p>
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {values.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {values.map((url, i) => (
            <div key={url + i} className="group relative aspect-square overflow-hidden rounded-md border border-border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              {!multiple && (
                <span className="absolute left-1 top-1 rounded-sm bg-primary px-1.5 py-0.5 text-[10px] font-bold uppercase text-secondary">
                  Primary
                </span>
              )}
              <button
                type="button"
                onClick={() => removeImage(i)}
                aria-label={`Remove image ${i + 1}`}
                className="absolute right-1 top-1 rounded-md bg-secondary/80 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}