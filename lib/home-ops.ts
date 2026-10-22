import type { Locale } from "./i18n/config";

export type OpsTone = "ok" | "live" | "warn" | "info";

export type OpsFloatCard = {
  icon: "guard" | "cctv" | "facility" | "event";
  title: string;
  meta: string;
  tag: string;
  tone: OpsTone;
};

export type OpsRow = { code: string; title: string; meta: string; tag: string; tone: OpsTone };

export type OpsTab = {
  id: "deploy" | "patrol" | "report";
  label: string;
  listTitle: string;
  rows: OpsRow[];
  detail: {
    kicker: string;
    title: string;
    meta: string;
    checklistTitle: string;
    checklist: { text: string; state: string; tone: OpsTone }[];
    action: string;
    note: string;
  };
};

export type OpsFeature = {
  slug: string;
  kicker: string;
  title: string;
  text: string;
  bullets: string[];
  visual: { label: string; value: string; tone: OpsTone }[];
};

export type OpsTimelineRow = {
  label: string;
  kind: "span" | "dots";
  /** Hours from 07:00 (0–24). */
  from?: number;
  to?: number;
  points?: number[];
  tone: "blue" | "navy" | "gold" | "sky";
};

export type HomeOps = {
  hero: {
    badge: string;
    serviceBadges: string[];
    title: string;
    accent: string;
    text: string;
    primary: string;
    secondary: string;
    scroll: string;
    cards: OpsFloatCard[];
  };
  statement: { lead: string; turn: string; chips: { title: string; meta: string }[] };
  demo: {
    label: string;
    title: string;
    accent: string;
    text: string;
    sample: string;
    pause: string;
    play: string;
    site: string;
    siteMeta: string;
    nav: { label: string; count: string }[];
    supervisor: string;
    supervisorRole: string;
    tabs: OpsTab[];
  };
  features: {
    label: string;
    title: string;
    accent: string;
    more: string;
    items: OpsFeature[];
  };
  timeline: {
    label: string;
    title: string;
    accent: string;
    text: string;
    bullets: string[];
    panelTitle: string;
    panelMeta: string;
    hours: string[];
    rows: OpsTimelineRow[];
  };
  report: {
    label: string;
    title: string;
    accent: string;
    text: string;
    bullets: string[];
    phone: {
      time: string;
      inbox: string;
      from: string;
      subject: string;
      preview: string;
      sentAt: string;
      greeting: string;
      stats: { label: string; value: string }[];
      noteTitle: string;
      note: string;
      footer: string;
      read: string;
    };
  };
  compare: {
    label: string;
    title: string;
    accent: string;
    text: string;
    hint: string;
    left: { tag: string; title: string; text: string; items: string[]; foot: string };
    right: { tag: string; title: string; text: string; items: string[]; foot: string };
  };
  trust: {
    label: string;
    title: string;
    accent: string;
    items: { value: string; title: string; text: string }[];
    footnote: string;
  };
  servicesIntro: { label: string; title: string; accent: string };
  clients: {
    label: string;
    title: string;
    accent: string;
    text: string;
  };
  cta: {
    title: string;
    accent: string;
    text: string;
    primary: string;
    whatsapp: string;
  };
};

