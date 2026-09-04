import type { CareerJob } from "@/lib/careers";
import type { Locale } from "./config";

function pick(ar: string | undefined, en: string) {
  const t = ar?.trim();
  return t ? t : en;
}

/** Use admin Arabic fields when locale is AR; otherwise English. No hardcoded overrides. */
export function localizeJob(job: CareerJob, locale: Locale): CareerJob {
  if (locale !== "ar") return job;
  return {
    ...job,
    title: pick(job.titleAr, job.title),
    department: pick(job.departmentAr, job.department),
    location: pick(job.locationAr, job.location),
    summary: pick(job.summaryAr, job.summary),
    description: pick(job.descriptionAr, job.description),
    requirements:
      job.requirementsAr?.map((r) => r.trim()).filter(Boolean).length
        ? job.requirementsAr.map((r) => r.trim()).filter(Boolean)
        : job.requirements,
  };
}

export function localizeJobs(jobs: CareerJob[], locale: Locale): CareerJob[] {
  return jobs.map((job) => localizeJob(job, locale));
}
