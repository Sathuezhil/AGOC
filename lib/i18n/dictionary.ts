import type { Locale } from "./config";

export type Dictionary = {
  nav: {
    home: string;
    about: string;
    services: string;
    careers: string;
    contact: string;
  };
  header: {
    ourProfile: string;
    profile: string;
    getProtection: string;
    openMenu: string;
    closeMenu: string;
    homeAria: string;
  };
  footer: {
    menu: string;
    services: string;
    contact: string;
    privacy: string;
    terms: string;
    viewOnMap: string;
    openMapAria: string;
    rights: string;
    licensed: string;
  };
  form: {
    name: string;
    email: string;
    phone: string;
    selectService: string;
    message: string;
    sending: string;
    send: string;
    thankYou: string;
    sendFailed: string;
    somethingWrong: string;
  };
  hero: {
    contactUs: string;
    exploreServices: string;
    scroll: string;
    speakWithUs: string;
  };
  home: {
    readStory: string;
    bookService: string;
    allServices: string;
    bookNow: string;
    offersLabel: string;
    offersTitle: string;
    viewService: string;
  };
  services: {
    eyebrow: string;
    bookThis: string;
    howWeCover: string;
    madeForSite: string;
    readyToStaff: string;
    tellUs: string;
    otherServices: string;
    service: string;
    offerLabel: string;
    offerTitle: string;
  };
  about: {
    founder: string;
    coordinator: string;
    teamMember: string;
    retention: string;
    founderMessage: string;
    coordinatorMessage: string;
  };
  contact: {
    office: string;
    visitOrCall: string;
    brief: string;
    address: string;
    email: string;
    phone: string;
    hours: string;
    enquiry: string;
  };
  servicesList: {
    viewServices: string;
    learnMore: string;
  };
  serviceDetail: {
    included: string;
    whatYouGet: string;
    onTheGround: string;
    lookOfWork: string;
    alsoAvailable: string;
    viewAll: string;
    learnMore: string;
  };
  whatsapp: {
    aria: string;
    message: string;
  };
  language: {
    label: string;
    en: string;
    ar: string;
  };
  notFound: {
    title: string;
    text: string;
    back: string;
  };
  privacy: {
    title: string;
    eyebrow: string;
    text: string;
  };
  terms: {
    title: string;
    eyebrow: string;
    text: string;
  };
  careers: {
    eyebrow: string;
    title: string;
    text: string;
    openRoles: string;
    noRoles: string;
    apply: string;
    applyTitle: string;
    applyText: string;
    selectRole: string;
    experience: string;
    cover: string;
    cvLabel: string;
    cvHint: string;
    cvPdfOnly: string;
    cvTooLarge: string;
    send: string;
    thankYou: string;
    requirements: string;
    whyLabel: string;
    whyTitle: string;
    whyItems: { title: string; text: string }[];
  };
};