const EN: HomeOps = {
  hero: {
    badge: "Sira certified licensed No.1308900 security company in Dubai",
    serviceBadges: ["Building cleaning services", "On call cleaning services"],
    title: "Every Post Covered.",
    accent: "Every Night Reported.",
    text: "Licensed security guards, CCTV monitoring and facility services for towers, villas, hotels and events across Dubai and the UAE. Planned by AGOC, supervised around the clock.",
    primary: "Get a security quote",
    secondary: "See how we work",
    scroll: "Scroll to see it run",
    cards: [
      { icon: "guard", title: "Private guarding", meta: "Towers · villas · offices", tag: "24/7", tone: "live" },
      { icon: "cctv", title: "CCTV control room", meta: "Live monitoring · Dubai", tag: "Live", tone: "ok" },
      { icon: "facility", title: "Facility management", meta: "Cleaning · upkeep · FM", tag: "Daily", tone: "warn" },
      { icon: "event", title: "Event security", meta: "Concerts · clubs · VIP", tag: "On call", tone: "info" },
    ],
  },
  statement: {
    lead: "Sites are rarely put at risk by the big night. They are put at risk by the empty post that nobody noticed.",
    turn: "So AGOC Security Services makes sure every post is filled, checked and reported.",
    chips: [
      { title: "Gate 2 checked", meta: "Al Barsha villa · 21:40" },
      { title: "Patrol logged", meta: "Tower B, levels 1–14" },
      { title: "Shift handover", meta: "Signed by supervisor" },
      { title: "Visitor pass issued", meta: "Reception · 09:12" },
      { title: "CCTV alert cleared", meta: "Loading bay · 02:05" },
      { title: "Daily report sent", meta: "Client inbox · 07:00" },
    ],
  },
  demo: {
    label: "How it runs",
    title: "One control room.",
    accent: "Every site. Every shift.",
    text: "A sample view of how AGOC plans and supervises security in Dubai: who is on post, which patrol rounds are done and what goes into your morning report.",
    sample: "Sample view",
    pause: "Pause the demo",
    play: "Play the demo",
    site: "Tower A · Business Bay",
    siteMeta: "Commercial tower · 24/7 cover",
    nav: [
      { label: "Sites", count: "24" },
      { label: "On duty", count: "86" },
      { label: "Patrols", count: "140" },
      { label: "Incidents", count: "2" },
      { label: "Reports", count: "24" },
    ],
    supervisor: "[SUPERVISOR NAME]",
    supervisorRole: "Site supervisor",
    tabs: [
      {
        id: "deploy",
        label: "Deployment",
        listTitle: "Posts tonight",
        rows: [
          { code: "GATE", title: "Main gate", meta: "19:00 – 07:00", tag: "2 guards", tone: "live" },
          { code: "LOBBY", title: "Lobby reception", meta: "24 hours", tag: "Lady guard", tone: "live" },
          { code: "B1", title: "Basement parking", meta: "Night patrol", tag: "On round", tone: "info" },
          { code: "DOCK", title: "Loading bay", meta: "06:00 – 18:00", tag: "Handover", tone: "warn" },
          { code: "POOL", title: "Pool deck", meta: "08:00 – 20:00", tag: "Lifeguard", tone: "ok" },
        ],
        detail: {
          kicker: "Night shift",
          title: "Main gate · Tower A",
          meta: "19:00 – 07:00 · 2 licensed guards",
          checklistTitle: "Before the shift starts",
          checklist: [
            { text: "Guards briefed on site rules", state: "Done", tone: "ok" },
            { text: "Uniform and licence checked", state: "Done", tone: "ok" },
            { text: "Handover log signed", state: "Done", tone: "ok" },
            { text: "Supervisor visit, 23:00", state: "Planned", tone: "warn" },
          ],
          action: "Relief guard on standby",
          note: "If a guard calls in sick, the relief is on post within the hour and you are told by message.",
        },
      },
      {
        id: "patrol",
        label: "Patrols",
        listTitle: "Rounds · tonight",
        rows: [
          { code: "20:00", title: "Perimeter round", meta: "12 of 12 checkpoints", tag: "Done", tone: "ok" },
          { code: "22:00", title: "Fire exits and stairs", meta: "18 of 18 checkpoints", tag: "Done", tone: "ok" },
          { code: "00:00", title: "Parking and basement", meta: "9 of 9 checkpoints", tag: "Done", tone: "ok" },
          { code: "02:00", title: "Full building round", meta: "9 of 12 checkpoints", tag: "Live", tone: "live" },
          { code: "04:00", title: "Perimeter round", meta: "Scheduled", tag: "Next", tone: "info" },
        ],
        detail: {
          kicker: "Patrol in progress",
          title: "Full building round · 02:00",
          meta: "Guard on round · 9 of 12 checkpoints scanned",
          checklistTitle: "Found on this round",
          checklist: [
            { text: "Fire exits clear and closed", state: "OK", tone: "ok" },
            { text: "Roof door locked", state: "OK", tone: "ok" },
            { text: "Basement light out, level B2", state: "Logged", tone: "warn" },
            { text: "Maintenance ticket raised", state: "Sent", tone: "info" },
          ],
          action: "Issue sent to facility team",
          note: "Anything found on a round goes into the log with a time and photo, then to whoever needs to fix it.",
        },
      },
      {
        id: "report",
        label: "Reports",
        listTitle: "This morning",
        rows: [
          { code: "DOR", title: "Daily occurrence report", meta: "Tower A · 07:00", tag: "Sent", tone: "ok" },
          { code: "VIS", title: "Visitor log", meta: "148 entries", tag: "Attached", tone: "info" },
          { code: "CCTV", title: "Camera health check", meta: "64 of 64 online", tag: "Clear", tone: "ok" },
          { code: "INC", title: "Incident summary", meta: "No incidents", tag: "Clear", tone: "ok" },
          { code: "FM", title: "Faults for facility team", meta: "1 open item", tag: "Open", tone: "warn" },
        ],
        detail: {
          kicker: "Sent at 07:00",
          title: "Daily occurrence report",
          meta: "Tower A · written by the site supervisor",
          checklistTitle: "Inside the report",
          checklist: [
            { text: "Visitors and deliveries counted", state: "148 / 36", tone: "info" },
            { text: "Patrol rounds completed", state: "6 of 6", tone: "ok" },
            { text: "Incidents overnight", state: "None", tone: "ok" },
            { text: "Barrier slow at 18:40", state: "To FM", tone: "warn" },
          ],
          action: "Delivered to your inbox",
          note: "One short report every morning. Read it in a minute, reply if anything needs action.",
        },
      },
    ],
  },
  features: {
    label: "What we do",
    title: "Four kinds of protection.",
    accent: "One standard.",
    more: "See the service",
    items: [
      {
        slug: "private-guarding",
        kicker: "Security guard services",
        title: "Licensed guards, on time and in uniform.",
        text: "Licensed security guards for towers, compounds, hotels, hospitals and warehouses in Dubai, briefed for the site before the first shift.",
        bullets: ["Male and lady security guards", "Gate, lobby, patrol and access control", "Supervisor visit on every shift"],
        visual: [
          { label: "Main gate", value: "On post", tone: "live" },
          { label: "Lobby", value: "On post", tone: "live" },
          { label: "Patrol", value: "Round 4 of 6", tone: "info" },
        ],
      },
      {
        slug: "cctv-control",
        kicker: "CCTV monitoring",
        title: "Cameras that someone actually watches.",
        text: "CCTV control and monitoring in Dubai with trained operators who log, alert and follow up, not just record.",
        bullets: ["Live monitoring and alarm response", "Incident clips saved for review", "Daily camera health check"],
        visual: [
          { label: "Cameras online", value: "64 / 64", tone: "ok" },
          { label: "Alerts tonight", value: "1 checked", tone: "warn" },
          { label: "Operator", value: "Watching", tone: "live" },
        ],
      },
      {
        slug: "events-club-bouncer",
        kicker: "Event security",
        title: "Events and venues, without the drama.",
        text: "Event security and club bouncers in Dubai who manage queues, guest lists and crowds with a calm, firm hand.",
        bullets: ["Crowd and queue control", "VIP and personal protection", "Door teams for clubs and venues"],
        visual: [
          { label: "Guests in", value: "412", tone: "info" },
          { label: "Queue", value: "Moving", tone: "ok" },
          { label: "VIP entrance", value: "Covered", tone: "live" },
        ],
      },
      {
        slug: "facility-management",
        kicker: "Facility management",
        title: "Clean, maintained and secure.",
        text: "Facility management, building cleaning and housekeeping services in Dubai from the same team that guards the door.",
        bullets: ["Building and deep cleaning", "Housekeeping staff", "Parking control and lifeguards"],
        visual: [
          { label: "Lobby clean", value: "06:30", tone: "ok" },
          { label: "Washrooms", value: "Hourly", tone: "info" },
          { label: "Parking", value: "Controlled", tone: "live" },
        ],
      },
    ],
  },
  timeline: {
    label: "Coverage",
    title: "A full day,",
    accent: "already planned.",
    text: "Tell us the site and the hours. AGOC builds the roster, the patrol rounds and the supervisor visits for every day of the contract, then keeps it running.",
    bullets: ["Day, night and 24/7 security cover", "Relief guards for leave and sickness", "Roster changes with one call"],
    panelTitle: "Tower A · today",
    panelMeta: "07:00 to 07:00",
    hours: ["07:00", "11:00", "15:00", "19:00", "23:00", "03:00", "07:00"],
    rows: [
      { label: "Day shift", kind: "span", from: 0, to: 12, tone: "blue" },
      { label: "Night shift", kind: "span", from: 12, to: 24, tone: "navy" },
      { label: "CCTV monitoring", kind: "span", from: 0, to: 24, tone: "sky" },
      { label: "Patrol rounds", kind: "dots", points: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23], tone: "blue" },
      { label: "Supervisor visits", kind: "dots", points: [4, 16, 20], tone: "gold" },
      { label: "Morning report", kind: "dots", points: [24], tone: "gold" },
    ],
  },
  report: {
    label: "Reporting",
    title: "Your report,",
    accent: "before your coffee.",
    text: "Every morning the site supervisor sends a short occurrence report: who came in, what happened and what needs fixing. No chasing, no guessing.",
    bullets: ["Written by the supervisor on site", "Photos attached where it matters", "Faults passed to your facility team"],
    phone: {
      time: "07:02",
      inbox: "Inbox",
      from: "AGOC Operations",
      subject: "Daily report · Tower A",
      preview: "Quiet night. One fault passed to FM.",
      sentAt: "07:00",
      greeting: "Good morning. Here is last night at Tower A.",
      stats: [
        { label: "Visitors", value: "148" },
        { label: "Deliveries", value: "36" },
        { label: "Incidents", value: "0" },
      ],
      noteTitle: "Note",
      note: "Car park barrier slow at 18:40. Reported to your facility team.",
      footer: "Sent by AGOC Security, Dubai",
      read: "Read by client · 07:04",
    },
  },
  compare: {
    label: "Made for the site",
    title: "Built for towers.",
    accent: "Built for villas.",
    text: "A commercial tower and a family villa need different security. Drag to compare how AGOC Security Services plans each one.",
    hint: "Drag to compare",
    left: {
      tag: "Commercial",
      title: "Towers, offices and warehouses",
      text: "Access control, visitor logs and a visible team that keeps a busy building moving.",
      items: ["Lobby and gate security guards", "Visitor and contractor logs", "Loading bay and parking control", "CCTV control room"],
      foot: "Offices · malls · hotels · warehouses",
    },
    right: {
      tag: "Residential",
      title: "Villas, compounds and homes",
      text: "Discreet guards who know the family, the staff and the routine, and keep strangers out.",
      items: ["Discreet residential guards", "Lady security guards for families", "Night patrols of the grounds", "Housekeeping and cleaning"],
      foot: "Villas · compounds · apartments",
    },
  },
  trust: {
    label: "Why AGOC",
    title: "Licensed. Verified.",
    accent: "Accountable.",
    items: [
      { value: "Licensed", title: "Security company in Dubai", text: "Licensed to provide security guard services in Dubai, with documented procedures on every post." },
      { value: "24/7", title: "Operations line", text: "A real person answers, day and night, from Sunday through Saturday." },
      { value: "100%", title: "Verified staff", text: "Background checks, licensing and a site briefing before anyone wears the badge." },
    ],
    footnote: "AGOC General Security Guard Services LLC · Al Muteena, Dubai",
  },
  servicesIntro: {
    label: "All services",
    title: "Security and facility services",
    accent: "across Dubai.",
  },
  clients: {
    label: "Trusted by",
    title: "Clients who sleep",
    accent: "through the night.",
    text: "Towers, hotels, retail and facility groups across Dubai and the UAE that rely on AGOC security every day.",
  },
  cta: {
    title: "Hand over",
    accent: "the night shift.",
    text: "Tell us the site, the hours and the risk. We will come back with a clear security proposal for your property in Dubai.",
    primary: "Get a security quote",
    whatsapp: "WhatsApp",
  },
};

