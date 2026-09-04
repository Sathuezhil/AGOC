import { randomUUID } from "crypto";

export type JobType = "full-time" | "part-time" | "contract";

export type CareerJob = {
  id: string;
  title: string;
  department: string;
  location: string;
  type: JobType;
  summary: string;
  description: string;
  requirements: string[];
  /** Optional Arabic copy managed in admin — used on /ar/careers. */
  titleAr?: string;
  departmentAr?: string;
  locationAr?: string;
  summaryAr?: string;
  descriptionAr?: string;
  requirementsAr?: string[];
  hidden?: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type ApplicationStatus = "new" | "reviewed" | "shortlisted" | "closed";

export type CareerApplication = {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  experience: string;
  message: string;
  status: ApplicationStatus;
  createdAt: string;
  /** Optional PDF CV stored on disk (not public). */
  cvStoredName?: string;
  cvOriginalName?: string;
};

function stripMongo<T extends { _id?: unknown }>(doc: T): Omit<T, "_id"> {
  const { _id: _unused, ...rest } = doc;
  void _unused;
  return rest;
}

export const DEFAULT_JOBS: Omit<
  CareerJob,
  "id" | "createdAt" | "updatedAt" | "sortOrder"
>[] = [
  {
    title: "Security Guard",
    titleAr: "حارس أمن",
    department: "Operations",
    departmentAr: "العمليات",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "full-time",
    summary: "Licensed officers for residential, commercial, and private posts.",
    summaryAr: "ضباط مرخّصون للمواقع السكنية والتجارية والخاصة.",
    description:
      "Join AGOC as a security guard on active sites across Dubai. You will hold the post with discipline, report clearly, and work under a named supervisor.",
    descriptionAr:
      "انضم إلى AGOC كحارس أمن في مواقع نشطة في دبي. ستحافظ على الموقع بانضباط، وتقدّم تقارير واضحة، وتعمل تحت إشراف مشرف مسمّى.",
    requirements: [
      "Valid UAE security licence (or eligible to obtain)",
      "Clear background and professional presentation",
      "Ability to work day, night, or rotating shifts",
      "Good communication in English; Arabic is an advantage",
    ],
    requirementsAr: [
      "رخصة أمن إماراتية سارية (أو أهلية للحصول عليها)",
      "خلفية نظيفة ومظهر مهني",
      "القدرة على العمل نهاراً أو ليلاً أو بنوبات متناوبة",
      "تواصل جيد بالإنجليزية؛ والعربية ميزة إضافية",
    ],
  },
  {
    title: "Female Security Officer",
    titleAr: "ضابطة أمن نسائية",
    department: "Operations",
    departmentAr: "العمليات",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "full-time",
    summary: "Female officers for sites that need a professional women’s presence.",
    summaryAr: "ضابطات للمواقع التي تحتاج حضوراً نسائياً مهنياً.",
    description:
      "AGOC places female security officers on residential, medical, and education sites where a women’s presence is required — access control, visitor support, and calm professionalism.",
    descriptionAr:
      "تضع AGOC ضابطات أمن في المواقع السكنية والطبية والتعليمية حيث يلزم حضور نسائي — التحكم بالدخول، دعم الزوار، واحترافية هادئة.",
    requirements: [
      "Valid UAE security licence (or eligible to obtain)",
      "Discreet, respectful manner with residents and visitors",
      "Comfortable with access control and reporting",
      "English communication; Arabic is an advantage",
    ],
    requirementsAr: [
      "رخصة أمن إماراتية سارية (أو أهلية للحصول عليها)",
      "أسلوب متحفّظ ومحترم مع السكان والزوار",
      "راحة في التحكم بالدخول وإعداد التقارير",
      "تواصل بالإنجليزية؛ والعربية ميزة إضافية",
    ],
  },
  {
    title: "CCTV Operator",
    titleAr: "مشغّل كاميرات مراقبة",
    department: "Control Room",
    departmentAr: "غرفة التحكم",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "full-time",
    summary: "Live monitoring, alerts, and clear escalation from the control room.",
    summaryAr: "مراقبة مباشرة وتنبيهات وتصعيد واضح من غرفة التحكم.",
    description:
      "Watch the screens that matter. CCTV operators at AGOC monitor live feeds, raise alerts, log incidents, and stay linked to officers on the ground.",
    descriptionAr:
      "راقب الشاشات المهمة. مشغّلو CCTV في AGOC يتابعون البث المباشر، ويرفعون التنبيهات، ويسجّلون الحوادث، ويبقون على تواصل مع الضباط في الميدان.",
    requirements: [
      "Experience in CCTV / control-room operations preferred",
      "Strong attention to detail and calm under pressure",
      "Clear written and spoken English for logs and radio",
      "Willingness to work rotating control-room shifts",
    ],
    requirementsAr: [
      "خبرة في تشغيل CCTV / غرفة التحكم مفضّلة",
      "انتباه قوي للتفاصيل وهدوء تحت الضغط",
      "إنجليزية واضحة كتابةً ونطقاً للسجلات واللاسلكي",
      "الاستعداد للعمل بنوبات متناوبة في غرفة التحكم",
    ],
  },
  {
    title: "Housekeeping Staff",
    titleAr: "طاقم التدبير المنزلي",
    department: "Facilities",
    departmentAr: "المرافق",
    location: "Dubai, UAE",
    locationAr: "دبي، الإمارات",
    type: "full-time",
    summary: "Reliable housekeeping teams for compounds, offices, and facilities.",
    summaryAr: "فرق تدبير منزلي موثوقة للمجمعات والمكاتب والمرافق.",
    description:
      "Join AGOC’s housekeeping teams supporting residential compounds, offices, and commercial facilities — clean standards, consistent schedules, supervised shifts.",
    descriptionAr:
      "انضم إلى فرق التدبير المنزلي في AGOC لدعم المجمعات السكنية والمكاتب والمرافق التجارية — معايير نظافة، جداول ثابتة، ومناوبات بإشراف.",
    requirements: [
      "Previous housekeeping or facilities experience preferred",
      "Reliable attendance and attention to detail",
      "Ability to follow site checklists and schedules",
      "Teamwork under site supervision",
    ],
    requirementsAr: [
      "خبرة سابقة في التدبير المنزلي أو المرافق مفضّلة",
      "حضور موثوق واهتمام بالتفاصيل",
      "القدرة على اتباع قوائم التحقق والجداول في الموقع",
      "العمل الجماعي تحت إشراف الموقع",
    ],
  },
];

export async function listJobs(opts?: { includeHidden?: boolean }) {
  const { careersJobsCollection } = await import("./db");
  await ensureCareersSeeded();
  await ensureMissingArabic();
  const filter = opts?.includeHidden ? {} : { hidden: { $ne: true } };
  const docs = await (await careersJobsCollection())
    .find(filter)
    .sort({ sortOrder: 1, createdAt: -1 })
    .toArray();
  return docs.map((doc) => stripMongo(doc) as CareerJob);
}

export async function getJob(id: string) {
  const { careersJobsCollection } = await import("./db");
  await ensureCareersSeeded();
  const doc = await (await careersJobsCollection()).findOne({ id });
  if (!doc) return null;
  return stripMongo(doc) as CareerJob;
}

export async function createJob(
  input: Omit<CareerJob, "id" | "createdAt" | "updatedAt" | "sortOrder"> & {
    sortOrder?: number;
  },
) {
  const { careersJobsCollection } = await import("./db");
  await ensureCareersSeeded();
  const col = await careersJobsCollection();
  const count = await col.countDocuments();
  const now = new Date().toISOString();

  const title = input.title.trim();
  const department = input.department.trim();
  const location = input.location.trim() || "Dubai, UAE";
  const summary = input.summary.trim();
  const description = input.description.trim();
  const requirements = input.requirements.map((r) => r.trim()).filter(Boolean);

  const { translateJobToAr } = await import("./translate-ar");
  const ar = await translateJobToAr({
    title,
    department,
    location,
    summary,
    description,
    requirements,
  });

  const job: CareerJob = {
    id: randomUUID(),
    title,
    department,
    location,
    type: input.type,
    summary,
    description,
    requirements,
    ...ar,
    hidden: Boolean(input.hidden),
    sortOrder: typeof input.sortOrder === "number" ? input.sortOrder : count,
    createdAt: now,
    updatedAt: now,
  };
  await col.insertOne(job);
  return job;
}

export async function updateJob(
  id: string,
  patch: Partial<
    Pick<
      CareerJob,
      | "title"
      | "department"
      | "location"
      | "type"
      | "summary"
      | "description"
      | "requirements"
      | "hidden"
      | "sortOrder"
    >
  >,
) {
  const { careersJobsCollection } = await import("./db");
  await ensureCareersSeeded();
  const col = await careersJobsCollection();
  const existing = await col.findOne({ id });
  if (!existing) return null;

  const nextTitle =
    patch.title !== undefined ? patch.title.trim() : String(existing.title || "");
  const nextDepartment =
    patch.department !== undefined
      ? patch.department.trim()
      : String(existing.department || "");
  const nextLocation =
    patch.location !== undefined
      ? patch.location.trim()
      : String(existing.location || "Dubai, UAE");
  const nextSummary =
    patch.summary !== undefined
      ? patch.summary.trim()
      : String(existing.summary || "");
  const nextDescription =
    patch.description !== undefined
      ? patch.description.trim()
      : String(existing.description || "");
  const nextRequirements =
    patch.requirements !== undefined
      ? patch.requirements.map((r) => r.trim()).filter(Boolean)
      : ((existing.requirements as string[]) || []);

  const enChanged =
    patch.title !== undefined ||
    patch.department !== undefined ||
    patch.location !== undefined ||
    patch.summary !== undefined ||
    patch.description !== undefined ||
    patch.requirements !== undefined ||
    !existing.titleAr;

  const $set: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };
  if (patch.title !== undefined) $set.title = nextTitle;
  if (patch.department !== undefined) $set.department = nextDepartment;
  if (patch.location !== undefined) $set.location = nextLocation;
  if (patch.type !== undefined) $set.type = patch.type;
  if (patch.summary !== undefined) $set.summary = nextSummary;
  if (patch.description !== undefined) $set.description = nextDescription;
  if (patch.requirements !== undefined) $set.requirements = nextRequirements;
  if (patch.hidden !== undefined) $set.hidden = Boolean(patch.hidden);
  if (patch.sortOrder !== undefined) $set.sortOrder = patch.sortOrder;

  if (enChanged) {
    const { translateJobToAr } = await import("./translate-ar");
    const ar = await translateJobToAr({
      title: nextTitle,
      department: nextDepartment,
      location: nextLocation,
      summary: nextSummary,
      description: nextDescription,
      requirements: nextRequirements,
    });
    Object.assign($set, ar);
  }

  const result = await col.findOneAndUpdate(
    { id },
    { $set },
    { returnDocument: "after" },
  );
  if (!result) return null;
  return stripMongo(result) as CareerJob;
}

