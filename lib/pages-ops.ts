import type { Locale } from "./i18n/config";
import type { OpsTone } from "./home-ops";

export type OpsStep = { title: string; text: string };
export type OpsStatusRow = { label: string; meta: string; tag: string; tone: OpsTone };

export type ServiceCategory = "security" | "facility" | "cleaning";

/** Built-in services grouped for the Services page filter; new admin services fall under "All". */
export const SERVICE_CATEGORY: Record<string, ServiceCategory> = {
  "private-guarding": "security",
  "lady-security-guard": "security",
  "personal-security": "security",
  "cctv-control": "security",
  "events-club-bouncer": "security",
  "parking-control": "security",
  lifeguard: "security",
  "facility-management": "facility",
  housekeeping: "facility",
  "pet-care": "facility",
  "ironing-laundry": "facility",
  "building-cleaning": "cleaning",
  "deep-cleaning": "cleaning",
  "residential-cleaning": "cleaning",
  "apartment-villa-cleaning": "cleaning",
  "commercial-cleaning": "cleaning",
  "corporate-office-cleaning": "cleaning",
  "vacation-rental-airbnb": "cleaning",
  "move-in-move-out": "cleaning",
  "post-construction-cleaning": "cleaning",
  "sofa-mattress-cleaning": "cleaning",
  "kitchen-bath-sanitization": "cleaning",
  "disinfection-sanitization": "cleaning",
};

export type PagesOps = {
  common: {
    whatsapp: string;
    call: string;
    sample: string;
  };
  process: { label: string; title: string; accent: string; text: string; steps: OpsStep[] };
  ctaBand: { title: string; accent: string; text: string; primary: string };
  about: {
    chips: string[];
    officeCard: { title: string; meta: string };
    sitesLabel: string;
    sites: string[];
    missionLabel: string;
    valuesLabel: string;
    leadershipEyebrow: string;
    quoteFrom: string;
    stayLabel: string;
  };
  services: {
    filterLabel: string;
    filters: { id: "all" | ServiceCategory; label: string }[];
    count: string;
    book: string;
    heroPanelTitle: string;
    heroPanelRows: OpsStatusRow[];
  };
  serviceDetail: {
    heroCard: OpsStatusRow[];
    includedText: string;
    galleryText: string;
    otherText: string;
  };
  careers: {
    panelTitle: string;
    panelMeta: string;
    pipeline: OpsStatusRow[];
    whyText: string;
    rolesText: string;
    nextTitle: string;
    nextSteps: OpsStep[];
    openTitle: string;
    openText: string;
    openCta: string;
  };
  contact: {
    quickTitle: string;
    quickText: string;
    infoLabel: string;
    infoTitle: string;
    nextLabel: string;
    nextTitle: string;
    nextAccent: string;
    nextSteps: OpsStep[];
    mapLabel: string;
    mapTitle: string;
    directions: string;
  };
  legal: {
    updated: string;
    contents: string;
    intro: string;
  };
};

