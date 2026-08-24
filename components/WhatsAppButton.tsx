import Link from "next/link";
import { site } from "@/lib/site";
import { MessageCircle } from "lucide-react";

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
      className="fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/40 transition duration-300 hover:scale-110"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] animate-pulseRing" />
      <MessageCircle size={26} fill="currentColor" className="relative" />
    </Link>
  );
}
