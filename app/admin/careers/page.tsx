import { listApplications, listJobs } from "@/lib/careers";
import CareersJobsManager from "./CareersJobsManager";
import ApplicationsTable from "./ApplicationsTable";

export default async function AdminCareersPage() {
  const [jobs, applications] = await Promise.all([
    listJobs({ includeHidden: true }),
    listApplications(),
  ]);
  const fresh = applications.filter((item) => item.status === "new").length;

  return (
    <div>
      <p className="olive-label text-sm font-semibold tracking-[0.3em] text-olive uppercase">
        Hiring
      </p>
      <h1 className="mt-4 font-display text-4xl text-sand">Careers</h1>
      <p className="mt-2 max-w-2xl text-mist">
        Manage open roles on the public careers page, and review applications
        from candidates.
      </p>

      <section className="mt-10">
        <h2 className="font-display text-3xl text-sand">Open roles</h2>
        <p className="mt-1 text-sm text-mist">
          These appear on <span className="text-sand">/careers</span> unless
          hidden.
        </p>
        <div className="mt-5">
          <CareersJobsManager initialJobs={jobs} />
        </div>
      </section>

      <section className="mt-14">
        <h2 className="font-display text-3xl text-sand">Applications</h2>
        <p className="mt-1 text-sm text-mist">
          {fresh} new · {applications.length} total
        </p>
        <ApplicationsTable items={applications} />
      </section>
    </div>
  );
}
