export const site = {
  name: "AGOC Security",
  legalName: "AGOC General Security Guard Services LLC",
  tagline: "A Power That Saves You",
  description:
    "Trusted security company in Dubai providing licensed private guards, CCTV monitoring, facility management, and professional building services across the UAE. AGOC Security — Al Muteena, Dubai.",
  url: "https://www.agocsecurity.ae",
  email: "info@agoc.ae",
  phones: ["+971 4 892 4995", "+971 4 337 9951"],
  phoneLinks: ["+97148924995", "+97143379951"],
  whatsapp: "97148924995",
  facebook: "https://www.facebook.com/AgocPrivateGuardingServices",
  instagram: "https://www.instagram.com/agocgroups/",
  tiktok: "https://www.tiktok.com/@agocsecurity",
  address: "Office 315, Building Al Mulla 1, Al Muteena, Dubai, UAE",
  /** Lulu Centre / Al Mulla 1, Al Muteena St, Deira */
  map: { lat: 25.274195, lng: 55.327856, zoom: 17 },
  hours: [
    { days: "Sunday – Friday", time: "09:00 – 18:00" },
    { days: "Saturday", time: "10:00 – 17:00" },
  ],
  /** Company profile PDF in public/documents/ */
  companyProfilePdf: "/documents/AGOC-Security-Light-Presentation.pdf",
  companyProfileFilename: "AGOC-Company-Profile.pdf",
} as const;

/** Default AGOC mark used when no custom logo is saved in admin settings. */
export const defaultLogo =
  "/api/media/uploads/1787735514704-gemini_generated_image_a3gg58a3gg58a3gg_page-0001.jpg";

/** Dark theme — public/footer and admin logo.png */
export const brandLogo = "/footer and admin logo.png";

/** Light theme — public/footer and admin logo lighttheme.png */
export const brandLogoLight = "/footer and admin logo lighttheme.png";

export const footerLogo = brandLogo;
export const adminLogo = brandLogo;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
] as const;
