import Image from "next/image";

export default function CoverImage({
  src,
  alt,
  priority = false,
  bounce = true,
  float = "up",
  delay = 0,
  fit = "cover",
  objectPosition = "center 32%",
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
  objectPosition?: string;
  sizes?: string;
  className?: string;
}) {
  const motion =
    bounce &&
    (float === "down"
      ? "animate-imageFloatAlt hover:animate-imageFloatAltFast active:animate-imageFloatAltFast group-hover:animate-imageFloatAltFast group-active:animate-imageFloatAltFast"
      : "animate-imageFloat hover:animate-imageFloatFast active:animate-imageFloatFast group-hover:animate-imageFloatFast group-active:animate-imageFloatFast");

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
      className={`${fit === "contain" ? "object-contain" : "object-cover"} ${motion || ""} ${className}`}
    />
  );
}
