import Image from "next/image";
import { Quote } from "lucide-react";
import type { TeamMember } from "@/lib/content";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export default function DirectorMessage({
  member,
  heading,
  quoteFrom,
  className = "",
}: {
  member: TeamMember;
  heading: string;
  quoteFrom: string;
  className?: string;
}) {
  const paragraphs = member.bio
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean);
  const [lead, ...rest] = paragraphs;

  return (
    <div className={`ops-director ${className}`}>
      <figure className="ops-director-photo" data-wipe>
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(min-width: 1024px) 26rem, 90vw"
            className="object-cover object-top"
            unoptimized={member.image.startsWith("/api/media")}
          />
        ) : (
          <span className="ops-director-initials">{initials(member.name)}</span>
        )}
        <figcaption className="ops-director-caption">
          <span className="ops-mono text-[0.62rem] tracking-[0.22em] text-white/60 uppercase rtl:tracking-normal">
            {quoteFrom}
          </span>
          <span className="mt-1 block text-xl font-bold tracking-tight text-white md:text-2xl">{member.name}</span>
          <span className="mt-1 block text-sm font-semibold text-[#E0C35A]">{member.role}</span>
        </figcaption>
      </figure>

      <div className="ops-director-body">
        <p className="ops-eyebrow">{heading}</p>
        <Quote size={40} className="mt-6 text-[#0066FF]/20" aria-hidden />
        {lead ? <p className="ops-director-lead" data-rise>{lead}</p> : null}
        {rest.map((text, i) => (
          <p
            key={i}
            className="mt-5 text-[1.02rem] leading-relaxed text-[#3E4F61] md:text-[1.08rem]"
            data-rise
            style={{ "--d": `${(i + 1) * 90}ms` } as React.CSSProperties}
          >
            {text}
          </p>
        ))}
        {member.closing ? <p className="ops-accent mt-6 text-lg font-bold leading-snug">{member.closing}</p> : null}

        <div className="ops-director-sign" data-rise style={{ "--d": "260ms" } as React.CSSProperties}>
          <span className="ops-director-sign-line" aria-hidden />
          <div className="min-w-0">
            <p className="text-lg font-bold text-[#0B1F2A]">{member.name}</p>
            <p className="text-sm text-[#5B6B7C]">
              {member.role}
              {member.education ? <span className="text-[#A6851F]"> | {member.education}</span> : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
