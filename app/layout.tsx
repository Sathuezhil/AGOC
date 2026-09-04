import type { Metadata } from "next";
import { Cairo, Cormorant_Garamond, Outfit } from "next/font/google";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getContent } from "@/lib/content";
import { getDictionary, isRtl, localizeContent } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { defaultDescription, defaultTitle, seoKeywords } from "@/lib/seo";
import { site } from "@/lib/site";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-sans",
});

const arabic = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: defaultTitle,
    template: "%s | AGOC Security Dubai",
  },
  description: defaultDescription,
  keywords: [...seoKeywords],
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.name,
  publisher: site.legalName,
  category: "Security services",
  applicationName: site.name,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: site.url,
    siteName: site.name,
    locale: "en_AE",
    alternateLocale: ["ar_AE"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
  },
  alternates: {
    canonical: site.url,
    languages: {
      en: "/",
      ar: "/ar",
      "x-default": "/",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('agoc-theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname-base")
    ?? (await headers()).get("x-pathname")
    ?? "";
  const bare = pathname === "/login" || pathname.startsWith("/admin");
  const locale = await getLocale();
  const dict = getDictionary(locale);
  const { site: contentSite } = localizeContent(await getContent(), locale);
  const rtl = isRtl(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${display.variable} ${sans.variable} ${arabic.variable} font-sans antialiased ${
          rtl ? "font-arabic" : ""
        }`}
      >
        <ThemeProvider>
          {bare ? (
            children
          ) : (
            <>
              <JsonLd />
              <Header
                logoSrc={contentSite.logo}
                profilePdf={contentSite.companyProfilePdf}
              />
              <main>{children}</main>
              <Footer locale={locale} dict={dict} />
              <WhatsAppButton />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
