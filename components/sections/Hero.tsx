import { HERO, SITE } from "@/lib/content";
import { HeroVisual } from "../HeroVisual";
import { Mark } from "../Logo";

export function Hero() {
  return (
    <section id="top" aria-label="Introduction" className="grain relative isolate overflow-hidden" data-hero>
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_55%_at_72%_32%,rgb(0_200_120/0.13),transparent_70%),radial-gradient(40%_40%_at_10%_100%,rgb(13_23_18/0.9),transparent)]" />
      <div className="absolute inset-0 -z-10">
        <HeroVisual />
      </div>
      {/* Legibility scrim behind the headline, strongest bottom-left. */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-ink)_2%,rgb(8_11_10/0.7)_28%,transparent_62%),linear-gradient(to_right,rgb(8_11_10/0.65),transparent_55%)]" />

      <div className="wrap relative flex min-h-[100svh] flex-col justify-end pb-10 pt-32 md:pb-14" data-hero-content>
        <p className="hero-fade t-label mb-7 flex items-center gap-3 md:mb-9" style={{ ["--i" as string]: -4 }}>
          <span aria-hidden className="h-px w-10 bg-emerald" />
          {SITE.positioning}
        </p>

        <h1>
          <span className="ln hero-rise t-h4 mb-3 text-sage md:mb-5" style={{ ["--i" as string]: 0 }}>
            <span>Empowering businesses to</span>
          </span>{" "}
          <span className="t-display block">
            <span className="ln hero-rise" style={{ ["--i" as string]: 1 }}>
              <span>grow, scale</span>
            </span>{" "}
            <span className="ln hero-rise" style={{ ["--i" as string]: 2 }}>
              <span>and succeed.</span>
            </span>
          </span>
        </h1>

        <div className="mt-10 grid items-end gap-8 md:mt-14 md:grid-cols-12">
          <p className="hero-fade t-lead max-w-[34rem] md:col-span-6 lg:col-span-5" style={{ ["--i" as string]: 0 }}>
            {HERO.lead}
          </p>
          <div className="hero-fade flex flex-wrap gap-3 md:col-span-6 md:justify-end lg:col-span-7" style={{ ["--i" as string]: 1 }}>
            <a href="#contact" data-magnetic className="btn btn-primary">
              Let’s talk
              <Mark className="btn-mark" />
            </a>
            <a href="#services" className="btn btn-ghost">
              Explore our services
            </a>
          </div>
        </div>

        <a
          href="#about"
          className="hero-fade t-label group mt-12 hidden w-fit items-center gap-3 md:flex"
          style={{ ["--i" as string]: 3 }}
        >
          <span aria-hidden className="relative block h-10 w-px overflow-hidden bg-line">
            <span className="scroll-cue absolute inset-0 bg-emerald" />
          </span>
          <span className="transition-colors group-hover:text-paper">Scroll to discover</span>
        </a>
      </div>
    </section>
  );
}
