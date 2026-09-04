import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { addApplication, getJob } from "@/lib/careers";
import { saveApplicationCv } from "@/lib/cv-server";
import { mailConfigured, sendCareerApplicationEmail } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const jobId = String(form.get("jobId") || "").trim();
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const experience = String(form.get("experience") || "").trim();
    const message = String(form.get("message") || "").trim();
    const cvField = form.get("cv");

    if (!jobId || !name || !email || !phone || !experience || !message) {
      return NextResponse.json(
        { ok: false, error: "Please complete every field." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const job = await getJob(jobId);
    if (!job || job.hidden) {
      return NextResponse.json(
        { ok: false, error: "That role is no longer open." },
        { status: 400 },
      );
    }

    let cvStoredName: string | undefined;
    let cvOriginalName: string | undefined;
    if (cvField instanceof File && cvField.size > 0) {
      try {
        const saved = await saveApplicationCv(cvField);
        cvStoredName = saved.storedName;
        cvOriginalName = saved.originalName;
      } catch (err) {
        return NextResponse.json(
          {
            ok: false,
            error: err instanceof Error ? err.message : "Could not save CV.",
          },
          { status: 400 },
        );
      }
    }

    await addApplication({
      jobId: job.id,
      jobTitle: job.title,
      name,
      email,
      phone,
      experience,
      message,
      ...(cvStoredName
        ? { cvStoredName, cvOriginalName: cvOriginalName || "cv.pdf" }
        : {}),
    });

    revalidatePath("/admin/careers");
    revalidatePath("/admin");

    let emailed = false;
    if (mailConfigured()) {
      try {
        await sendCareerApplicationEmail({
          name,
          email,
          phone,
          jobTitle: job.title,
          experience,
          message: cvOriginalName
            ? `${message}\n\n(CV attached: ${cvOriginalName})`
            : message,
        });
        emailed = true;
      } catch (err) {
        console.error("[careers] application saved but email failed:", err);
      }
    }

    return NextResponse.json({ ok: true, emailed });
  } catch (err) {
    console.error("[careers] apply failed:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to send your application right now." },
      { status: 500 },
    );
  }
}
