import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import { headers } from "next/headers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import JsonLd from "@/components/JsonLd";
import { ThemeProvider } from "@/components/ThemeProvider";
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

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "AGOC Security | Trusted Protection in Dubai",
    template: "%s | AGOC Security",
  },
  description: site.description,
  openGraph: {
    title: "AGOC Security | A Power That Saves You",
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "en_AE",
    type: "website",
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
  const pathname = (await headers()).get("x-pathname") ?? "";
  const bare =
    pathname === "/login" || pathname.startsWith("/admin");

  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${display.variable} ${sans.variable} font-sans antialiased`}>
        <ThemeProvider>
          {bare ? (
            children
          ) : (
            <>
              <JsonLd />
              <Header />
              <main>{children}</main>
              <Footer />
              <WhatsAppButton />
            </>
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