const EN: PagesOps = {
  common: {
    whatsapp: "WhatsApp us",
    call: "Call us",
    sample: "Sample view",
  },
  process: {
    label: "How it starts",
    title: "From first call",
    accent: "to first shift.",
    text: "Hiring a security company in Dubai should be simple. Four steps, one named contact, no surprises.",
    steps: [
      { title: "Tell us the site", text: "Address, hours, risks and what worries you. A short call or form is enough." },
      { title: "Site survey", text: "A supervisor visits, walks the site and notes entrances, blind spots and routines." },
      { title: "Clear proposal", text: "Guard numbers, shifts, patrol plan and price, in writing and easy to compare." },
      { title: "On post and reporting", text: "Licensed guards start on the agreed date and you get a report every morning." },
    ],
  },
  ctaBand: {
    title: "Ready when",
    accent: "you are.",
    text: "Tell us the site, the hours and the risk. We will come back with a clear plan for your property in Dubai.",
    primary: "Get a security quote",
  },
  about: {
    chips: ["Licensed in Dubai", "24/7 operations", "Verified staff", "Founder-led"],
    officeCard: { title: "AGOC head office", meta: "Office 315, Al Mulla 1 · Al Muteena, Dubai" },
    sitesLabel: "Where we work",
    sites: ["Residential compounds", "Commercial towers", "Hotels", "Hospitals", "Warehouses", "Private households"],
    missionLabel: "What drives us",
    valuesLabel: "Our standard",
    leadershipEyebrow: "Leadership",
    quoteFrom: "A message from",
    stayLabel: "Why clients stay",
  },
  services: {
    filterLabel: "Filter services",
    filters: [
      { id: "all", label: "All services" },
      { id: "security", label: "Security" },
      { id: "facility", label: "Facility & housekeeping" },
      { id: "cleaning", label: "Cleaning" },
    ],
    count: "services",
    book: "Book",
    heroPanelTitle: "Most requested in Dubai",
    heroPanelRows: [
      { label: "Private guarding", meta: "Towers · villas · offices", tag: "24/7", tone: "live" },
      { label: "CCTV monitoring", meta: "Control room operators", tag: "Live", tone: "ok" },
      { label: "Lady security guard", meta: "Families · clinics · events", tag: "Available", tone: "info" },
      { label: "Event security", meta: "Venues · clubs · launches", tag: "On request", tone: "warn" },
    ],
  },
  serviceDetail: {
    heroCard: [
      { label: "Coverage", meta: "Dubai and the UAE", tag: "Available", tone: "ok" },
      { label: "Supervision", meta: "Named site supervisor", tag: "Every shift", tone: "live" },
      { label: "Reporting", meta: "Daily occurrence report", tag: "07:00", tone: "info" },
    ],
    includedText: "Every contract is written for the site, but these come as standard.",
    galleryText: "Real teams, real posts across Dubai.",
    otherText: "Most clients combine two or three services under one contract.",
  },
  careers: {
    panelTitle: "Your application",
    panelMeta: "Security guard · Dubai",
    pipeline: [
      { label: "Application received", meta: "Today", tag: "Done", tone: "ok" },
      { label: "Reviewed by operations", meta: "Experience and documents", tag: "Next", tone: "live" },
      { label: "Interview", meta: "At our Al Muteena office", tag: "Planned", tone: "info" },
      { label: "Briefing and first post", meta: "Licensing and site briefing", tag: "Soon", tone: "warn" },
    ],
    whyText: "Security jobs in Dubai with a licensed company that trains, supervises and pays on time.",
    rolesText: "Current openings for security guards, supervisors, CCTV operators and facility staff.",
    nextTitle: "What happens next",
    nextSteps: [
      { title: "We read every application", text: "Operations reviews your experience and the role you chose." },
      { title: "Interview", text: "Shortlisted candidates are called for an interview at our office." },
      { title: "Briefing", text: "Licensing checks and a site briefing before your first shift." },
    ],
    openTitle: "Don't see your role?",
    openText: "Send a general application. We keep strong candidates on file for upcoming security, facility and cleaning posts in Dubai.",
    openCta: "Send a general application",
  },
  contact: {
    quickTitle: "Talk to operations",
    quickText: "The fastest way to get security in Dubai is a short call or WhatsApp.",
    infoLabel: "Office",
    infoTitle: "Visit or call AGOC",
    nextLabel: "After you send",
    nextTitle: "What happens",
    nextAccent: "next.",
    nextSteps: [
      { title: "We call you back", text: "Usually within one business day, to understand the site and the hours." },
      { title: "We visit the site", text: "A supervisor checks entrances, routines and risks in person." },
      { title: "You get a clear proposal", text: "Guards, shifts and price in writing. No catalogue, no pressure." },
    ],
    mapLabel: "Find us",
    mapTitle: "Al Muteena, Deira, Dubai",
    directions: "Get directions",
  },
  legal: {
    updated: "Last updated 2026",
    contents: "On this page",
    intro: "Questions about this page? Write to us and a member of the team will reply.",
  },
};

