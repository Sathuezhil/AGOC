import { site as fallbackSite, defaultLogo } from "./site";

export type TextPair = { title: string; text: string };
export type Slide = { src: string; alt: string };
export type StatItem = { value: string; label: string; icon: "shield" | "clock" | "map" | "check" };
export type TeamKind = "founder" | "coordinator" | "member";
export type TeamMember = {
  name: string;
  role: string;
  bio: string;
  education?: string;
  closing?: string;
  image?: string;
  kind?: TeamKind;
  founder?: boolean;
};

export function teamKind(member: TeamMember): TeamKind {
  if (member.kind) return member.kind;
  return member.founder ? "founder" : "member";
}

export type SiteContent = {
  site: {
    name: string;
    legalName: string;
    tagline: string;
    description: string;
    email: string;
    phones: string[];
    whatsapp: string;
    facebook: string;
    instagram: string;
    tiktok: string;
    address: string;
    hours: { days: string; time: string }[];
    footerBlurb: string;
    logo: string;
    companyProfilePdf: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleItalic: string;
    text: string;
    slides: Slide[];
  };
  home: {
    pillars: TextPair[];
    introLabel: string;
    introTitle: string;
    introText: string;
    introImage: string;
    introCaption: string;
    reasons: string[];
    servicesLabel: string;
    servicesTitle: string;
    features: TextPair[];
    stats: StatItem[];
    whyLabel: string;
    whyTitle: string;
    whyText: string;
    whyImage: string;
    whyItems: TextPair[];
    contactLabel: string;
    contactTitle: string;
    contactText: string;
    contactNote: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    whoLabel: string;
    whoTitle: string;
    whoText1: string;
    whoText2: string;
    officeImage: string;
    missionTitle: string;
    missionText: string;
    visionTitle: string;
    visionText: string;
    missionImage: string;
    valuesTitle: string;
    valuesText: string;
    values: TextPair[];
    stayTitle: string;
    stayItems: TextPair[];
    teamLabel: string;
    teamTitle: string;
    teamText: string;
    membersTitle: string;
    team: TeamMember[];
  };
  contactPage: {
    eyebrow: string;
    title: string;
    text: string;
    formTitle: string;
    formText: string;
  };
  servicesPage: {
    eyebrow: string;
    title: string;
    text: string;
  };
};

