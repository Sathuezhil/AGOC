import type { SiteContent, TeamMember } from "@/lib/content";
import type { Locale } from "./config";
import { CONTENT_AR } from "./content-ar";
import { localizeJob, localizeJobs } from "./careers-ar";
import { localizeOffer, localizeOffers } from "./offers-ar";
import { localizeService, localizeServices } from "./services-ar";

export {
  localizeService,
  localizeServices,
  localizeJob,
  localizeJobs,
  localizeOffer,
  localizeOffers,
};

const ROLE_AR: Record<string, string> = {
  "Founder & Managing Director": "المؤسس والمدير العام",
  "Operations Coordinator": "منسّق العمليات",
  "Marketing Executive": "المسؤول التسويقي",
  Supervisor: "المشرف",
  "Assistant Accountant": "مساعد محاسب",
  Coordinator: "المنسّق",
};

function localizeTeam(team: TeamMember[]): TeamMember[] {
  return team.map((member) => ({
    ...member,
    role: ROLE_AR[member.role] || member.role,
  }));
}

/** Apply Arabic marketing overlay while keeping media / contact channels from CMS. */
export function localizeContent(content: SiteContent, locale: Locale): SiteContent {
  if (locale !== "ar") return content;
  const ar = CONTENT_AR;
  return {
    ...content,
    site: {
      ...content.site,
      legalName: ar.site.legalName,
      tagline: ar.site.tagline,
      description: ar.site.description,
      address: ar.site.address,
      hours: ar.site.hours,
      footerBlurb: ar.site.footerBlurb,
    },
    hero: {
      ...content.hero,
      eyebrow: ar.hero.eyebrow,
      title: ar.hero.title,
      titleItalic: ar.hero.titleItalic,
      text: ar.hero.text,
    },
    home: {
      ...content.home,
      pillars: ar.home.pillars,
      introLabel: ar.home.introLabel,
      introTitle: ar.home.introTitle,
      introText: ar.home.introText,
      introCaption: ar.home.introCaption,
      reasons: ar.home.reasons,
      servicesLabel: ar.home.servicesLabel,
      servicesTitle: ar.home.servicesTitle,
      features: ar.home.features,
      stats: ar.home.stats,
      whyLabel: ar.home.whyLabel,
      whyTitle: ar.home.whyTitle,
      whyText: ar.home.whyText,
      whyItems: ar.home.whyItems,
      contactLabel: ar.home.contactLabel,
      contactTitle: ar.home.contactTitle,
      contactText: ar.home.contactText,
      contactNote: ar.home.contactNote,
    },
    about: {
      ...content.about,
      eyebrow: ar.about.eyebrow,
      title: ar.about.title,
      text: ar.about.text,
      whoLabel: ar.about.whoLabel,
      whoTitle: ar.about.whoTitle,
      whoText1: ar.about.whoText1,
      whoText2: ar.about.whoText2,
      missionTitle: ar.about.missionTitle,
      missionText: ar.about.missionText,
      visionTitle: ar.about.visionTitle,
      visionText: ar.about.visionText,
      valuesTitle: ar.about.valuesTitle,
      valuesText: ar.about.valuesText,
      values: ar.about.values,
      stayTitle: ar.about.stayTitle,
      stayItems: ar.about.stayItems,
      teamLabel: ar.about.teamLabel,
      teamTitle: ar.about.teamTitle,
      teamText: ar.about.teamText,
      membersTitle: ar.about.membersTitle,
      team: localizeTeam(content.about.team),
    },
    contactPage: ar.contactPage,
    servicesPage: ar.servicesPage,
  };
}
