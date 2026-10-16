import CoverImage from "@/components/CoverImage";
import OpsTag from "@/components/home/OpsTag";
import type { OpsTone } from "@/lib/home-ops";

export default function OpsMediaCard({
  src,
  alt,
  badge,
  card,
  priority = false,
  objectPosition = "center",
  children,
}: {
  src: string;
  alt: string;
  badge?: React.ReactNode;
  card?: { icon: React.ReactNode; title: string; meta: string; tag?: string; tone?: OpsTone };
  priority?: boolean;
  objectPosition?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="ops-media">
        <CoverImage
          src={src}
          alt={alt}
          priority={priority}
          bounce={false}
          objectPosition={objectPosition}
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07141c]/45 via-transparent to-transparent" />
        {badge}
      </div>
      {card ? (
        <div className="ops-float ops-media-card">
          <span className={`ops-float-icon ops-float-icon-${card.tone ?? "live"}`}>{card.icon}</span>
          <span className="min-w-0">
            <span className="block truncate text-[0.95rem] font-semibold text-[#0B1F2A]">{card.title}</span>
            <span className="ops-mono block truncate text-[0.72rem] text-[#5B6B7C]">{card.meta}</span>
          </span>
          {card.tag ? (
            <OpsTag tone={card.tone ?? "live"} className="ms-auto">
              {card.tag}
            </OpsTag>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