export const DEFAULT_CONTENT: SiteContent = {
  site: {
    name: fallbackSite.name,
    legalName: fallbackSite.legalName,
    tagline: fallbackSite.tagline,
    description: fallbackSite.description,
    email: fallbackSite.email,
    phones: [...fallbackSite.phones],
    whatsapp: fallbackSite.whatsapp,
    facebook: fallbackSite.facebook,
    instagram: fallbackSite.instagram,
    tiktok: fallbackSite.tiktok,
    address: fallbackSite.address,
    hours: fallbackSite.hours.map((row) => ({ ...row })),
    footerBlurb:
      "Certified security teams protecting people, property, and peace of mind across Dubai and the UAE.",
    logo: defaultLogo,
    companyProfilePdf: fallbackSite.companyProfilePdf,
  },
  hero: {
    eyebrow: "Dubai · Licensed · Verified staff",
    title: "Leading security.",
    titleItalic: "Your safety, our duty.",
    text: "Experienced guards, quiet surveillance, and rapid response — for homes, businesses, events, and everything that cannot wait.",
    slides: [
      { src: "/images/hero.jpg", alt: "Dubai skyline at dusk" },
      { src: "/images/security-guards.png", alt: "AGOC security team on duty" },
      { src: "/images/hero2.jpg", alt: "Downtown Dubai skyline at golden hour" },
    ],
  },
  home: {
    pillars: [
      {
        title: "Licensed in Dubai",
        text: "Compliant teams, documented procedures, and officers you can put on a gate.",
      },
      {
        title: "Eyes on, always",
        text: "CCTV, patrols, and live reporting so nothing important sits in the dark.",
      },
      {
        title: "Building cleaning",
        text: "Professional cleaning for homes, offices, and commercial sites — clean spaces that look sharp and stay presentable every day.",
      },
    ],
    introLabel: "One of Dubai’s trusted firms",
    introTitle: "Security that feels considered, not loud.",
    introText:
      "AGOC Security is built on trust, trained people, and an unfussy commitment to keeping sites calm. We work residential compounds, commercial towers, hotels, hospitals, warehouses, and private households — with the same standard on every post.",
    introImage: "/images/briefing.jpg",
    introCaption: "Quiet professionals. Clear communication. No theatrics.",
    reasons: [
      "Fully certified, 100% verified officers",
      "Coverage for homes, offices, hotels, events, and warehouses",
      "Serious protection without inflated retainers",
      "Guards trained for commercial, medical, and residential posts",
    ],
    servicesLabel: "What we do",
    servicesTitle: "Protection, fitted to the place.",
    features: [
      {
        title: "Property security",
        text: "Access control, patrols, and 24/7 presence that keeps assets and people unhurried.",
      },
      {
        title: "Surveillance",
        text: "Live CCTV, alerts, and operators who actually watch — not just record.",
      },
      {
        title: "Deep cleaning",
        text: "Thorough deep cleans for kitchens, washrooms, floors, and hard-to-reach areas — one-off or scheduled when a space needs a full reset.",
      },
    ],
    stats: [
      { value: "9", label: "Service lines", icon: "shield" },
      { value: "24/7", label: "Operations cover", icon: "clock" },
      { value: "UAE", label: "Licensed to operate", icon: "map" },
      { value: "100%", label: "Verified staff", icon: "check" },
    ],
    whyLabel: "Why AGOC",
    whyTitle: "People first. Then process. Then tech.",
    whyText:
      "Clients stay because the officer on the door is calm, the supervisor answers, and the report arrives. We hire for character, train for the post, and only then layer cameras and access systems.",
    whyImage: "/images/surveillance.jpg",
    whyItems: [
      {
        title: "Verified staff",
        text: "Background checks, licensing, and briefing before anyone wears the badge.",
      },
      {
        title: "Made for the site",
        text: "A villa is not a nightclub. Coverage, posture, and reporting change with the brief.",
      },
      {
        title: "Always reachable",
        text: "A real operations line — not a voicemail maze — from Sunday through Saturday.",
      },
    ],
    contactLabel: "Get in touch",
    contactTitle: "Stay secure. Stay connected.",
    contactText:
      "Tell us the site, the hours, and the risk. We will come back with a clear proposal — not a catalogue.",
    contactNote: "A named supervisor from day one.",
  },
  about: {
    eyebrow: "About AGOC",
    title: "Protection with a human face.",
    text: "We look after people, property, and assets with trained officers, modern systems, and plans written for the site — not copied from a brochure.",
    whoLabel: "Who we are",
    whoTitle: "AGOC General Security Guard Services LLC",
    whoText1:
      "Based in Al Muteena, Dubai, AGOC provides licensed security officers and supporting services across the UAE. Our work is straightforward: understand the risk, staff the post properly, and stay reachable.",
    whoText2:
      "From residential compounds to hotels, hospitals, warehouses, and private households, the same standard applies — verified people, clear reporting, and technology that supports the officer rather than replacing them.",
    officeImage: "/images/office.jpg",
    missionTitle: "Our Mission",
    missionText:
      "Our mission is to provide unparalleled security solutions that ensure the safety and peace of mind of our clients. We are dedicated to delivering professional, reliable, and innovative security services tailored to meet the unique needs of each individual or organization we serve.",
    visionTitle: "Our Vision",
    visionText:
      "Our vision is to be the leading provider of cutting-edge security solutions, setting the industry standard for excellence and innovation. We envision a future where safety is never compromised, and our services are trusted globally for their effectiveness, reliability, and responsiveness.",
    missionImage: "/images/surveillance.jpg",
    valuesTitle: "How we work",
    valuesText:
      "Years on the ground across industries, with plans that match the building, the hours, and the people who live or work there.",
    values: [
      {
        title: "Discipline",
        text: "Posts run on time, in uniform, with notes that a manager can actually use.",
      },
      {
        title: "Discretion",
        text: "Private clients and premium venues need presence without spectacle.",
      },
      {
        title: "Judgement",
        text: "We hire people who can de-escalate first and act firmly when they must.",
      },
    ],
    stayTitle: "Why clients stay",
    stayItems: [
      {
        title: "Expertise",
        text: "Reliable coverage across commercial, residential, and event environments.",
      },
      {
        title: "Tailored plans",
        text: "Every site gets its own roster, SOP, and escalation path.",
      },
      {
        title: "Modern tools",
        text: "CCTV, access control, and monitoring used with purpose.",
      },
      {
        title: "24/7 protection",
        text: "Round-the-clock posts and a live operations line.",
      },
      {
        title: "Trained officers",
        text: "People prepared for the post they are actually standing.",
      },
      {
        title: "Peace of mind",
        text: "You run the business. We keep the perimeter quiet.",
      },
    ],
    teamLabel: "Leadership",
    teamTitle: "The people behind the post.",
    teamText:
      "Founder-led operations with a coordinator and officers who know the brief before they put on the badge.",
    membersTitle: "Team Members",
    team: [
      {
        name: "Abdul Moeez Awan",
        role: "Founder & Managing Director",
        education: "BSc in Human Resources Management",
        bio: "I am proud to lead AGOC with a clear focus on people, professionalism, and trust. Our teams are trained to protect what matters most to our clients — with discipline, care, and integrity every day. I remain committed to building lasting partnerships across Dubai and the UAE through reliable service and honest standards.",
        closing:
          "Leading with Integrity. Serving with Excellence. Growing Through Trust.",
        image: "",
        kind: "founder",
        founder: true,
      },
      {
        name: "Coordinator",
        role: "Operations Coordinator",
        bio: "As Administrative Coordinator, I keep AGOC’s day-to-day operations clear and on track — from rosters and site briefings to client follow-ups and internal coordination. I work closely with supervisors and field teams so every post is covered, every message is answered, and every client feels the same standard of care from the office as they do on the ground.",
        closing:
          "Behind every smooth shift is careful coordination. That is what I stand for at AGOC.",
        image: "/images/security-guards.png",
        kind: "coordinator",
      },
      {
        name: "Teymur Baghirzade",
        role: "Marketing Executive",
        bio: "I help AGOC stay visible and clear to clients — building a professional brand that matches the standard of our security teams across Dubai and the UAE.",
        image: "/images/team/teymur-baghirzade.jpeg",
        kind: "member",
      },
      {
        name: "Tahir Awan",
        role: "Supervisor",
        bio: "As Supervisor, I stay close to every post — checking standards, supporting officers on the ground, and making sure each site runs smoothly and safely for our clients.",
        image: "",
        kind: "member",
      },
      {
        name: "Pooja Sanga",
        role: "Assistant Accountant",
        bio: "I support AGOC’s accounts with accuracy and care — keeping records clear, payments timely, and the financial side of our operations running with the same discipline as our field teams.",
        image: "",
        kind: "member",
      },
    ],
  },
  contactPage: {
    eyebrow: "Contact",
    title: "Tell us what needs protecting.",
    text: "A short brief is enough. We will come back with availability, a site plan, and a clear commercial.",
    formTitle: "Send a request",
    formText: "We typically reply within one business day.",
  },
  servicesPage: {
    eyebrow: "Our services",
    title: "A full bench of protection.",
    text: "From a single villa gate to a multi-site commercial roster — officers, systems, and support that hold together.",
  },
};

