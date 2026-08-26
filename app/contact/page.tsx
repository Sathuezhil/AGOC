import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import Reveal from "@/components/Reveal";
import { getContent, phoneLink } from "@/lib/content";
import { getServices } from "@/lib/services";
import { site as siteDefaults } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach AGOC Security in Al Muteena, Dubai. Call, email, or send a brief for guards, surveillance, and site protection.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<{ service?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const [content, services] = await Promise.all([getContent(), getServices()]);
  const { contactPage, site } = content;
  const { lat, lng, zoom } = siteDefaults.map;
  const mapSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&hl=en&output=embed`;
  const selectedService = params.service?.trim() ?? "";

  return (
    <>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        text={contactPage.text}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10">
          <Reveal motion="left">
            <div className="contact-panel rounded-2xl border border-sand/10 bg-night/40 p-5 md:p-6">
              <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
                Office
              </p>
              <h2 className="mt-3 font-display text-2xl text-sand md:text-3xl">
                Visit or call us
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-mist">
                Tell us the site, hours, and risk. We will come back with a clear
                plan — not a catalogue.
              </p>

              <div className="mt-6 space-y-3">
                <div className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs tracking-[0.16em] text-mist uppercase">
                      Address
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-sand">
                      {site.address}
                    </p>
                  </div>
                </div>

                <a
                  href={`mailto:${site.email}`}
                  className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4 transition hover:border-olive/40"
                >
                  <Mail size={18} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs tracking-[0.16em] text-mist uppercase">
                      Email
                    </p>
                    <p className="mt-1 text-sm text-sand">{site.email}</p>
                  </div>
                </a>

                {site.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phoneLink(phone)}`}
                    className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4 transition hover:border-olive/40"
                  >
                    <Phone size={18} className="mt-0.5 shrink-0 text-gold" />
                    <div>
                      <p className="text-xs tracking-[0.16em] text-mist uppercase">
                        Phone
                      </p>
                      <p className="mt-1 text-sm text-sand">{phone}</p>
                    </div>
                  </a>
                ))}

                <div className="contact-info-row flex gap-3 rounded-xl border border-sand/10 bg-ink/30 p-4">
                  <Clock size={18} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="text-xs tracking-[0.16em] text-mist uppercase">
                      Hours
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
              <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
                Enquiry
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
