import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SITE, SOLUTIONS, STRATEGY, MARKETING, CREATIVE, OPERATIONS, SOFTWARE } from "@/lib/content";
import "./globals.css";

// Archivo variable, instanced to the axes the design uses (wght 400–600, wdth 100–125) and subset to
// the site's glyphs: 22 KB instead of 90 KB. Source + OFL licence in app/fonts.
const archivo = localFont({
  src: "./fonts/archivo-subset.woff2",
  variable: "--font-archivo",
  weight: "400 600",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "100% 125%" }],
});

// Site-wide defaults only. Page-specific SEO (canonical, og:url) lives on the page itself so the 404
// doesn't inherit a canonical pointing at the homepage. Next adds noindex to the 404 automatically.
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — Business Consulting & Technology Partner`, template: `%s — ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#080B0A",
  colorScheme: "dark",
};

const services = [
  STRATEGY.title,
  ...STRATEGY.items,
  MARKETING.title,
  ...MARKETING.items.map((i) => i.title),
  CREATIVE.title,
  ...CREATIVE.items.map((i) => i.title),
  ...OPERATIONS.hr,
  ...OPERATIONS.tech.map((i) => i.title),
  SOFTWARE.title,
  ...SOLUTIONS.items.map((i) => i.name),
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      alternateName: SITE.shortName,
      url: `${SITE.url}/`,
      logo: `${SITE.url}/logo.png`,
      description: SITE.description,
      slogan: "Your growth, our strategy.",
      email: SITE.email,
      telephone: SITE.phone,
      contactPoint: [
        { "@type": "ContactPoint", telephone: SITE.phone, email: SITE.email, contactType: "customer service" },
      ],
      knowsAbout: services,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      publisher: { "@id": `${SITE.url}/#organization` },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={archivo.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
