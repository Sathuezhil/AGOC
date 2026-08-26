import Image from "next/image";

export default function CoverImage({
  src,
  alt,
  priority = false,
  bounce = false,
  float = "up",
  delay = 0,
  fit = "cover",
  /** Show the full uploaded image without CSS cropping */
  full = false,
  objectPosition = "center",
  sizes = "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw",
  className = "",
}: {
  src: string;
  alt: string;
  priority?: boolean;
  bounce?: boolean;
  float?: "up" | "down";
  delay?: number;
  fit?: "cover" | "contain";
  full?: boolean;
  objectPosition?: string;
  sizes?: string;
  className?: string;
}) {
  const motion =
    bounce &&
    (float === "down"
      ? "animate-imageFloatAlt hover:animate-imageFloatAltFast active:animate-imageFloatAltFast group-hover:animate-imageFloatAltFast group-active:animate-imageFloatAltFast"
      : "animate-imageFloat hover:animate-imageFloatFast active:animate-imageFloatFast group-hover:animate-imageFloatFast group-active:animate-imageFloatFast");

  if (full) {
    return (
      <Image
        src={src}
        alt={alt}
        width={1600}
        height={1200}
        priority={priority}
        sizes={sizes}
        unoptimized={src.startsWith("/api/media")}
        className={`h-auto w-full object-contain ${motion || ""} ${className}`}
        style={bounce ? { animationDelay: `${delay}ms` } : undefined}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      sizes={sizes}
      style={{
        objectPosition,
        ...(bounce ? { animationDelay: `${delay}ms` } : {}),
      }}
      unoptimized={src.startsWith("/api/media")}
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${motion || ""} ${className}`}
    />
  );
}
