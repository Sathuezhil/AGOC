import type { Metadata } from "next";
import { ArrowUpRight, Clock, Mail, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import OpsTag from "@/components/home/OpsTag";
import OpsPageHero from "@/components/ops/OpsPageHero";
import OpsProcess from "@/components/ops/OpsProcess";
import OpsSectionHead from "@/components/ops/OpsSectionHead";
import { getContent, phoneLink } from "@/lib/content";
import { getDictionary, localizeContent, localizeServices } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { getPagesOps } from "@/lib/pages-ops";
import { pageMetadata } from "@/lib/seo";
import { getServices } from "@/lib/services";
import { site as siteDefaults } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact AGOC Security Dubai | Hire Security Guards Today",
  description:
    "Contact AGOC Security in Al Muteena, Deira, Dubai. Call, WhatsApp or send an enquiry to hire security guards, CCTV operators, event security and facility staff anywhere in the UAE.",
  path: "/contact",
  keywords: [
    "contact security company Dubai",
    "hire security guards Dubai",
    "security guard quote Dubai",
    "AGOC Security contact",
    "security company Al Muteena",
    "security company Deira",
  ],
});

const EMAILS = ["info@agoc.ae", "admin@agoc.ae"];

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);
  const [rawContent, rawServices] = await Promise.all([getContent(), getServices()]);
  const content = localizeContent(rawContent, locale);
  const services = localizeServices(rawServices, locale);
  const { contactPage, site } = content;
  const { lat, lng, zoom } = siteDefaults.map;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${locale}&output=embed`;
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const waHref = `https://wa.me/${siteDefaults.whatsapp}?text=${encodeURIComponent(dict.whatsapp.message)}`;
  const selectedService = params.service?.trim() ?? "";
  const firstPhone = site.phones[0] || siteDefaults.phones[0];

  const quick = [
    {
      href: `tel:${phoneLink(firstPhone)}`,
      icon: Phone,
      label: p.common.call,
      value: firstPhone,
      ltr: true,
      tag: dict.contact.phone,
      tone: "live" as const,
    },
    {
      href: waHref,
      icon: MessageCircle,
      label: p.common.whatsapp,
      value: `+${siteDefaults.whatsapp}`,
      ltr: true,
      tag: "WhatsApp",
      tone: "ok" as const,
      external: true,
    },
    {
      href: `mailto:${EMAILS[0]}`,
      icon: Mail,
      label: dict.contact.email,
      value: EMAILS[0],
      ltr: true,
      tag: "Email",
      tone: "info" as const,
    },
  ];

  return (
    <>
      <OpsPageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        text={contactPage.text}
        primary={{ href: "#contact-form", label: dict.contact.enquiry }}
        secondary={{ href: waHref, label: p.common.whatsapp, external: true, icon: <MessageCircle size={16} /> }}
        visual={
          <div className="ops-panel">
            <div className="ops-window-bar">
              <span className="flex gap-1.5" aria-hidden>
                <i className="ops-dot bg-[#FF5F57]" />
                <i className="ops-dot bg-[#FEBC2E]" />
                <i className="ops-dot bg-[#28C840]" />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-[#0B1F2A]">{p.contact.quickTitle}</span>
              <OpsTag tone="live">24/7</OpsTag>
            </div>
            <div className="p-4 sm:p-5">
              <p className="mb-4 text-[0.92rem] leading-relaxed text-[#4A5A6B]">{p.contact.quickText}</p>
              <ul className="space-y-2">
                {quick.map((row) => {
                  const Icon = row.icon;
                  return (
                    <li key={row.label}>
                      <a
                        href={row.href}
                        {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className={`ops-row ops-row-link ${row.tone === "live" ? "is-focus" : ""}`}
                      >
                        <span className="ops-icon-sq ops-icon-sm">
                          <Icon size={16} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.92rem] font-semibold text-[#0B1F2A]">{row.label}</span>
                          <span className="ops-mono block truncate text-[0.72rem] text-[#6B7A8B]" dir={row.ltr ? "ltr" : undefined}>
                            {row.value}
                          </span>
                        </span>
                        <ArrowUpRight size={16} className="text-[#8593A3] rtl:-scale-x-100" />
                      </a>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-start gap-3 rounded-xl bg-[#F4F6F9] p-3.5">
                <Clock size={16} className="mt-0.5 shrink-0 text-[#0066FF]" />
                <div className="min-w-0 space-y-0.5 text-[0.82rem] text-[#3E4F61]">
                  {site.hours.map((row) => (
                    <p key={row.days}>
                      <span className="font-semibold text-[#0B1F2A]">{row.days}</span> · {row.time}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      />

      <section id="contact-form" className="ops-light scroll-mt-28 py-20 md:py-24">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-32">
            <div>
              <OpsSectionHead label={p.contact.infoLabel} title={p.contact.infoTitle} text={dict.contact.brief} />
              <div className="mt-10 grid gap-3 sm:grid-cols-2">
                <div className="ops-info sm:col-span-2">
                  <span className="ops-icon-sq ops-icon-sm">
                    <MapPin size={16} />
                  </span>
                  <span className="min-w-0">
                    <span className="ops-info-label">{dict.contact.address}</span>
                    <span className="ops-info-value">{site.address}</span>
                  </span>
                </div>
                {site.phones.map((phone) => (
                  <a key={phone} href={`tel:${phoneLink(phone)}`} className="ops-info ops-info-link">
                    <span className="ops-icon-sq ops-icon-sm">
                      <Phone size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="ops-info-label">{dict.contact.phone}</span>
                      <span className="ops-info-value" dir="ltr">
                        {phone}
                      </span>
                    </span>
                  </a>
                ))}
                {EMAILS.map((email) => (
                  <a key={email} href={`mailto:${email}`} className="ops-info ops-info-link">
                    <span className="ops-icon-sq ops-icon-sm">
                      <Mail size={16} />
                    </span>
                    <span className="min-w-0">
                      <span className="ops-info-label">{dict.contact.email}</span>
                      <span className="ops-info-value" dir="ltr">
                        {email}
                      </span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="ops-form contact-form-panel p-5 sm:p-7 md:p-8">
              <p className="ops-eyebrow">{dict.contact.enquiry}</p>
              <h2 className="mt-3 text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] text-[#0B1F2A]">
                {contactPage.formTitle}
              </h2>
              <p className="mt-2 mb-6 text-[0.97rem] leading-relaxed text-[#4A5A6B]">{contactPage.formText}</p>
              <ContactForm services={services} defaultService={selectedService} dict={dict} />
            </div>
          </Reveal>
        </div>
      </section>

      <OpsProcess
        label={p.contact.nextLabel}
        title={p.contact.nextTitle}
        accent={p.contact.nextAccent}
        steps={p.contact.nextSteps}
        dark
      />

      <section className="ops-light py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <OpsSectionHead
            label={p.contact.mapLabel}
            title={p.contact.mapTitle}
            text={site.address}
            action={
              <a href={directionsHref} target="_blank" rel="noopener noreferrer" className="ops-btn ops-btn-primary">
                <Navigation size={16} />
                {p.contact.directions}
              </a>
            }
          />
          <Reveal delay={100} className="mt-10">
            <div className="ops-map">
              <iframe
                title="AGOC Security — Office 315, Al Mulla 1, Al Muteena"
                src={mapSrc}
                className="h-[26rem] w-full md:h-[30rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <div className="ops-map-card">
                <span className="ops-icon-sq ops-icon-sm">
                  <MapPin size={16} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.92rem] font-semibold text-[#0B1F2A]">AGOC Security</span>
                  <span className="block truncate text-[0.78rem] text-[#5B6B7C]">{p.contact.mapTitle}</span>
                </span>
                <OpsTag tone="ok">{dict.contact.office}</OpsTag>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
