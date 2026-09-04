import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import ThemeBrandLogo from "./ThemeBrandLogo";
import Reveal from "./Reveal";
import LocaleLink from "./LocaleLink";
import { brandLogo, brandLogoLight, site as siteDefaults } from "@/lib/site";
import { getContent, phoneLink } from "@/lib/content";
import { getVisibleServices } from "@/lib/services";
import {
  localizeContent,
  localizeServices,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";

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

export default async function Footer({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  const [rawContent, rawServices] = await Promise.all([
    getContent(),
    getVisibleServices(),
  ]);
  const content = localizeContent(rawContent, locale);
  const services = localizeServices(rawServices, locale);
  const { site } = content;
  const { lat, lng, zoom } = siteDefaults.map;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${locale}&output=embed`;
  const mapLink = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/services", label: dict.nav.services },
    { href: "/careers", label: dict.nav.careers },
    { href: "/contact", label: dict.nav.contact },
  ];

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
            <ThemeBrandLogo
              darkSrc={brandLogo}
              lightSrc={brandLogoLight}
              compact
              className="h-auto w-full max-w-[18rem] sm:max-w-[20rem]"
            />
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
            <h3 className="footer-heading mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
              {dict.footer.menu}
            </h3>
            <ul className="space-y-2.5 text-sm text-sand/80">
              {links.map((link) => (
                <li key={link.href}>
                  <LocaleLink href={link.href} className="footer-link">
                    {link.label}
                  </LocaleLink>
                </li>
              ))}
              <li>
                <LocaleLink href="/privacy" className="footer-link">
                  {dict.footer.privacy}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink href="/terms" className="footer-link">
                  {dict.footer.terms}
                </LocaleLink>
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div>
            <h3 className="footer-heading mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
              {dict.footer.services}
            </h3>
            <ul className="space-y-2.5 text-sm text-sand/80">
              {services.slice(0, 6).map((service) => (
                <li key={service.slug}>
                  <LocaleLink
                    href={`/services/${service.slug}`}
                    className="footer-link"
                  >
                    {service.title}
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="space-y-4 text-sm text-sand/80">
            <h3 className="footer-heading mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
              {dict.footer.contact}
            </h3>
            <div className="flex flex-col gap-3">
              <p className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-crimson" />
                <span>{site.address}</span>
              </p>
              <div className="footer-map group relative overflow-hidden rounded-lg border border-sand/15">
                <iframe
                  title="AGOC Security office map"
                  src={mapSrc}
                  className="pointer-events-none h-28 w-full grayscale-[20%] transition duration-500 group-hover:grayscale-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  tabIndex={-1}
                />
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={dict.footer.openMapAria}
                  title={dict.footer.openMapAria}
                >
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent px-2.5 py-2 text-[10px] tracking-wide text-white uppercase rtl:tracking-normal rtl:normal-case">
                    {dict.footer.viewOnMap}
                  </span>
                </a>
              </div>
            </div>
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
            © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
          </p>
          <p>{dict.footer.licensed}</p>
        </div>
      </div>
    </footer>
  );
}