const en: Dictionary = {
  nav: {
    home: "Home",
    about: "About",
    services: "Services",
    careers: "Careers",
    contact: "Contact",
  },
  header: {
    ourProfile: "Our Profile",
    profile: "Profile",
    getProtection: "Get Protection",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    homeAria: "AGOC Security home",
  },
  footer: {
    menu: "Menu",
    services: "Services",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms of Service",
    viewOnMap: "View on map",
    openMapAria: "Open office location in Google Maps",
    rights: "All rights reserved.",
    licensed: "Licensed security services · Dubai, United Arab Emirates",
  },
  form: {
    name: "Name",
    email: "Email",
    phone: "Phone number",
    selectService: "Select a service",
    message: "Tell us about the site, hours, and what you need protected.",
    sending: "Sending…",
    send: "Send request",
    thankYou: "Thank you. Our team will contact you shortly.",
    sendFailed: "Unable to send your request.",
    somethingWrong: "Something went wrong.",
  },
  hero: {
    contactUs: "Contact us",
    exploreServices: "Explore services",
    scroll: "Scroll",
    speakWithUs: "Speak with us",
  },
  home: {
    readStory: "Read our story",
    bookService: "Book a service",
    allServices: "All services",
    bookNow: "Book now",
    offersLabel: "Special offers",
    offersTitle: "Current promotions",
    viewService: "View service",
  },
  services: {
    eyebrow: "Services",
    bookThis: "Book this service",
    howWeCover: "How we cover the site",
    madeForSite: "Made for the site, not a brochure.",
    readyToStaff: "Ready to staff the site",
    tellUs: "Tell us the site, the hours, and the risk.",
    otherServices: "Other services",
    service: "Service",
    offerLabel: "Special offer",
    offerTitle: "Offer on this service",
  },
  about: {
    founder: "Founder",
    coordinator: "Coordinator",
    teamMember: "Team member",
    retention: "Retention",
    founderMessage: "Founder's Message",
    coordinatorMessage: "Coordinator's Message",
  },
  contact: {
    office: "Office",
    visitOrCall: "Visit or call us",
    brief:
      "Tell us the site, hours, and risk. We will come back with a clear plan — not a catalogue.",
    address: "Address",
    email: "Email",
    phone: "Phone",
    hours: "Hours",
    enquiry: "Enquiry",
  },
  servicesList: {
    viewServices: "View services",
    learnMore: "Learn more",
  },
  serviceDetail: {
    included: "Included",
    whatYouGet: "What you get",
    onTheGround: "On the ground",
    lookOfWork: "The look of the work",
    alsoAvailable: "Also available",
    viewAll: "View all services",
    learnMore: "Learn more",
  },
  whatsapp: {
    aria: "Chat on WhatsApp",
    message:
      "Hello AGOC Security, I would like to discuss a protection requirement.",
  },
  language: {
    label: "Language",
    en: "EN",
    ar: "عربي",
  },
  notFound: {
    title: "Page not found",
    text: "The page has moved or never existed. Return home or speak with the operations team.",
    back: "Back to home",
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Legal",
    text: "How AGOC Security handles the information you share with us.",
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Legal",
    text: "The conditions that apply when you use this website or engage AGOC Security.",
  },
  careers: {
    eyebrow: "Careers",
    title: "Work with a team that holds the line.",
    text: "AGOC hires for character first — then trains for the post. Join licensed security and facilities teams across Dubai.",
    openRoles: "Open roles",
    noRoles: "No open roles right now. Send your details anyway — we keep strong applications on file.",
    apply: "Apply now",
    applyTitle: "Send an application",
    applyText: "Tell us the role, your experience, and how to reach you. Our team will review and reply.",
    selectRole: "Select a role",
    experience: "Years of experience / background",
    cover: "Why AGOC, and what sites have you worked?",
    cvLabel: "CV / resume (PDF, optional)",
    cvHint: "Optional. PDF only, max {mb} MB.",
    cvPdfOnly: "Please upload a PDF CV only.",
    cvTooLarge: "CV must be under {mb} MB.",
    send: "Submit application",
    thankYou: "Thank you. We have received your application.",
    requirements: "What we look for",
    whyLabel: "Why join",
    whyTitle: "Discipline, respect, and a clear post.",
    whyItems: [
      {
        title: "Licensed operation",
        text: "Work under a Dubai-licensed security company with proper briefing and supervision.",
      },
      {
        title: "Real posts",
        text: "Residential, commercial, control-room, and facilities roles — not brochure work.",
      },
      {
        title: "Named support",
        text: "Supervisors and operations stay reachable when the shift needs backup.",
      },
    ],
  },
};