export async function deleteJob(id: string) {
  const { careersJobsCollection } = await import("./db");
  await ensureCareersSeeded();
  const result = await (await careersJobsCollection()).deleteOne({ id });
  return result.deletedCount > 0;
}

export async function listApplications() {
  const { careersApplicationsCollection } = await import("./db");
  await ensureCareersSeeded();
  const docs = await (await careersApplicationsCollection())
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return docs.map((doc) => stripMongo(doc) as CareerApplication);
}

export async function addApplication(
  input: Omit<CareerApplication, "id" | "status" | "createdAt">,
) {
  const { careersApplicationsCollection } = await import("./db");
  await ensureCareersSeeded();
  const application: CareerApplication = {
    id: randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
    ...input,
  };
  await (await careersApplicationsCollection()).insertOne(application);
  return application;
}

export async function updateApplication(
  id: string,
  patch: Partial<Pick<CareerApplication, "status">>,
) {
  const { careersApplicationsCollection } = await import("./db");
  await ensureCareersSeeded();
  const result = await (
    await careersApplicationsCollection()
  ).findOneAndUpdate({ id }, { $set: patch }, { returnDocument: "after" });
  if (!result) return null;
  return stripMongo(result) as CareerApplication;
}

export async function getApplication(id: string) {
  const { careersApplicationsCollection } = await import("./db");
  await ensureCareersSeeded();
  const doc = await (await careersApplicationsCollection()).findOne({ id });
  if (!doc) return null;
  return stripMongo(doc) as CareerApplication;
}