const AR: PagesOps = {
  common: {
    whatsapp: "راسلنا واتساب",
    call: "اتصل بنا",
    sample: "عرض توضيحي",
  },
  process: {
    label: "كيف نبدأ",
    title: "من أول مكالمة",
    accent: "إلى أول وردية.",
    text: "التعاقد مع شركة أمن في دبي يجب أن يكون بسيطاً. أربع خطوات، وجهة تواصل واحدة، وبلا مفاجآت.",
    steps: [
      { title: "أخبرنا عن الموقع", text: "العنوان والساعات والمخاطر وما يقلقك. مكالمة قصيرة أو نموذج يكفي." },
      { title: "معاينة الموقع", text: "يزور المشرف الموقع ويسجل المداخل والنقاط العمياء والروتين." },
      { title: "عرض واضح", text: "عدد الحراس والورديات وخطة الجولات والسعر، مكتوبة وسهلة المقارنة." },
      { title: "في الموقع مع التقارير", text: "يبدأ الحراس المرخّصون في الموعد المتفق عليه وتصلك التقارير كل صباح." },
    ],
  },
  ctaBand: {
    title: "جاهزون",
    accent: "متى ما كنت جاهزاً.",
    text: "أخبرنا بالموقع والساعات والمخاطر. سنعود إليك بخطة واضحة لعقارك في دبي.",
    primary: "اطلب عرض أمن",
  },
  about: {
    chips: ["مرخّصة في دبي", "عمليات 24/7", "طاقم موثّق", "بقيادة المؤسس"],
    officeCard: { title: "المكتب الرئيسي لـ AGOC", meta: "مكتب 315، الملا 1 · المطينة، دبي" },
    sitesLabel: "أين نعمل",
    sites: ["مجمعات سكنية", "أبراج تجارية", "فنادق", "مستشفيات", "مستودعات", "منازل خاصة"],
    missionLabel: "ما يحرّكنا",
    valuesLabel: "معيارنا",
    leadershipEyebrow: "القيادة",
    quoteFrom: "رسالة من",
    stayLabel: "لماذا يبقى العملاء",
  },
  services: {
    filterLabel: "تصفية الخدمات",
    filters: [
      { id: "all", label: "كل الخدمات" },
      { id: "security", label: "الأمن" },
      { id: "facility", label: "المرافق والتدبير" },
      { id: "cleaning", label: "التنظيف" },
    ],
    count: "خدمة",
    book: "احجز",
    heroPanelTitle: "الأكثر طلباً في دبي",
    heroPanelRows: [
      { label: "الحراسة الخاصة", meta: "أبراج · فلل · مكاتب", tag: "24/7", tone: "live" },
      { label: "مراقبة الكاميرات", meta: "مشغلو غرفة التحكم", tag: "مباشر", tone: "ok" },
      { label: "حارسة أمن", meta: "عائلات · عيادات · فعاليات", tag: "متاحة", tone: "info" },
      { label: "أمن الفعاليات", meta: "قاعات · أندية · افتتاحات", tag: "عند الطلب", tone: "warn" },
    ],
  },
  serviceDetail: {
    heroCard: [
      { label: "التغطية", meta: "دبي والإمارات", tag: "متاحة", tone: "ok" },
      { label: "الإشراف", meta: "مشرف موقع مسمّى", tag: "كل وردية", tone: "live" },
      { label: "التقارير", meta: "تقرير الأحداث اليومي", tag: "07:00", tone: "info" },
    ],
    includedText: "كل عقد يُكتب حسب الموقع، لكن هذه البنود أساسية دائماً.",
    galleryText: "فرق حقيقية في مواقع حقيقية في دبي.",
    otherText: "معظم العملاء يجمعون خدمتين أو ثلاث في عقد واحد.",
  },
  careers: {
    panelTitle: "طلبك",
    panelMeta: "حارس أمن · دبي",
    pipeline: [
      { label: "استلام الطلب", meta: "اليوم", tag: "تم", tone: "ok" },
      { label: "مراجعة العمليات", meta: "الخبرة والمستندات", tag: "التالي", tone: "live" },
      { label: "المقابلة", meta: "في مكتبنا بالمطينة", tag: "مجدولة", tone: "info" },
      { label: "الإحاطة وأول موقع", meta: "الترخيص وإحاطة الموقع", tag: "قريباً", tone: "warn" },
    ],
    whyText: "وظائف أمن في دبي مع شركة مرخّصة تدرّب وتشرف وتدفع في الموعد.",
    rolesText: "وظائف متاحة لحراس الأمن والمشرفين ومشغلي الكاميرات وطاقم المرافق.",
    nextTitle: "ماذا يحدث بعد ذلك",
    nextSteps: [
      { title: "نقرأ كل طلب", text: "تراجع العمليات خبرتك والوظيفة التي اخترتها." },
      { title: "المقابلة", text: "يُدعى المرشحون المختارون لمقابلة في مكتبنا." },
      { title: "الإحاطة", text: "فحص الترخيص وإحاطة بالموقع قبل أول وردية." },
    ],
    openTitle: "لا تجد وظيفتك؟",
    openText: "أرسل طلباً عاماً. نحتفظ بالمرشحين الجيدين للمواقع القادمة في الأمن والمرافق والتنظيف.",
    openCta: "أرسل طلباً عاماً",
  },
  contact: {
    quickTitle: "تحدث مع العمليات",
    quickText: "أسرع طريقة للحصول على الأمن في دبي هي مكالمة قصيرة أو رسالة واتساب.",
    infoLabel: "المكتب",
    infoTitle: "زر أو اتصل بـ AGOC",
    nextLabel: "بعد الإرسال",
    nextTitle: "ماذا يحدث",
    nextAccent: "بعد ذلك.",
    nextSteps: [
      { title: "نعاود الاتصال بك", text: "عادة خلال يوم عمل واحد، لفهم الموقع والساعات." },
      { title: "نزور الموقع", text: "يتحقق المشرف من المداخل والروتين والمخاطر بنفسه." },
      { title: "تحصل على عرض واضح", text: "الحراس والورديات والسعر كتابياً. بلا كتالوج وبلا ضغط." },
    ],
    mapLabel: "موقعنا",
    mapTitle: "المطينة، ديرة، دبي",
    directions: "الاتجاهات",
  },
  legal: {
    updated: "آخر تحديث 2026",
    contents: "في هذه الصفحة",
    intro: "أسئلة حول هذه الصفحة؟ راسلنا وسيرد أحد أعضاء الفريق.",
  },
};

export function getPagesOps(locale: Locale): PagesOps {
  return locale === "ar" ? AR : EN;
}

const ACCENT_SKIP = new Set(["a", "an", "of", "and", "&", "to", "for", "with", "in", "on", "at", "و", "في", "من", "بـ", "ب", "مع"]);

/** Splits a headline so the last words can carry the accent gradient. */
export function splitAccent(title: string, words = 2): [string, string] {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return ["", title.trim()];
  let take = Math.min(words, parts.length - 1);
  while (take > 1 && ACCENT_SKIP.has(parts[parts.length - take].toLowerCase())) take -= 1;
  return [parts.slice(0, -take).join(" "), parts.slice(-take).join(" ")];
}
