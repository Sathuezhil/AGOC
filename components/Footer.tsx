import { Clock, Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import ThemeBrandLogo from "./ThemeBrandLogo";
import LocaleLink from "./LocaleLink";
import FooterMap from "./FooterMap";
import { brandLogo, brandLogoLight, site as siteDefaults } from "@/lib/site";
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
  const footerServices = services.slice(0, 5);
  const { site } = content;
  const { lat, lng, zoom } = siteDefaults.map;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${locale}&output=embed`;
  const mapLink = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}`;
  const profileHref = profilePdfHref(site.companyProfilePdf);
  const publicEmails = ["info@agoc.ae", "admin@agoc.ae"];
  const year = new Date().getFullYear();

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
    <div
      role="contentinfo"
      className="site-footer border-t border-sand/10 bg-night"
      suppressHydrationWarning
    >
      <div className="site-footer-inner site-wrap grid gap-8 section-y-tight sm:gap-10 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        <div className="space-y-3.5">
          <ThemeBrandLogo
            darkSrc={brandLogo}
            lightSrc={brandLogoLight}
            compact
            className="h-auto w-full max-w-[15rem]"
          />
          <p className="max-w-[16rem] type-body-sm text-mist">
            {site.tagline}
          </p>
          {socials.length > 0 && (
            <div className="footer-socials flex flex-wrap items-center gap-2 pt-0.5">
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
                    style={{ animationDelay: `${i * 0.2}s` }}
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          )}
          <a
            href={profileHref}
            download={profileDownloadName}
            className="footer-link inline-flex text-sm text-olive"
          >
            {dict.header.ourProfile}
          </a>
        </div>

        <div>
          <h3 className="footer-heading mb-3 text-xs font-semibold tracking-[0.2em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
            {dict.footer.menu}
          </h3>
          <ul className="space-y-1.5 text-sm text-sand/80">
            {links.map((link) => (
              <li key={link.href}>
                <LocaleLink href={link.href} className="footer-link">
                  {link.label}
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="footer-heading mb-3 text-xs font-semibold tracking-[0.2em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
            {dict.footer.services}
          </h3>
          <ul className="space-y-1.5 text-sm text-sand/80">
            {footerServices.map((service) => (
              <li key={service.slug}>
                <LocaleLink
                  href={`/services/${service.slug}`}
                  className="footer-link"
                >
                  {service.title}
                </LocaleLink>
              </li>
            ))}
            <li className="pt-0.5">
              <LocaleLink
                href="/services"
                className="footer-link font-medium text-olive"
              >
                {dict.home.allServices} →
              </LocaleLink>
            </li>
          </ul>
        </div>

        <div className="space-y-2.5 text-sm text-sand/80">
          <h3 className="footer-heading mb-3 text-xs font-semibold tracking-[0.2em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
            {dict.footer.contact}
          </h3>
          <div className="flex gap-2.5">
            <MapPin size={15} className="mt-0.5 shrink-0 text-crimson" />
            <span className="leading-snug">{site.address}</span>
          </div>
          <FooterMap
            mapSrc={mapSrc}
            mapLink={mapLink}
            openMapAria={dict.footer.openMapAria}
            viewOnMap={dict.footer.viewOnMap}
          />
          {publicEmails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="footer-contact flex gap-2.5"
            >
              <Mail size={15} className="mt-0.5 shrink-0 text-crimson" />
              <span dir="ltr">{email}</span>
            </a>
          ))}
          {site.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phoneLink(phone)}`}
              className="footer-contact flex gap-2.5"
            >
              <Phone size={15} className="mt-0.5 shrink-0 text-crimson" />
              <span dir="ltr">{phone}</span>
            </a>
          ))}
          <div className="flex gap-2.5">
            <Clock size={15} className="mt-0.5 shrink-0 text-crimson" />
            <div className="space-y-0.5 leading-snug">
              {site.hours.map((row) => (
                <p key={row.days}>
                  {row.days}: {row.time}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="site-footer-inner border-t border-sand/10">
        <div className="site-wrap flex flex-col gap-2 py-4 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p suppressHydrationWarning>
            © {year} {site.name}. {dict.footer.rights}
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <LocaleLink href="/privacy" className="footer-link">
              {dict.footer.privacy}
            </LocaleLink>
            <LocaleLink href="/terms" className="footer-link">
              {dict.footer.terms}
            </LocaleLink>
            <span>{dict.footer.licensed}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
