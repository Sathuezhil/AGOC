import type { Metadata } from "next";
import { ArrowRight, Briefcase, Check, Clock, GraduationCap, MapPin, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import Reveal from "@/components/Reveal";
import CareerApplyForm from "@/components/CareerApplyForm";
import OpsPageHero from "@/components/ops/OpsPageHero";
import OpsSectionHead from "@/components/ops/OpsSectionHead";
import OpsStatusPanel from "@/components/ops/OpsStatusPanel";
import { getDictionary, localizeJobs } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { jobTypeLabel, listJobs } from "@/lib/careers";
import { getPagesOps } from "@/lib/pages-ops";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Security Guard Jobs in Dubai | Careers at AGOC Security",
  description:
    "Security guard jobs in Dubai with AGOC Security. Apply for security guard, supervisor, CCTV operator, female officer and facility roles with a licensed UAE company that trains and supervises every post.",
  path: "/careers",
  keywords: [
    "security guard jobs Dubai",
    "security jobs UAE",
    "CCTV operator jobs Dubai",
    "female security guard jobs Dubai",
    "security supervisor jobs Dubai",
    "AGOC careers",
  ],
});

const WHY_ICONS = [ShieldCheck, GraduationCap, Wallet, Clock];

export default async function CareersPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const p = getPagesOps(locale);
  const jobsRaw = await listJobs();
  const jobs = localizeJobs(jobsRaw, locale);
  const roleParam = params.role?.trim() || "";
  const defaultJobId =
    jobsRaw.find((job) => job.id === roleParam)?.id ||
    jobsRaw.find((job) => job.title.toLowerCase() === roleParam.toLowerCase())?.id ||
    jobs.find((job) => job.title === roleParam)?.id ||
    "";

  return (
    <>
      <OpsPageHero
        eyebrow={dict.careers.eyebrow}
        title={dict.careers.title}
        text={dict.careers.text}
        primary={{ href: "#apply", label: dict.careers.apply }}
        secondary={{ href: "#open-roles", label: dict.careers.openRoles }}
        visual={
          <OpsStatusPanel
            title={p.careers.panelTitle}
            meta={p.careers.panelMeta}
            rows={p.careers.pipeline}
            badge={p.common.sample}
            numbered
          />
        }
      />

      <section className="ops-light py-20 md:py-24">
        <div className="mx-auto max-w-6xl px-5">
          <OpsSectionHead label={dict.careers.whyLabel} title={dict.careers.whyTitle} text={p.careers.whyText} />
          <div
            className={`mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 ${
              dict.careers.whyItems.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"
            }`}
          >
            {dict.careers.whyItems.map((item, i) => {
              const Icon = WHY_ICONS[i % WHY_ICONS.length];
              return (
                <Reveal key={item.title} delay={i * 80} className="h-full">
                  <article className="ops-tile h-full">
                    <span className="ops-icon-sq">
                      <Icon size={20} />
                    </span>
                    <h3 className="mt-5 text-[1.15rem] font-semibold tracking-[-0.01em] text-[#0B1F2A]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-[#4A5A6B]">{item.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section id="open-roles" className="ops-dark scroll-mt-28 py-20 md:py-28">
        <div className="mx-auto max-w-6xl px-5">
          <OpsSectionHead dark label={dict.careers.eyebrow} title={dict.careers.openRoles} text={p.careers.rolesText} />

          {jobs.length === 0 ? (
            <Reveal>
              <p className="ops-job mt-12 text-center text-[1rem] text-white/70">{dict.careers.noRoles}</p>
            </Reveal>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={(i % 2) * 90} className="h-full">
                  <article className="ops-job h-full">
                    <div className="flex flex-wrap gap-2">
                      <span className="ops-job-chip">
                        <Briefcase size={13} />
                        {job.department}
                      </span>
                      <span className="ops-job-chip">
                        <MapPin size={13} />
                        {job.location}
                      </span>
                      <span className="ops-job-chip ops-job-chip-gold">{jobTypeLabel(job.type, locale)}</span>
                    </div>
                    <h3 className="mt-5 text-[1.45rem] font-semibold tracking-[-0.015em] text-white">{job.title}</h3>
                    {job.description ? (
                      <p className="mt-3 text-[0.97rem] leading-relaxed text-white/70">{job.description}</p>
                    ) : null}
                    {job.requirements.length > 0 ? (
                      <div className="mt-6">
                        <p className="ops-mono text-[0.68rem] tracking-[0.18em] text-[#C9A227] uppercase rtl:tracking-normal">
                          {dict.careers.requirements}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {job.requirements.map((req) => (
                            <li key={req} className="flex gap-3 text-[0.94rem] text-white/85">
                              <span className="ops-feature-check mt-0.5 bg-white/10 text-[#7FB2FF]">
                                <Check size={12} strokeWidth={3} />
                              </span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                    <div className="mt-auto pt-7">
                      <a href={`?role=${encodeURIComponent(job.id)}#apply`} className="ops-btn ops-btn-primary">
                        {dict.careers.apply}
                        <ArrowRight size={16} className="rtl:rotate-180" />
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
              {jobs.length % 2 === 1 ? (
                <Reveal delay={90} className="h-full">
                  <article className="ops-job ops-job-open h-full">
                    <span className="ops-trust-icon">
                      <Sparkles size={22} />
                    </span>
                    <h3 className="mt-6 text-[1.45rem] font-semibold tracking-[-0.015em] text-white">
                      {p.careers.openTitle}
                    </h3>
                    <p className="mt-3 max-w-md text-[0.97rem] leading-relaxed text-white/70">{p.careers.openText}</p>
                    <div className="mt-auto pt-7">
                      <a href="#apply" className="ops-btn ops-btn-glass">
                        {p.careers.openCta}
                        <ArrowRight size={16} className="rtl:rotate-180" />
                      </a>
                    </div>
                  </article>
                </Reveal>
              ) : null}
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="ops-light scroll-mt-28 py-20 md:py-28">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <Reveal className="lg:sticky lg:top-32">
            <div>
              <OpsSectionHead label={dict.careers.apply} title={dict.careers.applyTitle} text={dict.careers.applyText} />
              <div className="mt-10">
                <p className="ops-mono text-[0.68rem] tracking-[0.2em] text-[#8593A3] uppercase rtl:tracking-normal">
                  {p.careers.nextTitle}
                </p>
                <ol className="ops-next mt-4">
                  {p.careers.nextSteps.map((step, i) => (
                    <li key={step.title} className="ops-next-item">
                      <span className="ops-next-num">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block text-[1rem] font-semibold text-[#0B1F2A]">{step.title}</span>
                        <span className="mt-1 block text-[0.92rem] leading-relaxed text-[#4A5A6B]">{step.text}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="ops-form contact-form-panel p-5 sm:p-7 md:p-8">
              <CareerApplyForm jobs={jobs} dict={dict} defaultJobId={defaultJobId} />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
