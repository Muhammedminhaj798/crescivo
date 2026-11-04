import type { Metadata } from "next";
import { Logo, Mark } from "@/components/Logo";
import { SITE } from "@/lib/content";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for doesn’t exist. Return to Crescivo Business Solutions.",
};

export default function NotFound() {
  return (
    <main className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(55%_60%_at_75%_30%,rgb(0_200_120/0.12),transparent_70%)]" />
      <Mark className="pointer-events-none absolute -right-[6vw] top-[8%] -z-10 w-[46vw] max-w-[620px] text-emerald/25" />
      <div className="wrap flex h-[4.5rem] items-center">
        <a href="/" aria-label={`${SITE.name} — home`}>
          <Logo className="h-8 w-auto text-paper md:h-9" />
        </a>
      </div>
      <div className="wrap flex flex-1 flex-col justify-center pb-24">
        <p className="t-label">Error 404</p>
        <h1 className="t-h2 mt-6 max-w-[14ch]">This page could not be found.</h1>
        <p className="t-lead mt-6 max-w-[32rem]">The link may be out of date, or the address mistyped.</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <a href="/" className="btn btn-primary">
            Back to the homepage
            <Mark className="btn-mark" />
          </a>
          <a href={`mailto:${SITE.email}`} className="btn btn-ghost">
            {SITE.email}
          </a>
        </div>
      </div>
    </main>
  );
}
