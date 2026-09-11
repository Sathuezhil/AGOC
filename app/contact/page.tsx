import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getContent, phoneLink } from "@/lib/content";
import {
  getDictionary,
  localizeContent,
  localizeServices,
} from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { pageMetadata } from "@/lib/seo";
import { getServices } from "@/lib/services";
import { site as siteDefaults } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact AGOC Security Dubai",
  description:
    "Contact AGOC Security in Al Muteena, Dubai. Call, WhatsApp, or enquire for private guards, CCTV, and site protection across the UAE.",
  path: "/contact",
  keywords: [
    "AGOC Security contact",
    "security company Al Muteena",
    "hire security guards Dubai",
    "AGOC phone Dubai",
  ],
});

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const [rawContent, rawServices] = await Promise.all([
    getContent(),
    getServices(),
  ]);
  const content = localizeContent(rawContent, locale);
  const services = localizeServices(rawServices, locale);
  const { contactPage, site } = content;
  const { lat, lng, zoom } = siteDefaults.map;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=${locale}&output=embed`;
  const selectedService = params.service?.trim() ?? "";

  return (
    <>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        text={contactPage.text}
        primaryLabel={dict.hero.speakWithUs}
        secondaryLabel={dict.servicesList.viewServices}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <Reveal motion="left">
            <div className="contact-panel rounded-2xl border border-sand/10 bg-night/40 p-5 md:p-6">
              <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
                {dict.contact.office}
              </p>
              <h2 className="mt-3 font-display text-2xl text-sand md:text-3xl">
                {dict.contact.visitOrCall}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                {dict.contact.brief}
              </p>

              <div className="mt-6 space-y-3">
                <div className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs tracking-[0.16em] text-mist uppercase rtl:tracking-normal rtl:normal-case">
                      {dict.contact.address}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-sand">
                      {site.address}
                    </p>
                  </div>
                </div>

                {["info@agoc.ae", "admin@agoc.ae"].map((email) => (
                  <a
                    key={email}
                    href={`mailto:${email}`}
                    className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4 transition hover:border-olive/40"
                  >
                    <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs tracking-[0.16em] text-mist uppercase rtl:tracking-normal rtl:normal-case">
                        {dict.contact.email}
                      </p>
                      <p className="mt-1 text-sm text-sand" dir="ltr">
                        {email}
                      </p>
                    </div>
                  </a>
                ))}

                {site.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phoneLink(phone)}`}
                    className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4 transition hover:border-olive/40"
                  >
                    <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs tracking-[0.16em] text-mist uppercase rtl:tracking-normal rtl:normal-case">
                        {dict.contact.phone}
                      </p>
                      <p className="mt-1 text-sm text-sand" dir="ltr">
                        {phone}
                      </p>
                    </div>
                  </a>
                ))}

                <div className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4">
                  <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs tracking-[0.16em] text-mist uppercase rtl:tracking-normal rtl:normal-case">
                      {dict.contact.hours}
                    </p>
                    <div className="mt-1 space-y-1 text-sm text-sand">
                      {site.hours.map((row) => (
                        <p key={row.days}>
                          {row.days}: {row.time}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={100} motion="right">
            <div className="contact-form-panel rounded-2xl border border-sand/10 bg-night/40 p-5 md:p-6">
              <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
                {dict.contact.enquiry}
              </p>
              <h2 className="mt-3 font-display text-2xl text-sand md:text-3xl">
                {contactPage.formTitle}
              </h2>
              <p className="mt-2 mb-5 text-sm leading-relaxed text-mist">
                {contactPage.formText}
              </p>
              <ContactForm
                services={services}
                defaultService={selectedService}
                dict={dict}
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={150} className="mt-10">
          <div className="contact-map-panel relative overflow-hidden rounded-2xl border border-sand/10">
            <iframe
              title="AGOC Security — Office 315, Al Mulla 1, Al Muteena"
              src={mapSrc}
              className="h-96 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <div className="service-image-outline pointer-events-none absolute inset-0" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
