import { useState } from "react";
import { ImageOff } from "lucide-react";

type Props = {
  src: string | null;
  alt: string;
  className: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
};

export default function CourtImage({
  src,
  alt,
  className,
  loading = "lazy",
  fetchPriority,
}: Props) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const isMissing = !src || failedSrc === src;

  if (isMissing) {
    return (
      <div
        role="img"
        aria-label={`No image for ${alt}`}
        className={`grid place-content-center justify-items-center gap-1 bg-[#F1EFE8] text-obc-muted ${className}`}
      >
        <ImageOff size={20} aria-hidden="true" />
        <span className="text-[10px] font-medium">No image</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setFailedSrc(src)}
      className={`${className} object-cover`}
    />
  );
}