/** Free EN→AR via Google Translate (no API key). Server-only. */

export async function translateToAr(text: string): Promise<string> {
  const input = text.trim();
  if (!input) return "";

  try {
    const url =
      "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ar&dt=t&q=" +
      encodeURIComponent(input);
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 0 },
    });
    if (!response.ok) throw new Error(`Translate HTTP ${response.status}`);
    const data = (await response.json()) as unknown;
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      throw new Error("Unexpected translate response");
    }
    const parts = data[0] as unknown[];
    const out = parts
      .map((chunk) =>
        Array.isArray(chunk) && typeof chunk[0] === "string" ? chunk[0] : "",
      )
      .join("")
      .trim();
    return out || input;
  } catch {
    // MyMemory fallback
    try {
      const url =
        "https://api.mymemory.translated.net/get?langpair=en|ar&q=" +
        encodeURIComponent(input.slice(0, 450));
      const response = await fetch(url, { next: { revalidate: 0 } });
      if (!response.ok) return input;
      const data = (await response.json()) as {
        responseData?: { translatedText?: string };
      };
      const out = data.responseData?.translatedText?.trim();
      return out && out !== input ? out : input;
    } catch {
      return input;
    }
  }
}

export async function translateLinesToAr(lines: string[]): Promise<string[]> {
  const out: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    out.push(await translateToAr(trimmed));
  }
  return out;
}

export type JobEnFields = {
  title: string;
  department: string;
  location: string;
  summary: string;
  description: string;
  requirements: string[];
};

export type JobArFields = {
  titleAr: string;
  departmentAr: string;
  locationAr: string;
  summaryAr: string;
  descriptionAr: string;
  requirementsAr: string[];
};

/** Translate all English job fields to Arabic (sequential to avoid rate limits). */
export async function translateJobToAr(fields: JobEnFields): Promise<JobArFields> {
  const titleAr = await translateToAr(fields.title);
  const departmentAr = await translateToAr(fields.department);
  const locationAr = await translateToAr(fields.location);
  const summaryAr = await translateToAr(fields.summary);
  const descriptionAr = await translateToAr(fields.description);
  const requirementsAr = await translateLinesToAr(fields.requirements);
  return {
    titleAr,
    departmentAr,
    locationAr,
    summaryAr,
    descriptionAr,
    requirementsAr,
  };
}
