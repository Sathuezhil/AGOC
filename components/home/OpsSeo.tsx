import LocaleLink from "@/components/LocaleLink";
import type { HomeOps } from "@/lib/home-ops";

export default function OpsSeo({ copy }: { copy: HomeOps["seo"] }) {
  return (
    <section id="dubai-security-company" className="ops-light pb-20 pt-4 md:pb-28" aria-labelledby="seo-heading">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div>
          <p className="ops-eyebrow">{copy.label}</p>
          <h2 id="seo-heading" className="ops-h2 mt-4">
            {copy.title} <span className="ops-accent">{copy.accent}</span>
          </h2>
          <p className="mt-5 max-w-xl text-[1.05rem] leading-relaxed text-[#3E4F61]">{copy.text}</p>
          <ul className="ops-seo-points mt-8">
            {copy.points.map((point) => (
              <li key={point.href}>
                <LocaleLink href={point.href} className="ops-seo-point">
                  <span className="ops-seo-point-title">{point.title}</span>
                  <span className="ops-seo-point-text">{point.text}</span>
                </LocaleLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="ops-faq">
            {copy.faq.map((item) => (
              <details key={item.question} className="ops-faq-item">
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
