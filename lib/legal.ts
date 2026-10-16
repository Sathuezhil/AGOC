import type { Locale } from "./i18n/config";

export type LegalSection = { id: string; title: string; body: string[] };
export type LegalDoc = { intro: string; sections: LegalSection[]; contactTitle: string; contactText: string };

const PRIVACY: Record<Locale, LegalDoc> = {
  en: {
    intro:
      "AGOC General Security Guard Services LLC (“AGOC”, “we”) collects only what is needed to answer enquiries, prepare proposals and deliver contracted security services across Dubai and the UAE.",
    sections: [
      {
        id: "what-we-collect",
        title: "What we collect",
        body: [
          "Your name, email, phone number, the service you are interested in and the message you send through this website.",
          "If we work together, we may also hold site details, access lists, rosters and occurrence reports as required by the contract and UAE law.",
          "Job applicants share contact details, experience and any documents they choose to upload.",
        ],
      },
      {
        id: "how-we-use-it",
        title: "How we use it",
        body: [
          "To reply to you, visit your site, prepare a proposal, staff a post and meet our licensing and legal obligations.",
          "Applications are used only to assess candidates for roles at AGOC. We do not sell or rent personal data.",
        ],
      },
      {
        id: "how-we-protect-it",
        title: "How we protect it",
        body: [
          "Access to enquiry, client and applicant information is limited to the people who need it for operations.",
          "We keep records only as long as needed for service delivery, disputes and legal requirements, then delete them.",
        ],
      },
      {
        id: "your-choices",
        title: "Your choices",
        body: [
          "You can ask us to correct, update or remove details that are no longer needed, subject to any lawful retention duties.",
          "Write to us using the details on this page and a member of the team will reply.",
        ],
      },
    ],
    contactTitle: "Privacy questions",
    contactText: "Email us or visit our office in Al Muteena, Deira.",
  },
  ar: {
    intro:
      "تجمع شركة إيه جي أو سي لخدمات حراسة الأمن العام ذ.م.م («AGOC»، «نحن») فقط ما يلزم للرد على الاستفسارات وإعداد العروض وتقديم خدمات الأمن المتعاقد عليها في دبي والإمارات.",
    sections: [
      {
        id: "what-we-collect",
        title: "ما الذي نجمعه",
        body: [
          "الاسم والبريد الإلكتروني ورقم الهاتف والخدمة التي تهمك والرسالة التي ترسلها عبر هذا الموقع.",
          "عند التعاقد، قد نحتفظ أيضاً بتفاصيل الموقع وقوائم الدخول وجداول المناوبات وتقارير الحوادث وفق العقد وقوانين الدولة.",
          "يشارك المتقدمون للوظائف بيانات التواصل والخبرة وأي مستندات يختارون رفعها.",
        ],
      },
      {
        id: "how-we-use-it",
        title: "كيف نستخدمها",
        body: [
          "للرد عليك وزيارة موقعك وإعداد العرض وتوفير الحراسة والالتزام بمتطلبات الترخيص والقانون.",
          "تُستخدم طلبات التوظيف فقط لتقييم المرشحين لوظائف AGOC. لا نبيع البيانات الشخصية ولا نؤجرها.",
        ],
      },
      {
        id: "how-we-protect-it",
        title: "كيف نحميها",
        body: [
          "يقتصر الوصول إلى بيانات الاستفسارات والعملاء والمتقدمين على من يحتاجها للعمل التشغيلي.",
          "نحتفظ بالسجلات فقط للمدة اللازمة لتقديم الخدمة وحل النزاعات والمتطلبات القانونية، ثم نحذفها.",
        ],
      },
      {
        id: "your-choices",
        title: "خياراتك",
        body: [
          "يمكنك طلب تصحيح بياناتك أو تحديثها أو حذف ما لم يعد لازماً، مع مراعاة أي التزامات قانونية بالاحتفاظ.",
          "راسلنا عبر بيانات التواصل في هذه الصفحة وسيرد عليك أحد أفراد الفريق.",
        ],
      },
    ],
    contactTitle: "أسئلة الخصوصية",
    contactText: "راسلنا عبر البريد أو زر مكتبنا في المطينة، ديرة.",
  },
};

const TERMS: Record<Locale, LegalDoc> = {
  en: {
    intro:
      "This website is provided by AGOC General Security Guard Services LLC for information and enquiries. Security services are delivered only under a separate written agreement.",
    sections: [
      {
        id: "use-of-the-site",
        title: "Use of the site",
        body: [
          "You may browse the site and send genuine enquiries or job applications.",
          "Do not misuse the forms, attempt to disrupt the site or copy its content for competing use.",
        ],
      },
      {
        id: "enquiries-and-proposals",
        title: "Enquiries and proposals",
        body: [
          "Sending a form does not create a contract.",
          "Any proposal, roster or coverage commitment is confirmed only in a signed service agreement.",
        ],
      },
      {
        id: "liability",
        title: "Liability",
        body: [
          "Website content is general information. It is not a quote, a guarantee of availability or professional advice for a specific site.",
          "Operational terms, responsibilities and limits are set out in the service contract.",
        ],
      },
      {
        id: "governing-law",
        title: "Governing law",
        body: [
          "These terms are governed by the laws of the United Arab Emirates.",
          "Disputes relating to this website are subject to the competent courts in Dubai, unless a separate contract says otherwise.",
        ],
      },
    ],
    contactTitle: "Questions about these terms",
    contactText: "Email us or visit our office in Al Muteena, Deira.",
  },
  ar: {
    intro:
      "يقدّم هذا الموقع شركة إيه جي أو سي لخدمات حراسة الأمن العام ذ.م.م لأغراض المعلومات والاستفسار. تُقدَّم خدمات الأمن فقط بموجب اتفاقية مكتوبة منفصلة.",
    sections: [
      {
        id: "use-of-the-site",
        title: "استخدام الموقع",
        body: [
          "يمكنك تصفح الموقع وإرسال استفسارات أو طلبات توظيف حقيقية.",
          "لا يجوز إساءة استخدام النماذج أو محاولة تعطيل الموقع أو نسخ محتواه لاستخدام منافس.",
        ],
      },
      {
        id: "enquiries-and-proposals",
        title: "الاستفسارات والعروض",
        body: [
          "إرسال النموذج لا يُنشئ عقداً.",
          "أي عرض أو جدول مناوبات أو التزام بالتغطية يُعتمد فقط في اتفاقية خدمة موقّعة.",
        ],
      },
      {
        id: "liability",
        title: "المسؤولية",
        body: [
          "محتوى الموقع معلومات عامة، وليس عرض سعر أو ضماناً للتوفر أو استشارة مهنية لموقع محدد.",
          "تُحدَّد الشروط التشغيلية والمسؤوليات والحدود في عقد الخدمة.",
        ],
      },
      {
        id: "governing-law",
        title: "القانون الحاكم",
        body: [
          "تخضع هذه الشروط لقوانين دولة الإمارات العربية المتحدة.",
          "تختص محاكم دبي بالنزاعات المتعلقة بهذا الموقع، ما لم ينص عقد منفصل على غير ذلك.",
        ],
      },
    ],
    contactTitle: "أسئلة حول الشروط",
    contactText: "راسلنا عبر البريد أو زر مكتبنا في المطينة، ديرة.",
  },
};

export function getLegalDoc(kind: "privacy" | "terms", locale: Locale): LegalDoc {
  const source = kind === "privacy" ? PRIVACY : TERMS;
  return source[locale] ?? source.en;
}