export async function deleteApplication(id: string) {
  const { careersApplicationsCollection } = await import("./db");
  await ensureCareersSeeded();
  const existing = await getApplication(id);
  const result = await (await careersApplicationsCollection()).deleteOne({ id });
  if (result.deletedCount > 0 && existing?.cvStoredName) {
    const { deleteApplicationCv } = await import("./cv-server");
    await deleteApplicationCv(existing.cvStoredName);
  }
  return result.deletedCount > 0;
}

let careersSeeded = false;
let careersSeeding: Promise<void> | null = null;
let arabicBackfillAttempted = false;
let arabicBackfilling: Promise<void> | null = null;

async function ensureCareersSeeded() {
  if (careersSeeded) return;
  if (careersSeeding) return careersSeeding;
  careersSeeding = (async () => {
    const { careersJobsCollection, ensureIndexes } = await import("./db");
    await ensureIndexes();
    const col = await careersJobsCollection();
    const count = await col.countDocuments();
    if (count === 0) {
      const now = new Date().toISOString();
      await col.insertMany(
        DEFAULT_JOBS.map((job, index) => ({
          ...job,
          id: randomUUID(),
          hidden: false,
          sortOrder: index,
          createdAt: now,
          updatedAt: now,
        })),
      );
    }
    careersSeeded = true;
  })();
  try {
    await careersSeeding;
  } finally {
    careersSeeding = null;
  }
}

