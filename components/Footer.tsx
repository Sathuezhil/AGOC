import {
  ArrowRight,
  ArrowUpRight,
  Clock,
  Download,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Logo from "./Logo";
import LocaleLink from "./LocaleLink";
import FooterMap from "./FooterMap";
import { BackToTop, DubaiClock } from "./FooterExtras";
import { brandLogo, site as siteDefaults } from "@/lib/site";
import { getContent, phoneLink } from "@/lib/content";
import { getVisibleServices } from "@/lib/services";
import {
  localizeContent,
  localizeServices,
  type Dictionary,
  type Locale,
} from "@/lib/i18n";
import { profileDownloadName, profilePdfHref } from "@/lib/profile-pdf";

function TikTokIcon({ size = 15 }: { size?: number }) {
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
  const footerServices = services.slice(0, 6);
  const { site } = content;
  const { lat, lng, zoom } = siteDefaults.map;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${locale}&output=embed`;
  const mapLink = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
  const profileHref = profilePdfHref(site.companyProfilePdf);
  const publicEmails = ["info@agoc.ae", "admin@agoc.ae"];
  const year = new Date().getFullYear();
  const mainPhone = site.phones[0];

  const links = [
    { href: "/", label: dict.nav.home },
    { href: "/about", label: dict.nav.about },
    { href: "/services", label: dict.nav.services },
    { href: "/careers", label: dict.nav.careers },
    { href: "/contact", label: dict.nav.contact },
  ];

  const socials = [
    { href: site.facebook, label: "Facebook", icon: Facebook },
    { href: site.instagram, label: "Instagram", icon: Instagram },
    { href: site.tiktok, label: "TikTok", icon: TikTokIcon },
  ].filter((item) => Boolean(item.href?.trim()));

  return (
    <div role="contentinfo" className="ops-foot" data-spot suppressHydrationWarning>
      <div className="ops-foot-glow" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-5">
        <div className="ops-foot-cta" data-rise>
          <div className="max-w-2xl">
            <span className="ops-foot-live">
              <i aria-hidden />
              {dict.footer.live}
            </span>
            <h2 className="ops-foot-title">
              {dict.footer.ctaTitle}{" "}
              <span className="ops-accent-dark">{dict.footer.ctaAccent}</span>
            </h2>
            <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-white/65">
              {dict.footer.ctaText}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <LocaleLink href="/contact" className="ops-btn ops-btn-primary">
              {dict.footer.ctaPrimary}
              <ArrowRight size={17} className="rtl:rotate-180" />
            </LocaleLink>
            {mainPhone ? (
              <a href={`tel:${phoneLink(mainPhone)}`} className="ops-btn ops-btn-glass">
                <Phone size={16} />
                <span dir="ltr">{mainPhone}</span>
              </a>
            ) : null}
          </div>
        </div>

        <div className="ops-foot-grid">
          <div className="ops-foot-brand" data-rise style={{ "--d": "0ms" } as React.CSSProperties}>
            <div className="w-[12rem] sm:w-[13.5rem]">
              <Logo src={brandLogo} compact className="h-auto" />
            </div>
            <p className="mt-4 max-w-[17rem] text-[0.92rem] leading-relaxed text-white/55">
              {site.tagline}
            </p>

            {socials.length > 0 && (
              <div className="mt-6">
                <p className="ops-foot-label">{dict.footer.follow}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {socials.map((item) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.label}
                        title={item.label}
                        className={`ops-foot-social ops-foot-social-${item.label.toLowerCase()}`}
                        data-mag="0.35"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}

            <a href={profileHref} download={profileDownloadName} className="ops-foot-profile">
              <span className="ops-foot-profile-icon">
                <Download size={15} />
              </span>
              <span>
                <b>{dict.header.ourProfile}</b>
                <small>PDF</small>
              </span>
            </a>
          </div>

          <nav data-rise style={{ "--d": "80ms" } as React.CSSProperties} aria-label={dict.footer.menu}>
            <p className="ops-foot-label">{dict.footer.menu}</p>
            <ul className="ops-foot-list">
              {links.map((link) => (
                <li key={link.href}>
                  <LocaleLink href={link.href} className="ops-foot-link">
                    <span>{link.label}</span>
                    <ArrowUpRight size={14} aria-hidden className="rtl:-scale-x-100" />
                  </LocaleLink>
                </li>
              ))}
            </ul>
          </nav>

          <div data-rise style={{ "--d": "160ms" } as React.CSSProperties}>
            <p className="ops-foot-label">{dict.footer.services}</p>
            <ul className="ops-foot-list">
              {footerServices.map((service) => (
                <li key={service.slug}>
                  <LocaleLink href={`/services/${service.slug}`} className="ops-foot-link">
                    <span>{service.title}</span>
                    <ArrowUpRight size={14} aria-hidden className="rtl:-scale-x-100" />
                  </LocaleLink>
                </li>
              ))}
            </ul>
            <LocaleLink href="/services" className="ops-foot-more">
              {dict.home.allServices}
              <ArrowRight size={14} className="rtl:rotate-180" />
            </LocaleLink>
          </div>

          <div data-rise style={{ "--d": "240ms" } as React.CSSProperties}>
            <p className="ops-foot-label">{dict.footer.contact}</p>
            <div className="ops-foot-card">
              <div className="flex gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#e0c35a]" />
                <span className="text-[0.9rem] leading-snug text-white/80">{site.address}</span>
              </div>
              <div className="mt-3">
                <FooterMap
                  mapSrc={mapSrc}
                  mapLink={mapLink}
                  openMapAria={dict.footer.openMapAria}
                  viewOnMap={dict.footer.viewOnMap}
                />
              </div>
            </div>

            <ul className="mt-4 space-y-1">
              {publicEmails.map((email) => (
                <li key={email}>
                  <a href={`mailto:${email}`} className="ops-foot-contact">
                    <Mail size={15} />
                    <span dir="ltr">{email}</span>
                  </a>
                </li>
              ))}
              {site.phones.map((phone) => (
                <li key={phone}>
                  <a href={`tel:${phoneLink(phone)}`} className="ops-foot-contact">
                    <Phone size={15} />
                    <span dir="ltr">{phone}</span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="ops-foot-hours">
              <p className="flex items-center gap-2 text-white/80">
                <Clock size={15} className="text-[#e0c35a]" />
                {dict.footer.hours}
              </p>
              <dl className="mt-2 space-y-1">
                {site.hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4">
                    <dt className="text-white/55">{row.days}</dt>
                    <dd className="ops-mono text-white/85" dir="ltr">{row.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>

      <div className="ops-foot-mark" aria-hidden data-rise data-spot dir="ltr">
        <span className="ops-foot-mark-stroke">AGOC</span>
        <span className="ops-foot-mark-fill">AGOC</span>
      </div>

      <div className="ops-foot-bar">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-5 text-[0.78rem] text-white/50 lg:flex-row lg:items-center lg:justify-between">
          <p suppressHydrationWarning>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
            <LocaleLink href="/privacy" className="ops-foot-mini">
              {dict.footer.privacy}
            </LocaleLink>
            <LocaleLink href="/terms" className="ops-foot-mini">
              {dict.footer.terms}
            </LocaleLink>
            <span className="hidden text-white/35 sm:inline">{dict.footer.licensed}</span>
          </div>
          <div className="flex items-center gap-3">
            <DubaiClock label={dict.footer.dubaiTime} />
            <BackToTop label={dict.footer.backToTop} />
          </div>
        </div>
      </div>
    </div>
  );
}
