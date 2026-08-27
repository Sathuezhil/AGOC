import Image from "next/image";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/api/media/uploads/1787735514704-gemini_generated_image_a3gg58a3gg58a3gg_page-0001.jpg"
      alt="AGOC — A Power That Saves You"
      width={420}
      height={120}
      className={`h-[5rem] w-auto object-contain object-left ${className}`}
      priority
      unoptimized
    />
  );
}
