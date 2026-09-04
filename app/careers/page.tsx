import type { Metadata } from "next";
import { Briefcase, MapPin, ShieldCheck } from "lucide-react";
import PageHero from "@/components/PageHero";
import Reveal from "@/components/Reveal";
import Card3D from "@/components/Card3D";
import CareerApplyForm from "@/components/CareerApplyForm";
import { getDictionary, localizeJobs } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { jobTypeLabel, listJobs } from "@/lib/careers";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Careers — Security Jobs in Dubai",
  description:
    "Join AGOC Security in Dubai. Apply for security guard, CCTV operator, female officer, and housekeeping roles with licensed UAE teams.",
  path: "/careers",
  keywords: [
    "security jobs Dubai",
    "security guard jobs UAE",
    "CCTV operator jobs Dubai",
    "AGOC careers",
    "hire security Dubai",
  ],
});

export default async function CareersPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const jobsRaw = await listJobs();
  const jobs = localizeJobs(jobsRaw, locale);
  const roleParam = params.role?.trim() || "";
  const defaultJobId =
    jobsRaw.find((job) => job.id === roleParam)?.id ||
    jobsRaw.find((job) => job.title.toLowerCase() === roleParam.toLowerCase())
      ?.id ||
    jobs.find((job) => job.title === roleParam)?.id ||
    "";

  return (
    <>
      <PageHero
        eyebrow={dict.careers.eyebrow}
        title={dict.careers.title}
        text={dict.careers.text}
        primaryHref="#apply"
        primaryLabel={dict.careers.apply}
        secondaryHref="#open-roles"
        secondaryLabel={dict.careers.openRoles}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal>
          <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
            {dict.careers.whyLabel}
          </p>
          <h2 className="mt-3 font-display text-3xl text-sand md:text-4xl">
            {dict.careers.whyTitle}
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {dict.careers.whyItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 80}>
              <Card3D intensity={8}>
                <article className="h-full border border-sand/10 bg-night/40 p-6">
                  <ShieldCheck className="text-crimson" size={22} />
                  <h3 className="mt-4 font-display text-2xl text-sand">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">
                    {item.text}
                  </p>
                </article>
              </Card3D>
            </Reveal>
          ))}
        </div>
      </section>

      <section
        id="open-roles"
        className="scroll-mt-28 bg-night py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
              {dict.careers.eyebrow}
            </p>
            <h2 className="mt-3 font-display text-3xl text-sand md:text-4xl">
              {dict.careers.openRoles}
            </h2>
          </Reveal>

          {jobs.length === 0 ? (
            <p className="mt-8 rounded-xl border border-dashed border-sand/15 bg-ink/30 p-8 text-sm text-mist">
              {dict.careers.noRoles}
            </p>
          ) : (
            <div className="mt-10 space-y-5">
              {jobs.map((job, i) => (
                <Reveal key={job.id} delay={i * 60}>
                  <article className="rounded-2xl border border-sand/10 bg-ink/30 p-5 md:p-7">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <h3 className="font-display text-2xl text-sand md:text-3xl">
                          {job.title}
                        </h3>
                        <div className="mt-3 flex flex-wrap gap-3 text-xs tracking-wide text-mist uppercase rtl:tracking-normal rtl:normal-case">
                          <span className="inline-flex items-center gap-1.5">
                            <Briefcase size={13} className="text-olive" />
                            {job.department}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={13} className="text-olive" />
                            {job.location}
                          </span>
                          <span className="rounded-full border border-olive/30 px-2.5 py-0.5 text-olive">
                            {jobTypeLabel(job.type, locale)}
                          </span>
                        </div>
                        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-mist md:text-base">
                          {job.description}
                        </p>
                        {job.requirements.length > 0 && (
                          <div className="mt-5">
                            <p className="text-xs tracking-[0.16em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
                              {dict.careers.requirements}
                            </p>
                            <ul className="mt-2 space-y-1.5 text-sm text-sand/90">
                              {job.requirements.map((req) => (
                                <li key={req} className="flex gap-2">
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <a
                        href={`?role=${encodeURIComponent(job.id)}#apply`}
                        className="btn-shine inline-flex shrink-0 items-center justify-center self-start rounded-lg bg-crimson px-5 py-2.5 text-xs font-medium tracking-wide text-white uppercase hover:bg-crimson-dark rtl:tracking-normal rtl:normal-case"
                      >
                        {dict.careers.apply}
                      </a>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="apply" className="scroll-mt-28 mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase rtl:tracking-normal rtl:normal-case">
              {dict.careers.apply}
            </p>
            <h2 className="mt-3 font-display text-3xl text-sand md:text-4xl">
              {dict.careers.applyTitle}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-mist md:text-base">
              {dict.careers.applyText}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <div className="contact-form-panel rounded-2xl border border-sand/10 bg-night/40 p-5 md:p-7">
              <CareerApplyForm
                jobs={jobs}
                dict={dict}
                defaultJobId={defaultJobId}
              />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
