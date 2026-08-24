import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import Logo from "./Logo";
import { navLinks } from "@/lib/site";
import { getContent, phoneLink } from "@/lib/content";
import { getVisibleServices } from "@/lib/services";

export default async function Footer() {
  const [content, services] = await Promise.all([
    getContent(),
    getVisibleServices(),
  ]);
  const { site } = content;

  return (
    <footer className="border-t border-sand/10 bg-night">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-5">
          <div className="inline-block bg-white px-2 py-1.5">
            <Logo />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-mist">
            {site.legalName}. {site.footerBlurb}
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase">
            Menu
          </h3>
          <ul className="space-y-2.5 text-sm text-sand/80">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-sand">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacy" className="hover:text-sand">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-sand">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase">
            Services
          </h3>
          <ul className="space-y-2.5 text-sm text-sand/80">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="hover:text-sand"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4 text-sm text-sand/80">
          <h3 className="mb-4 text-sm font-semibold tracking-[0.22em] text-olive uppercase">
            Contact
          </h3>
          <p className="flex gap-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-crimson" />
            {site.address}
          </p>
          <a href={`mailto:${site.email}`} className="flex gap-3 hover:text-sand">
            <Mail size={16} className="mt-0.5 shrink-0 text-crimson" />
            {site.email}
          </a>
          {site.phones.map((phone) => (
            <a
              key={phone}
              href={`tel:${phoneLink(phone)}`}
              className="flex gap-3 hover:text-sand"
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
      </div>

      <div className="border-t border-sand/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p>Licensed security services · Dubai, United Arab Emirates</p>
        </div>
      </div>
    </footer>
  );
}
