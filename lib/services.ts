/** Local images live in /public/images */
export type Service = {
  slug: string;
  title: string;
  short: string;
  summary: string;
  image: string;
  focus?: string;
  gallery: string[];
  points: string[];
};

export const services: Service[] = [
  {
    slug: "private-security",
    title: "Private Security",
    short: "Discreet protection for people, homes, and businesses.",
    summary:
      "Tailored private protection for individuals, families, and high-value properties. Our officers provide a visible, professional presence with the discretion that sensitive environments require.",
    image: "/images/private-security.jpg",
    focus: "top",
    gallery: [
      "/images/security-guards.png",
      "/images/briefing.jpg",
      "/images/surveillance.jpg",
    ],
    points: [
      "Trained officers for personal and property protection",
      "24/7 monitoring with rapid on-ground response",
      "Access control, alarms, and surveillance integration",
      "Discreet coverage for high-profile clients",
      "Risk assessments and emergency coordination",
    ],
  },
  {
    slug: "general-security",
    title: "Security Guards",
    short: "Certified guards for commercial, residential, and event sites.",
    summary:
      "Fully certified security teams deployed across offices, hotels, hospitals, warehouses, cafes, and residential communities throughout Dubai and the UAE.",
    image: "/images/security-guards.png",
    focus: "center 38%",
    gallery: [
      "/images/private-security.jpg",
      "/images/office.jpg",
      "/images/briefing.jpg",
    ],
    points: [
      "Licensed, verified, and professionally uniformed staff",
      "Coverage for commercial, residential, and industrial sites",
      "Event security and crowd management",
      "Patrols, visitor control, and incident reporting",
      "Flexible shifts for day, night, and 24-hour posts",
    ],
  },
  {
    slug: "transport-security",
    title: "Transport Security",
    short: "Safe movement of people, cargo, and valuables.",
    summary:
      "Secure transit for people and goods, supported by trained escorts, real-time tracking, and tightly controlled access from origin to destination.",
    image: "/images/transport-security.jpg",
    gallery: [
      "/images/city.jpg",
      "/images/object-protection.jpg",
      "/images/hero2.jpg",
    ],
    points: [
      "Escort teams for people and high-value cargo",
      "Real-time tracking and route monitoring",
      "Secure logistics and handover protocols",
      "Airport, warehouse, and last-mile protection",
      "Trained personnel for transit risk scenarios",
    ],
  },
  {
    slug: "guard-house",
    title: "Guard House",
    short: "Staffed entry stations that control who comes in.",
    summary:
      "A professional presence at your gate. We staff and operate guard houses with CCTV, communication systems, and clear access procedures for communities and facilities.",
    image: "/images/city.jpg",
    gallery: [
      "/images/surveillance.jpg",
      "/images/security-guards.png",
      "/images/office.jpg",
    ],
    points: [
      "Entry-point staffing and visitor verification",
      "CCTV monitoring from the gatehouse",
      "Access logs and communication with site teams",
      "Weather-ready, durable post operations",
      "Clear protocols for deliveries and contractors",
    ],
  },
  {
    slug: "object-protection",
    title: "Object Protection",
    short: "Precision security for valuables in storage or transit.",
    summary:
      "Focused protection for high-value items — during storage, exhibition, or movement — with monitoring, handling protocols, and loss-prevention measures.",
    image: "/images/object-protection.jpg",
    gallery: [
      "/images/transport-security.jpg",
      "/images/briefing.jpg",
      "/images/data-protection.jpg",
    ],
    points: [
      "Protection for high-value assets and collections",
      "Monitored storage and transit coverage",
      "Theft, loss, and damage prevention",
      "Custom plans for unique objects",
      "Chain-of-custody procedures",
    ],
  },
  {
    slug: "club-bouncers",
    title: "Club Bouncers",
    short: "Calm, firm door control for nightlife venues.",
    summary:
      "Door teams who check IDs, manage capacity, and keep venues safe without turning the night into a confrontation. Professional presence, clear judgement.",
    image: "/images/club-bouncers.jpg",
    gallery: [
      "/images/private-security.jpg",
      "/images/city.jpg",
      "/images/hero.jpg",
    ],
    points: [
      "ID checks and authorised guest entry",
      "Capacity control at entry and exit points",
      "Behaviour monitoring inside the venue",
      "De-escalation of conflict and illegal activity",
      "Coordination with management and authorities",
    ],
  },
  {
    slug: "defense-training",
    title: "Defense Training",
    short: "Practical self-defense and situational awareness.",
    summary:
      "Hands-on training in physical defense, conflict de-escalation, and real-world readiness — for teams, staff, and individuals who want more than theory.",
    image: "/images/defense-training.jpg",
    focus: "top",
    gallery: [
      "/images/security-guards.png",
      "/images/briefing.jpg",
      "/images/private-security.jpg",
    ],
    points: [
      "Physical and tactical defense fundamentals",
      "Strength, agility, and awareness drills",
      "Self-defense and de-escalation methods",
      "Scenario-based practical sessions",
      "Programs for corporate and private groups",
    ],
  },
  {
    slug: "data-protection",
    title: "Data Protection",
    short: "Confidential handling of client information.",
    summary:
      "We treat client information as part of the brief. Access is controlled, records are handled with care, and our processes align with recognised data-protection standards.",
    image: "/images/data-protection.jpg",
    gallery: [
      "/images/surveillance.jpg",
      "/images/office.jpg",
      "/images/briefing.jpg",
    ],
    points: [
      "Confidential handling of client records",
      "Access-controlled information practices",
      "Alignment with GDPR and global privacy norms",
      "Secure reporting and document workflows",
      "Staff trained in information discipline",
    ],
  },
  {
    slug: "building-cleaning",
    title: "Building Cleaning",
    short: "Professional cleaning for residential and commercial sites.",
    summary:
      "A well-kept building is safer and more welcoming. We provide professional cleaning across residential, commercial, and industrial properties in the UAE.",
    image: "/images/building-cleaning.jpg",
    gallery: [
      "/images/office.jpg",
      "/images/city.jpg",
      "/images/hero2.jpg",
    ],
    points: [
      "Residential, commercial, and industrial cleaning",
      "Common areas, offices, and facility upkeep",
      "Schedules that work around occupancy",
      "Trained, supervised, uniformed teams",
      "A cleaner site that supports security standards",
    ],
  },
];

export function getService(slug: string) {
  return services.find((service) => service.slug === slug);
}
