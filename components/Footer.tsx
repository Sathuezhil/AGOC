import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import Reveal from "./Reveal";
import { navLinks } from "@/lib/site";
import { getContent, phoneLink } from "@/lib/content";
import { getVisibleServices } from "@/lib/services";

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.16 15.84 6.34 6.34 0 0 0 9.5 22.18a6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1.01-.15Z" />
    </svg>
  );
}

export default async function Footer() {
  const [content, services] = await Promise.all([
    getContent(),
    getVisibleServices(),
  ]);
  const { site } = content;

  const socials = [
    {
      href: site.facebook,
      label: "Facebook",
      icon: Facebook,
    },
    {
      href: site.instagram,
      label: "Instagram",
      icon: Instagram,
    },
    {
      href: site.tiktok,
      label: "TikTok",
      icon: TikTokIcon,
    },
  ].filter((item) => Boolean(item.href?.trim()));

  return (
    <footer className="site-footer border-t border-sand/10 bg-night">
      <div className="site-footer-inner mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <div className="space-y-5">
            <div className="inline-block bg-white px-2 py-1.5">
              <Logo />
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-mist">
              {site.legalName}. {site.footerBlurb}
            </p>
            {socials.length > 0 && (
              <div className="footer-socials flex flex-wrap items-center gap-3 pt-1">
                {socials.map((item, i) => {
                  const Icon = item.icon;
                  const kind = item.label.toLowerCase();
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      title={item.label}
                      className={`footer-social footer-social-${kind}`}
                      style={{ animationDelay: `${i * 0.35}s` }}
                    >
                      <span className="footer-social-shine" aria-hidden />
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div>
            <h3 className="footer-heading mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase">
              Menu
            </h3>
            <ul className="space-y-2.5 text-sm text-sand/80">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="footer-link">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="footer-link">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div>
            <h3 className="footer-heading mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase">
              Services
            </h3>
            <ul className="space-y-2.5 text-sm text-sand/80">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="footer-link"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="space-y-4 text-sm text-sand/80">
            <h3 className="footer-heading mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase">
              Contact
            </h3>
            <p className="flex gap-3">
              <MapPin size={16} className="mt-0.5 shrink-0 text-crimson" />
              {site.address}
            </p>
            <a
              href={`mailto:${site.email}`}
              className="footer-contact flex gap-3"
            >
              <Mail size={16} className="mt-0.5 shrink-0 text-crimson" />
              {site.email}
            </a>
            {site.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phoneLink(phone)}`}
                className="footer-contact flex gap-3"
              >
                <Phone size={16} className="mt-0.5 shrink-0 text-crimson" />
                {phone}
              </a>
            ))}
            <div className="flex gap-3">
              <Clock size={16} className="mt-0.5 shrink-0 text-crimson" />
              <div>
                {site.hours.map((row) => (
                  <p key={row.days}>
                    {row.days}: {row.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="site-footer-inner border-t border-sand/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Licensed security services · Dubai, United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