const AR: HomeOps = {
  hero: {
    badge: "شركة أمن مرخّصة في دبي",
    serviceBadges: ["خدمات تنظيف المباني", "خدمات تنظيف عند الطلب"],
    title: "كل موقع مُغطّى.",
    accent: "وكل ليلة بتقرير.",
    text: "حراس أمن مرخّصون ومراقبة كاميرات وخدمات مرافق للأبراج والفلل والفنادق والفعاليات في دبي والإمارات. تخطيط من AGOC وإشراف على مدار الساعة.",
    primary: "اطلب عرض أمن",
    secondary: "شاهد كيف نعمل",
    scroll: "مرّر لترى كيف يعمل",
    cards: [
      { icon: "guard", title: "الحراسة الخاصة", meta: "أبراج · فلل · مكاتب", tag: "24/7", tone: "live" },
      { icon: "cctv", title: "غرفة مراقبة الكاميرات", meta: "مراقبة مباشرة · دبي", tag: "مباشر", tone: "ok" },
      { icon: "facility", title: "إدارة المرافق", meta: "تنظيف · صيانة · خدمات", tag: "يومياً", tone: "warn" },
      { icon: "event", title: "أمن الفعاليات", meta: "حفلات · نوادٍ · كبار الشخصيات", tag: "عند الطلب", tone: "info" },
    ],
  },
  statement: {
    lead: "نادراً ما يتعرّض الموقع للخطر بسبب ليلة كبيرة. الخطر الحقيقي هو موقع حراسة فارغ لم يلاحظه أحد.",
    turn: "لذلك تتأكد AGOC أن كل موقع مشغول ومُراجَع وموثّق بتقرير.",
    chips: [
      { title: "فحص البوابة 2", meta: "فيلا البرشاء · 21:40" },
      { title: "تسجيل الدورية", meta: "البرج B، الطوابق 1–14" },
      { title: "تسليم الوردية", meta: "بتوقيع المشرف" },
      { title: "إصدار تصريح زائر", meta: "الاستقبال · 09:12" },
      { title: "معالجة تنبيه الكاميرا", meta: "منطقة التحميل · 02:05" },
      { title: "إرسال التقرير اليومي", meta: "بريد العميل · 07:00" },
    ],
  },
  demo: {
    label: "كيف نعمل",
    title: "غرفة تحكم واحدة.",
    accent: "كل موقع. كل وردية.",
    text: "عرض توضيحي لطريقة تخطيط AGOC للأمن في دبي والإشراف عليه: من في موقعه، وأي جولات أُنجزت، وماذا يتضمن تقرير الصباح.",
    sample: "عرض توضيحي",
    pause: "إيقاف العرض",
    play: "تشغيل العرض",
    site: "البرج A · الخليج التجاري",
    siteMeta: "برج تجاري · تغطية 24/7",
    nav: [
      { label: "المواقع", count: "24" },
      { label: "في الخدمة", count: "86" },
      { label: "الجولات", count: "140" },
      { label: "الحوادث", count: "2" },
      { label: "التقارير", count: "24" },
    ],
    supervisor: "[اسم المشرف]",
    supervisorRole: "مشرف الموقع",
    tabs: [
      {
        id: "deploy",
        label: "التوزيع",
        listTitle: "مواقع الليلة",
        rows: [
          { code: "GATE", title: "البوابة الرئيسية", meta: "19:00 – 07:00", tag: "حارسان", tone: "live" },
          { code: "LOBBY", title: "استقبال الردهة", meta: "24 ساعة", tag: "حارسة", tone: "live" },
          { code: "B1", title: "مواقف السرداب", meta: "دورية ليلية", tag: "في جولة", tone: "info" },
          { code: "DOCK", title: "منطقة التحميل", meta: "06:00 – 18:00", tag: "تسليم", tone: "warn" },
          { code: "POOL", title: "سطح المسبح", meta: "08:00 – 20:00", tag: "منقذ", tone: "ok" },
        ],
        detail: {
          kicker: "الوردية الليلية",
          title: "البوابة الرئيسية · البرج A",
          meta: "19:00 – 07:00 · حارسان مرخّصان",
          checklistTitle: "قبل بدء الوردية",
          checklist: [
            { text: "إحاطة الحراس بقواعد الموقع", state: "تم", tone: "ok" },
            { text: "فحص الزي والترخيص", state: "تم", tone: "ok" },
            { text: "توقيع سجل التسليم", state: "تم", tone: "ok" },
            { text: "زيارة المشرف، 23:00", state: "مجدولة", tone: "warn" },
          ],
          action: "حارس بديل على أهبة الاستعداد",
          note: "إذا اعتذر حارس بسبب المرض، يصل البديل خلال ساعة ونُبلغك برسالة.",
        },
      },
      {
        id: "patrol",
        label: "الجولات",
        listTitle: "جولات الليلة",
        rows: [
          { code: "20:00", title: "جولة المحيط", meta: "12 من 12 نقطة", tag: "تمت", tone: "ok" },
          { code: "22:00", title: "مخارج الطوارئ والسلالم", meta: "18 من 18 نقطة", tag: "تمت", tone: "ok" },
          { code: "00:00", title: "المواقف والسرداب", meta: "9 من 9 نقاط", tag: "تمت", tone: "ok" },
          { code: "02:00", title: "جولة كاملة للمبنى", meta: "9 من 12 نقطة", tag: "مباشر", tone: "live" },
          { code: "04:00", title: "جولة المحيط", meta: "مجدولة", tag: "التالية", tone: "info" },
        ],
        detail: {
          kicker: "جولة جارية",
          title: "جولة كاملة للمبنى · 02:00",
          meta: "الحارس في جولة · مسح 9 من 12 نقطة",
          checklistTitle: "ما وُجد في هذه الجولة",
          checklist: [
            { text: "مخارج الطوارئ سالكة ومغلقة", state: "سليم", tone: "ok" },
            { text: "باب السطح مقفل", state: "سليم", tone: "ok" },
            { text: "إنارة معطلة، الطابق B2", state: "مُسجّل", tone: "warn" },
            { text: "فتح طلب صيانة", state: "أُرسل", tone: "info" },
          ],
          action: "أُرسلت الملاحظة لفريق المرافق",
          note: "كل ما يُكتشف في الجولة يُسجّل بالوقت والصورة، ثم يُرسل لمن يجب أن يصلحه.",
        },
      },
      {
        id: "report",
        label: "التقارير",
        listTitle: "هذا الصباح",
        rows: [
          { code: "DOR", title: "تقرير الأحداث اليومي", meta: "البرج A · 07:00", tag: "أُرسل", tone: "ok" },
          { code: "VIS", title: "سجل الزوار", meta: "148 إدخالاً", tag: "مرفق", tone: "info" },
          { code: "CCTV", title: "فحص الكاميرات", meta: "64 من 64 تعمل", tag: "سليم", tone: "ok" },
          { code: "INC", title: "ملخص الحوادث", meta: "لا حوادث", tag: "سليم", tone: "ok" },
          { code: "FM", title: "أعطال لفريق المرافق", meta: "بند واحد مفتوح", tag: "مفتوح", tone: "warn" },
        ],
        detail: {
          kicker: "أُرسل الساعة 07:00",
          title: "تقرير الأحداث اليومي",
          meta: "البرج A · كتبه مشرف الموقع",
          checklistTitle: "محتوى التقرير",
          checklist: [
            { text: "عدد الزوار والتوصيلات", state: "148 / 36", tone: "info" },
            { text: "الجولات المنجزة", state: "6 من 6", tone: "ok" },
            { text: "حوادث الليلة", state: "لا يوجد", tone: "ok" },
            { text: "بطء الحاجز الساعة 18:40", state: "للمرافق", tone: "warn" },
          ],
          action: "وصل إلى بريدك",
          note: "تقرير قصير كل صباح. اقرأه في دقيقة، وردّ إذا احتاج شيء إلى إجراء.",
        },
      },
    ],
  },
  features: {
    label: "ماذا نقدّم",
    title: "أربعة أنواع من الحماية.",
    accent: "بمعيار واحد.",
    more: "تفاصيل الخدمة",
    items: [
      {
        slug: "private-guarding",
        kicker: "خدمات حراس الأمن",
        title: "حراس مرخّصون، في الموعد وبالزي الرسمي.",
        text: "حراس أمن مرخّصون للأبراج والمجمعات والفنادق والمستشفيات والمستودعات في دبي، مع إحاطة بالموقع قبل أول وردية.",
        bullets: ["حراس وحارسات أمن", "البوابات والردهات والدوريات والتحكم بالدخول", "زيارة مشرف في كل وردية"],
        visual: [
          { label: "البوابة الرئيسية", value: "في الموقع", tone: "live" },
          { label: "الردهة", value: "في الموقع", tone: "live" },
          { label: "الدورية", value: "الجولة 4 من 6", tone: "info" },
        ],
      },
      {
        slug: "cctv-control",
        kicker: "مراقبة الكاميرات",
        title: "كاميرات يراقبها شخص فعلاً.",
        text: "تحكم ومراقبة كاميرات في دبي بمشغلين مدرّبين يسجّلون وينبّهون ويتابعون، لا يكتفون بالتسجيل.",
        bullets: ["مراقبة مباشرة والاستجابة للإنذارات", "حفظ مقاطع الحوادث للمراجعة", "فحص يومي للكاميرات"],
        visual: [
          { label: "الكاميرات العاملة", value: "64 / 64", tone: "ok" },
          { label: "تنبيهات الليلة", value: "1 تمت مراجعته", tone: "warn" },
          { label: "المشغّل", value: "يراقب", tone: "live" },
        ],
      },
      {
        slug: "events-club-bouncer",
        kicker: "أمن الفعاليات",
        title: "فعاليات وأماكن، بلا فوضى.",
        text: "أمن فعاليات وحراس أندية في دبي يديرون الطوابير وقوائم الضيوف والحشود بهدوء وحزم.",
        bullets: ["تنظيم الحشود والطوابير", "حماية كبار الشخصيات والحماية الشخصية", "فرق أبواب للأندية والأماكن"],
        visual: [
          { label: "الضيوف", value: "412", tone: "info" },
          { label: "الطابور", value: "يتحرك", tone: "ok" },
          { label: "مدخل VIP", value: "مُغطّى", tone: "live" },
        ],
      },
      {
        slug: "facility-management",
        kicker: "إدارة المرافق",
        title: "نظيف ومُصان وآمن.",
        text: "إدارة مرافق وتنظيف مبانٍ وخدمات تدبير منزلي في دبي من نفس الفريق الذي يحرس الباب.",
        bullets: ["تنظيف المباني والتنظيف العميق", "طاقم تدبير منزلي", "تنظيم المواقف ومنقذو السباحة"],
        visual: [
          { label: "تنظيف الردهة", value: "06:30", tone: "ok" },
          { label: "دورات المياه", value: "كل ساعة", tone: "info" },
          { label: "المواقف", value: "منظّمة", tone: "live" },
        ],
      },
    ],
  },
  timeline: {
    label: "التغطية",
    title: "يوم كامل،",
    accent: "مخطط مسبقاً.",
    text: "أخبرنا بالموقع وساعات العمل. تُعدّ AGOC جدول الورديات والجولات وزيارات المشرف لكل يوم من العقد، وتتابع التنفيذ.",
    bullets: ["تغطية أمنية نهارية وليلية و24/7", "حراس بدلاء للإجازات والمرض", "تعديل الجدول بمكالمة واحدة"],
    panelTitle: "البرج A · اليوم",
    panelMeta: "من 07:00 إلى 07:00",
    hours: ["07:00", "11:00", "15:00", "19:00", "23:00", "03:00", "07:00"],
    rows: [
      { label: "الوردية النهارية", kind: "span", from: 0, to: 12, tone: "blue" },
      { label: "الوردية الليلية", kind: "span", from: 12, to: 24, tone: "navy" },
      { label: "مراقبة الكاميرات", kind: "span", from: 0, to: 24, tone: "sky" },
      { label: "الجولات", kind: "dots", points: [1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23], tone: "blue" },
      { label: "زيارات المشرف", kind: "dots", points: [4, 16, 20], tone: "gold" },
      { label: "تقرير الصباح", kind: "dots", points: [24], tone: "gold" },
    ],
  },
  report: {
    label: "التقارير",
    title: "تقريرك،",
    accent: "قبل قهوتك.",
    text: "كل صباح يرسل مشرف الموقع تقريراً قصيراً: من دخل، وماذا حدث، وما الذي يحتاج إصلاحاً. بلا ملاحقة وبلا تخمين.",
    bullets: ["يكتبه المشرف في الموقع", "صور مرفقة عند الحاجة", "الأعطال تُحال لفريق المرافق"],
    phone: {
      time: "07:02",
      inbox: "البريد الوارد",
      from: "عمليات AGOC",
      subject: "التقرير اليومي · البرج A",
      preview: "ليلة هادئة. عطل واحد أُحيل للمرافق.",
      sentAt: "07:00",
      greeting: "صباح الخير. هذه ليلة أمس في البرج A.",
      stats: [
        { label: "الزوار", value: "148" },
        { label: "التوصيلات", value: "36" },
        { label: "الحوادث", value: "0" },
      ],
      noteTitle: "ملاحظة",
      note: "حاجز المواقف بطيء الساعة 18:40. أُبلغ فريق المرافق.",
      footer: "مرسل من AGOC للأمن، دبي",
      read: "قرأه العميل · 07:04",
    },
  },
  compare: {
    label: "حسب الموقع",
    title: "مصمم للأبراج.",
    accent: "مصمم للفلل.",
    text: "البرج التجاري والفيلا العائلية يحتاجان أمناً مختلفاً. اسحب للمقارنة بين خطة AGOC لكل منهما.",
    hint: "اسحب للمقارنة",
    left: {
      tag: "تجاري",
      title: "أبراج ومكاتب ومستودعات",
      text: "تحكم بالدخول وسجل للزوار وفريق ظاهر يحافظ على حركة المبنى.",
      items: ["حراس أمن للردهة والبوابة", "سجلات الزوار والمقاولين", "تنظيم منطقة التحميل والمواقف", "غرفة تحكم بالكاميرات"],
      foot: "مكاتب · مراكز تسوق · فنادق · مستودعات",
    },
    right: {
      tag: "سكني",
      title: "فلل ومجمعات ومنازل",
      text: "حراس متحفّظون يعرفون العائلة والطاقم والروتين، ويُبقون الغرباء خارجاً.",
      items: ["حراس سكنيون متحفّظون", "حارسات أمن للعائلات", "دوريات ليلية في المحيط", "تدبير منزلي وتنظيف"],
      foot: "فلل · مجمعات · شقق",
    },
  },
  trust: {
    label: "لماذا AGOC",
    title: "مرخّصون. موثوقون.",
    accent: "مسؤولون.",
    items: [
      { value: "مرخّصة", title: "شركة أمن في دبي", text: "مرخّصة لتقديم خدمات حراس الأمن في دبي، بإجراءات موثّقة في كل موقع." },
      { value: "24/7", title: "خط العمليات", text: "شخص حقيقي يردّ ليلاً ونهاراً، من الأحد إلى السبت." },
      { value: "100%", title: "طاقم موثّق", text: "تحقق أمني وترخيص وإحاطة بالموقع قبل أن يرتدي أي شخص الشارة." },
      { value: "1", title: "مشرف مسمّى", text: "مشرف واحد يعرف موقعك وفريقك من اليوم الأول." },
    ],
    footnote: "AGOC لخدمات حراسة الأمن العامة ذ.م.م · المطينة، دبي",
  },
  servicesIntro: {
    label: "كل الخدمات",
    title: "خدمات الأمن والمرافق في",
    accent: "كل أنحاء دبي.",
  },
  clients: {
    label: "يثقون بنا",
    title: "عملاء ينامون",
    accent: "مطمئنين طوال الليل.",
    text: "أبراج وفنادق ومراكز تجارية وشركات إدارة مرافق في دبي والإمارات تعتمد على أمن AGOC كل يوم.",
  },
  cta: {
    title: "سلّمنا",
    accent: "الوردية الليلية.",
    text: "أخبرنا بالموقع والساعات والمخاطر. سنعود إليك بعرض أمني واضح لعقارك في دبي.",
    primary: "اطلب عرض أمن",
    whatsapp: "واتساب",
  },
};

export function getHomeOps(locale: Locale): HomeOps {
  return locale === "ar" ? AR : EN;
}
