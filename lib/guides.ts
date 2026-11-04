import type { Locale } from "./i18n/config";

export type GuideCopy = {
  title: string;
  description: string;
  excerpt: string;
  sections: { heading: string; paragraphs: string[] }[];
};

export type Guide = {
  slug: string;
  published: string;
  updated: string;
  image: string;
  keywords: string[];
  en: GuideCopy;
  ar: GuideCopy;
};

export const guides: Guide[] = [
  {
    slug: "hire-security-company-dubai",
    published: "2026-11-04",
    updated: "2026-11-04",
    image: "/images/briefing.jpg",
    keywords: [
      "hire security company dubai",
      "dubai security company",
      "how to hire security guards in Dubai",
      "security company quote Dubai",
    ],
    en: {
      title: "How to Hire a Security Company in Dubai",
      description:
        "A practical checklist for hiring a licensed Dubai security company: SIRA licence, headcount, shift pattern, supervision and what to put in the contract before guards arrive.",
      excerpt:
        "Ask for the SIRA licence, a named supervisor and a written roster before you sign. This is how property managers in Dubai hire a security company without empty posts.",
      sections: [
        {
          heading: "Start with the licence, not the brochure",
          paragraphs: [
            "Every operational security company in Dubai must hold a current SIRA licence. If a supplier cannot show the licence number and the categories they are allowed to staff, stop there. AGOC General Security Guard Services LLC operates under SIRA licence 1308900 from Al Muteena, Deira.",
            "Ask whether the guards on your site will be employed by that licensed company, not loaned from an unlicensed third party. The company on the invoice should be the company that trains, uniforms and supervises the post.",
          ],
        },
        {
          heading: "Describe the site before you ask for a price",
          paragraphs: [
            "A villa gate, a tower lobby and a warehouse dock are different jobs. Send the address, operating hours, entry points, whether you need a lady officer on reception, and whether CCTV is already installed. A serious Dubai security company will propose headcount and shift pattern from that, not a one-line rate.",
            "Include peak times: school runs, loading hours, Friday prayer, event days. Those hours decide whether you need a day post, a night post or 24-hour cover with a relief guard.",
          ],
        },
        {
          heading: "What the proposal should contain",
          paragraphs: [
            "A usable proposal names the posts (gate, lobby, patrol, CCTV), the hours for each, who the site supervisor is, how often they visit, and what you receive each morning. If the quote is only a dirham figure per guard, you are buying a body, not a service.",
            "Agree how sick leave and annual leave are covered. Empty posts are the usual reason clients change security companies in Dubai. Relief should be in the contract, not a favour you chase at 18:00.",
          ],
        },
        {
          heading: "Check how the first week will run",
          paragraphs: [
            "Guards should be briefed on your site rules before the first shift: visitor log, delivery dock, emergency numbers, who is allowed after hours. Ask for a named operations contact that answers at night.",
            "AGOC writes a daily occurrence report: visitors, incidents, faults passed to your facility team. If a company cannot show a sample report, you will spend the contract chasing WhatsApp messages.",
          ],
        },
        {
          heading: "Ready to brief a site?",
          paragraphs: [
            "Send the address, hours and risk to AGOC. We will come back with a clear security plan for towers, villas, hotels and sites across Dubai and the UAE — licensed guards, supervision and a morning report.",
          ],
        },
      ],
    },
    ar: {
      title: "كيف توظّف شركة أمن في دبي",
      description:
        "قائمة عملية لتوظيف شركة أمن مرخّصة في دبي: ترخيص سيرة، عدد الحراس، جدول الورديات، الإشراف وما يجب أن يتضمنه العقد قبل وصول الحراس.",
      excerpt:
        "اطلب ترخيص سيرة ومشرفاً مسمّى وجدولاً مكتوباً قبل التوقيع. هكذا يوظّف مديرو العقارات في دبي شركة أمن دون مواقع فارغة.",
      sections: [
        {
          heading: "ابدأ بالترخيص لا بالكتيّب",
          paragraphs: [
            "يجب أن تحمل كل شركة أمن تشغيلية في دبي ترخيص سيرة ساري المفعول. إن لم يستطع المورّد إظهار رقم الترخيص والفئات المسموح بها فتوقف. تعمل AGOC لخدمات حراسة الأمن العامة ذ.م.م بترخيص سيرة 1308900 من المطينة، ديرة.",
            "تأكد أن الحراس على موقعك موظّفون لدى تلك الشركة المرخّصة لا مُعارون من جهة غير مرخّصة. الشركة على الفاتورة هي من يدرّب ويُلبس ويُشرف.",
          ],
        },
        {
          heading: "صف الموقع قبل أن تطلب السعر",
          paragraphs: [
            "بوابة فيلا واستقبال برج ورصيف مستودع وظائف مختلفة. أرسل العنوان وساعات العمل ومداخل الدخول وما إذا كنت تحتاج حارسة في الاستقبال وما إذا كانت الكاميرات مركّبة. شركة أمن جادة في دبي تقترح العدد والورديات من ذلك لا سعراً بسطر واحد.",
          ],
        },
        {
          heading: "ماذا يجب أن يتضمن العرض",
          paragraphs: [
            "العرض الصالح يسمّي المواقع (بوابة، استقبال، دورية، كاميرات) والساعات لكل منها ومن هو مشرف الموقع وكم يزور وما تستلمه كل صباح. إن كان العرض درهماً لكل حارس فقط فأنت تشتري شخصاً لا خدمة.",
            "اتفق كيف تُغطّى الإجازات المرضية والسنوية. المواقع الفارغة هي السبب المعتاد لتغيير شركة الأمن في دبي.",
          ],
        },
        {
          heading: "كيف يجب أن يسير الأسبوع الأول",
          paragraphs: [
            "يجب إحاطة الحراس بقواعد موقعك قبل الوردية الأولى. اطلب جهة عمليات تردّ ليلاً. تكتب AGOC تقريراً يومياً: الزوار والحوادث والأعطال لفريق المرافق.",
          ],
        },
        {
          heading: "جاهز لإحاطة موقع؟",
          paragraphs: [
            "أرسل العنوان والساعات والمخاطر إلى AGOC. سنعود بخطة أمنية واضحة للأبراج والفلل والفنادق في دبي والإمارات.",
          ],
        },
      ],
    },
  },
  {
    slug: "sira-licensed-security-company-dubai",
    published: "2026-11-04",
    updated: "2026-11-04",
    image: "/images/private-security.jpg",
    keywords: [
      "SIRA licensed security company Dubai",
      "SIRA security guards Dubai",
      "licensed security company Dubai",
      "dubai security company",
    ],
    en: {
      title: "What SIRA Licensing Means for a Dubai Security Company",
      description:
        "SIRA is the regulator for private security in Dubai. Here is what a SIRA licence covers, what to ask a Dubai security company, and how AGOC staffs licensed posts.",
      excerpt:
        "A SIRA licence is not a logo. It is the legal right to put security guards on a post in Dubai. Check the number, the category and who employs the officer.",
      sections: [
        {
          heading: "Who SIRA is",
          paragraphs: [
            "The Security Industry Regulatory Agency sits under the UAE Ministry of Interior. It licenses private security companies and the officers they deploy in Dubai. Unlicensed guarding is not a grey area; it is outside the law.",
            "When you search for a Dubai security company, treat the licence as the first filter. Marketing copy about “elite teams” does not replace a current SIRA authorisation.",
          ],
        },
        {
          heading: "What to ask for in writing",
          paragraphs: [
            "Ask for the company licence number, the service categories (manned guarding, events, and so on), and confirmation that each officer on your site holds a valid individual permit. AGOC’s company licence number is 1308900.",
            "Ask how background checks, uniforms and site briefings are done. Licensed companies still vary in how they supervise a night shift. The licence gets them in the door; the roster and the report keep the post filled.",
          ],
        },
        {
          heading: "Guards are licensed too",
          paragraphs: [
            "The company licence is not enough. Officers who stand a gate in Dubai need their own SIRA cards. If a supplier cannot show how they check cards before a shift, you will meet relief guards who are not cleared for the post.",
            "Lady security officers, CCTV operators and event teams sit in different skill sets. Match the licence and the training to the job: a club door is not a hospital lobby.",
          ],
        },
        {
          heading: "How AGOC uses the licence on a live site",
          paragraphs: [
            "Before a shift, AGOC checks uniform, licence and handover log. A supervisor visit is planned on the roster. Incidents go into the occurrence report the next morning, not into a group chat that disappears.",
            "That is the difference clients feel between a licensed Dubai security company that runs operations and a vendor that only sends people.",
          ],
        },
      ],
    },
    ar: {
      title: "ماذا يعني ترخيص سيرة لشركة أمن في دبي",
      description:
        "سيرة هي الجهة المنظّمة للأمن الخاص في دبي. ماذا يغطي الترخيص، وماذا تسأل شركة الأمن، وكيف تنشر AGOC مواقع مرخّصة.",
      excerpt:
        "ترخيص سيرة ليس شعاراً. هو الحق القانوني لوضع حراس على موقع في دبي. تحقق من الرقم والفئة ومن يوظّف الضابط.",
      sections: [
        {
          heading: "من هي سيرة",
          paragraphs: [
            "هيئة تنظيم قطاع الأمن الخاص تتبع وزارة الداخلية. ترخّص شركات الأمن الخاص والضباط الذين ينشرونهم في دبي. الحراسة غير المرخّصة ليست منطقة رمادية.",
            "عند البحث عن شركة أمن في دبي اعتبر الترخيص أول فلتر. النصوص التسويقية لا تغني عن تفويض سيرة ساري.",
          ],
        },
        {
          heading: "ماذا تطلب كتابياً",
          paragraphs: [
            "اطلب رقم ترخيص الشركة وفئات الخدمة وتأكيداً أن كل ضابط على موقعك يحمل تصريحاً فردياً ساري المفعول. رقم ترخيص AGOC هو 1308900.",
          ],
        },
        {
          heading: "الحراس مرخّصون أيضاً",
          paragraphs: [
            "ترخيص الشركة لا يكفي. من يقف على بوابة في دبي يحتاج بطاقة سيرة خاصة. إن لم يُظهر المورّد كيف يفحص البطاقات قبل الوردية فستقابل حراس احتياط غير مصرّح لهم.",
          ],
        },
        {
          heading: "كيف تستخدم AGOC الترخيص في موقع حي",
          paragraphs: [
            "قبل الوردية تفحص AGOC الزي والترخيص وسجل التسليم. زيارة المشرف مخطّطة في الجدول. الحوادث تدخل تقرير الوقائع صباح اليوم التالي.",
          ],
        },
      ],
    },
  },
  {
    slug: "security-guard-services-dubai",
    published: "2026-11-04",
    updated: "2026-11-04",
    image: "/images/security-guards.png",
    keywords: [
      "security guard services Dubai",
      "security guards Dubai",
      "private guarding Dubai",
      "dubai security company",
    ],
    en: {
      title: "Security Guard Services in Dubai: Towers, Villas and Sites",
      description:
        "How security guard services in Dubai differ by site: tower lobbies, villa compounds, hotels, warehouses and events, and how a licensed company staffs each post.",
      excerpt:
        "The same uniform is not the same job. Dubai towers, villas and warehouses need different guards, hours and reports. Here is how to specify the post.",
      sections: [
        {
          heading: "Commercial towers and offices",
          paragraphs: [
            "A busy tower needs a visible lobby, a controlled gate, visitor logs and often a loading bay. Security guard services here are about access control and keeping the building moving, not standing still. CCTV in a control room should be watched, not only recorded.",
            "Ask for lady officers on reception where families and residents expect it. Night cover still needs patrol rounds of stairs, parking and plant rooms — with checkpoints, not a walk that nobody can prove.",
          ],
        },
        {
          heading: "Villas, compounds and homes",
          paragraphs: [
            "Residential guarding in Dubai is quieter. Officers learn the family, the staff and the routine. Strangers at the gate are the risk, not a lunchtime crowd. Discreet private guarding and lady security guards are the usual mix.",
            "Night patrols of the grounds matter more than a large daytime headcount. A good Dubai security company will say so instead of overstaffing the driveway.",
          ],
        },
        {
          heading: "Hotels, events and warehouses",
          paragraphs: [
            "Hotels and clubs need door teams who can handle queues without a scene. Warehouses need dock control, vehicle logs and someone who notices when a camera goes dark. Event security is planned around guest lists and peak arrival, then stood down.",
            "AGOC covers private guarding, lady officers, CCTV control, event and club security, parking, lifeguards and facility teams from the same operations line, so the gate and the cleaning roster are not two vendors arguing at 07:00.",
          ],
        },
        {
          heading: "What you should receive every morning",
          paragraphs: [
            "A short occurrence report: who came in, what happened, what is broken. That is the product. If you only get a smiling officer and no paper, you cannot manage the building.",
            "Hire the service for the site you actually run. Then keep the same supervisor long enough that they know the keys, the tenants and the night that usually goes wrong.",
          ],
        },
      ],
    },
    ar: {
      title: "خدمات حراس الأمن في دبي: أبراج وفلل ومواقع",
      description:
        "كيف تختلف خدمات حراس الأمن في دبي حسب الموقع: استقبال الأبراج، المجمعات السكنية، الفنادق، المستودعات والفعاليات، وكيف تُشغّل شركة مرخّصة كل موقع.",
      excerpt:
        "الزي نفسه ليس الوظيفة نفسها. أبراج دبي والفلل والمستودعات تحتاج حراساً وساعات وتقارير مختلفة.",
      sections: [
        {
          heading: "الأبراج التجارية والمكاتب",
          paragraphs: [
            "البرج المزدحم يحتاج استقبالاً ظاهراً وبوابة متحكّماً بها وسجلات زوار وغالباً رصيف تحميل. خدمات الحراسة هنا للتحكم بالدخول وتحريك المبنى. كاميرات غرفة التحكم يجب أن تُراقب لا أن تُسجَّل فقط.",
          ],
        },
        {
          heading: "الفلل والمجمعات والمنازل",
          paragraphs: [
            "الحراسة السكنية في دبي أهدأ. يتعلم الضباط العائلة والطاقم والروتين. الغرباء عند البوابة هم الخطر. الحراسة الخاصة الهادئة والحارسات هما المزيج المعتاد.",
          ],
        },
        {
          heading: "الفنادق والفعاليات والمستودعات",
          paragraphs: [
            "الفنادق والنوادي تحتاج فرق أبواب تدير الطوابير بهدوء. المستودعات تحتاج التحكم بالرصيف وسجلات المركبات. أمن الفعاليات يُخطَّط حسب قوائم الضيوف ثم يُنهى.",
            "تغطي AGOC الحراسة الخاصة والحارسات ومراقبة الكاميرات وأمن الفعاليات والمواقف والمنقذين وفرق المرافق من خط عمليات واحد.",
          ],
        },
        {
          heading: "ما يجب أن تستلمه كل صباح",
          paragraphs: [
            "تقرير وقائع قصير: من دخل وما حدث وما تعطّل. هذا هو المنتج. وظّف الخدمة للموقع الذي تديره فعلاً.",
          ],
        },
      ],
    },
  },
];

export function getGuides(): Guide[] {
  return guides;
}

export function getGuide(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function localizeGuide(guide: Guide, locale: Locale): GuideCopy & Pick<Guide, "slug" | "published" | "updated" | "image" | "keywords"> {
  const copy = locale === "ar" ? guide.ar : guide.en;
  return {
    slug: guide.slug,
    published: guide.published,
    updated: guide.updated,
    image: guide.image,
    keywords: guide.keywords,
    ...copy,
  };
}
