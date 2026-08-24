import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/api/media/logo.png"
      alt="AGOC — A Power That Saves You"
      width={280}
      height={90}
      className={`h-11 w-auto object-contain object-left md:h-[3.15rem] ${className}`}
      priority
      unoptimized
    />
  );
}
