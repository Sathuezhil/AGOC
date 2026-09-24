import Image from "next/image";
import { defaultLogo } from "@/lib/site";

function safeSrc(src: string) {
  // Avoid spaces/unencoded paths breaking HTML parsing → hydration mismatch
  try {
    return encodeURI(decodeURI(src));
  } catch {
    return encodeURI(src);
  }
}

export default function Logo({
  src = defaultLogo,
  className = "h-[5rem]",
  compact = false,
}: {
  src?: string;
  className?: string;
  /** Admin-sized full logo (icon + AGOC + company line). */
  compact?: boolean;
}) {
  const imageSrc = safeSrc(src || defaultLogo);

  if (compact) {
    return (
      <Image
        src={imageSrc}
        alt="AGOC — A Power That Saves You"
        width={4550}
        height={2288}
        className={`max-w-full w-full h-auto object-contain object-center ${className}`}
        priority
        unoptimized
      />
    );
  }

  return (
    <Image
      src={imageSrc}
      alt="AGOC — A Power That Saves You"
      width={420}
      height={120}
      className={`max-w-full object-contain object-left ${className}`}
      priority
      unoptimized
    />
  );
}
