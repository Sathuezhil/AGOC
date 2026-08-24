import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import PageHero from "@/components/PageHero";
import ContactForm from "@/components/ContactForm";
import { getContent, phoneLink } from "@/lib/content";
import { getServices } from "@/lib/services";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Reach AGOC Security in Al Muteena, Dubai. Call, email, or send a brief for guards, surveillance, and site protection.",
};

export default async function ContactPage() {
  const [content, services] = await Promise.all([getContent(), getServices()]);
  const { contactPage, site } = content;
  const mapQuery = encodeURIComponent(site.address);

  return (
    <>
      <PageHero
        eyebrow={contactPage.eyebrow}
        title={contactPage.title}
        text={contactPage.text}
      />

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl text-sand">Office</h2>
          <div className="mt-8 space-y-5 text-sm text-mist">
            <p className="flex gap-3">
              <MapPin size={18} className="text-crimson" />
              {site.address}
            </p>
            <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-sand">
              <Mail size={18} className="text-crimson" />
              {site.email}
            </a>
            {site.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phoneLink(phone)}`}
                className="flex gap-3 hover:text-sand"
              >
                <Phone size={18} className="text-crimson" />
                {phone}
              </a>
            ))}
            <div className="flex gap-3">
              <Clock size={18} className="text-crimson" />
              <div>
                {site.hours.map((row) => (
                  <p key={row.days}>
                    {row.days}: {row.time}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-10 overflow-hidden border border-sand/10">
            <iframe
              title="AGOC Security office map"
              src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
              className="h-72 w-full"
              loading="lazy"
            />
          </div>
        </div>
        <div className="border border-sand/10 bg-night p-6 md:p-8">
          <h2 className="font-display text-3xl text-sand">{contactPage.formTitle}</h2>
          <p className="mt-2 mb-6 text-sm text-mist">{contactPage.formText}</p>
          <ContactForm services={services} />
        </div>
      </section>
    </>
  );
}