/** Fill Arabic for jobs that only have English (once per process). */
async function ensureMissingArabic() {
  if (arabicBackfillAttempted) return;
  if (arabicBackfilling) return arabicBackfilling;
  arabicBackfilling = (async () => {
    const { careersJobsCollection } = await import("./db");
    const { translateJobToAr } = await import("./translate-ar");
    const col = await careersJobsCollection();
    const seedByTitle = new Map(DEFAULT_JOBS.map((job) => [job.title, job]));
    const docs = await col
      .find({
        $or: [
          { titleAr: { $exists: false } },
          { titleAr: null },
          { titleAr: "" },
        ],
      })
      .toArray();

    for (const doc of docs) {
      const seed = seedByTitle.get(String(doc.title || ""));
      if (seed?.titleAr) {
        await col.updateOne(
          { id: doc.id },
          {
            $set: {
              titleAr: seed.titleAr || "",
              departmentAr: seed.departmentAr || "",
              locationAr: seed.locationAr || "",
              summaryAr: seed.summaryAr || "",
              descriptionAr: seed.descriptionAr || "",
              requirementsAr: seed.requirementsAr || [],
            },
          },
        );
        continue;
      }
      try {
        const ar = await translateJobToAr({
          title: String(doc.title || ""),
          department: String(doc.department || ""),
          location: String(doc.location || ""),
          summary: String(doc.summary || ""),
          description: String(doc.description || ""),
          requirements: (doc.requirements as string[]) || [],
        });
        await col.updateOne({ id: doc.id }, { $set: ar });
      } catch {
        // Public page falls back to English.
      }
    }
    arabicBackfillAttempted = true;
  })();
  try {
    await arabicBackfilling;
  } finally {
    arabicBackfilling = null;
  }
}

export function jobTypeLabel(type: JobType, locale: "en" | "ar" = "en") {
  if (locale === "ar") {
    if (type === "part-time") return "دوام جزئي";
    if (type === "contract") return "عقد";
    return "دوام كامل";
  }
  if (type === "part-time") return "Part-time";
  if (type === "contract") return "Contract";
  return "Full-time";
}