const ar: Dictionary = {
  nav: {
    home: "الرئيسية",
    about: "من نحن",
    services: "خدماتنا",
    careers: "الوظائف",
    contact: "تواصل معنا",
  },
  header: {
    ourProfile: "ملف الشركة",
    profile: "الملف",
    getProtection: "اطلب حماية",
    openMenu: "فتح القائمة",
    closeMenu: "إغلاق القائمة",
    homeAria: "الصفحة الرئيسية لـ AGOC Security",
  },
  footer: {
    menu: "القائمة",
    services: "الخدمات",
    contact: "التواصل",
    privacy: "سياسة الخصوصية",
    terms: "شروط الخدمة",
    viewOnMap: "عرض على الخريطة",
    openMapAria: "فتح موقع المكتب في خرائط Google",
    rights: "جميع الحقوق محفوظة.",
    licensed: "خدمات أمنية مرخّصة · دبي، الإمارات العربية المتحدة",
  },
  form: {
    name: "الاسم",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    selectService: "اختر خدمة",
    message: "أخبرنا عن الموقع وساعات العمل وما تحتاج حمايته.",
    sending: "جاري الإرسال…",
    send: "إرسال الطلب",
    thankYou: "شكراً لك. سيتواصل معك فريقنا قريباً.",
    sendFailed: "تعذّر إرسال طلبك.",
    somethingWrong: "حدث خطأ ما.",
  },
  hero: {
    contactUs: "تواصل معنا",
    exploreServices: "استكشف الخدمات",
    scroll: "مرّر",
    speakWithUs: "تحدث معنا",
  },
  home: {
    readStory: "اقرأ قصتنا",
    bookService: "احجز خدمة",
    allServices: "كل الخدمات",
    bookNow: "احجز الآن",
    offersLabel: "عروض خاصة",
    offersTitle: "العروض الحالية",
    viewService: "عرض الخدمة",
  },
  services: {
    eyebrow: "الخدمات",
    bookThis: "احجز هذه الخدمة",
    howWeCover: "كيف نغطي الموقع",
    madeForSite: "مصمّمة للموقع، لا للكتالوج.",
    readyToStaff: "جاهزون لتأمين الموقع",
    tellUs: "أخبرنا عن الموقع والساعات والمخاطر.",
    otherServices: "خدمات أخرى",
    service: "خدمة",
    offerLabel: "عرض خاص",
    offerTitle: "عرض على هذه الخدمة",
  },
  about: {
    founder: "المؤسس",
    coordinator: "المنسّق",
    teamMember: "عضو الفريق",
    retention: "الاستمرارية",
    founderMessage: "رسالة المؤسس",
    coordinatorMessage: "رسالة المنسّق",
  },
  contact: {
    office: "المكتب",
    visitOrCall: "زورونا أو اتصلوا بنا",
    brief:
      "أخبرونا عن الموقع والساعات والمخاطر. نعود إليكم بخطة واضحة — لا بكتالوج.",
    address: "العنوان",
    email: "البريد",
    phone: "الهاتف",
    hours: "ساعات العمل",
    enquiry: "استفسار",
  },
  servicesList: {
    viewServices: "عرض الخدمات",
    learnMore: "اعرف المزيد",
  },
  serviceDetail: {
    included: "يشمل",
    whatYouGet: "ما ستحصل عليه",
    onTheGround: "على الأرض",
    lookOfWork: "شكل العمل",
    alsoAvailable: "متاح أيضاً",
    viewAll: "عرض كل الخدمات",
    learnMore: "اعرف المزيد",
  },
  whatsapp: {
    aria: "محادثة عبر واتساب",
    message: "مرحباً AGOC Security، أود مناقشة احتياج أمني.",
  },
  language: {
    label: "اللغة",
    en: "EN",
    ar: "عربي",
  },
  notFound: {
    title: "الصفحة غير موجودة",
    text: "ربما نُقلت الصفحة أو لم تكن موجودة. عد إلى الرئيسية أو تواصل مع فريق العمليات.",
    back: "العودة للرئيسية",
  },
  privacy: {
    title: "سياسة الخصوصية",
    eyebrow: "قانوني",
    text: "كيف تتعامل أجوك مع المعلومات التي تشاركونها معنا.",
  },
  terms: {
    title: "شروط الخدمة",
    eyebrow: "قانوني",
    text: "الشروط التي تنطبق عند استخدام هذا الموقع أو التعامل مع أجوك.",
  },
  careers: {
    eyebrow: "الوظائف",
    title: "انضم إلى فريق يحافظ على الموقع.",
    text: "توظّف أجوك الشخصية أولاً — ثم تدرّب على الموقع. انضم إلى فرق الأمن والمرافق المرخّصة في دبي.",
    openRoles: "الوظائف المتاحة",
    noRoles: "لا توجد وظائف مفتوحة حالياً. أرسل بياناتك على أي حال — نحتفظ بالطلبات القوية.",
    apply: "قدّم الآن",
    applyTitle: "أرسل طلب التوظيف",
    applyText: "أخبرنا عن الوظيفة وخبرتك وكيفية التواصل معك. سيراجع فريقنا ويرد.",
    selectRole: "اختر وظيفة",
    experience: "سنوات الخبرة / الخلفية",
    cover: "لماذا أجوك، وما المواقع التي عملت فيها؟",
    cvLabel: "السيرة الذاتية (PDF، اختياري)",
    cvHint: "اختياري. ملف PDF فقط، بحد أقصى {mb} ميجابايت.",
    cvPdfOnly: "يرجى رفع السيرة الذاتية بصيغة PDF فقط.",
    cvTooLarge: "يجب أن تكون السيرة الذاتية أقل من {mb} ميجابايت.",
    send: "إرسال الطلب",
    thankYou: "شكراً لك. استلمنا طلب التوظيف.",
    requirements: "ما نبحث عنه",
    whyLabel: "لماذا تنضم",
    whyTitle: "انضباط، احترام، وموقع واضح.",
    whyItems: [
      {
        title: "تشغيل مرخّص",
        text: "اعمل ضمن شركة أمن مرخّصة في دبي مع إحاطة وإشراف مناسب.",
      },
      {
        title: "مواقع حقيقية",
        text: "أدوار سكنية وتجارية وغرفة تحكم ومرافق — لا عمل كتيّب.",
      },
      {
        title: "دعم باسمه",
        text: "المشرفون والعمليات يبقون متاحين عندما تحتاج المناوبة دعماً.",
      },
    ],
  },
};

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
