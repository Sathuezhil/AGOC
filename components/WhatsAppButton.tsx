import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

export default function WhatsAppButton() {
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    "Hello AGOC Security, I would like to discuss a protection requirement.",
  )}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg shadow-black/40 transition duration-300 hover:scale-110"
    >
      <span className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366]/25 animate-pulseRing" />
      <Image
        src="/api/media/images/whatsapp.png"
        alt=""
        width={40}
        height={40}
        className="relative h-10 w-10 object-contain"
        priority
        unoptimized
      />
    </Link>
  );
}
