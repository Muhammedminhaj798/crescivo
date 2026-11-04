import { Nav } from "@/components/Nav";
import { Motion } from "@/components/Motion";
import { Hero } from "@/components/sections/Hero";
import { About, Mission } from "@/components/sections/About";
import { Creative, Marketing, Operations, ServicesIntro, Strategy } from "@/components/sections/Services";
import { Software } from "@/components/sections/Software";
import { Solutions } from "@/components/sections/Solutions";
import { Contact, Footer, Process, Why } from "@/components/sections/Closing";
import type { Metadata } from "next";
import { SITE } from "@/lib/content";

const title = `${SITE.name} — Business Consulting & Technology Partner`;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: SITE.name, title, description: SITE.description },
  twitter: { card: "summary_large_image", title, description: SITE.description },
};

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-emerald px-5 py-3 font-medium text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <div id="about">
          <About />
          <Mission />
        </div>
        <div id="services">
          <ServicesIntro />
          <Strategy />
          <Marketing />
          <Creative />
          <Operations />
          <Software />
        </div>
        <Solutions />
        <Why />
        <Process />
        <Contact />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