function mergeContent(stored: SiteContent): SiteContent {
  const about = {
    ...DEFAULT_CONTENT.about,
    ...stored.about,
    team: stored.about?.team?.length
      ? stored.about.team
      : DEFAULT_CONTENT.about.team,
  };
  const team = about.team.map((member) => {
    const kind = teamKind(member);
    return { ...member, kind, founder: kind === "founder" };
  });
  const hasCoordinator = team.some((member) => teamKind(member) === "coordinator");
  const normalizedTeam = hasCoordinator
    ? team
    : team.map((member, index) => {
        if (teamKind(member) === "founder") return member;
        const firstMemberIndex = team.findIndex((item) => teamKind(item) !== "founder");
        if (index === firstMemberIndex) {
          return { ...member, kind: "coordinator" as const, founder: false };
        }
        return { ...member, kind: "member" as const, founder: false };
      });

  return {
    ...DEFAULT_CONTENT,
    ...stored,
    site: {
      ...DEFAULT_CONTENT.site,
      ...stored.site,
      logo: stored.site?.logo?.trim() || DEFAULT_CONTENT.site.logo,
      companyProfilePdf:
        stored.site?.companyProfilePdf?.trim() ||
        DEFAULT_CONTENT.site.companyProfilePdf,
    },
    hero: { ...DEFAULT_CONTENT.hero, ...stored.hero },
    home: { ...DEFAULT_CONTENT.home, ...stored.home },
    about: {
      ...about,
      membersTitle: about.membersTitle || DEFAULT_CONTENT.about.membersTitle,
      team: normalizedTeam,
    },
    contactPage: { ...DEFAULT_CONTENT.contactPage, ...stored.contactPage },
    servicesPage: { ...DEFAULT_CONTENT.servicesPage, ...stored.servicesPage },
  };
}

export async function getContent() {
  const { contentCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const doc = await (await contentCollection()).findOne({ _id: "site" });
  if (!doc) return mergeContent(DEFAULT_CONTENT);
  const { _id: _unused, ...stored } = doc;
  void _unused;
  const { rewriteImageRefs } = await import("./media");
  return rewriteImageRefs(mergeContent(stored as SiteContent));
}

export async function saveContent(content: SiteContent) {
  const { contentCollection } = await import("./db");
  const { ensureSeeded } = await import("./seed");
  await ensureSeeded();
  const { rewriteImageRefs } = await import("./media");
  const next = rewriteImageRefs(content);
  await (
    await contentCollection()
  ).updateOne({ _id: "site" }, { $set: next }, { upsert: true });
  return next;
}

export async function updateSiteLogo(logo: string) {
  const content = await getContent();
  return saveContent({
    ...content,
    site: { ...content.site, logo: logo.trim() },
  });
}

export async function updateSiteProfilePdf(companyProfilePdf: string) {
  const content = await getContent();
  return saveContent({
    ...content,
    site: { ...content.site, companyProfilePdf: companyProfilePdf.trim() },
  });
}

export function phoneLink(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
