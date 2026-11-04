import { ABOUT, MISSION } from "@/lib/content";

const OPS = ["", "+", "+"];

export function About() {
  const words = ABOUT.statement.split(" ");
  return (
    <section className="section" aria-labelledby="about-title">
      <div className="wrap grid gap-x-8 gap-y-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <h2 id="about-title" className="t-h4 md:sticky md:top-28">
            <span className="mr-3 inline-block h-2 w-2 translate-y-[-0.15em] rounded-full bg-emerald" aria-hidden />
            Who we are
          </h2>
        </div>

        <div className="md:col-span-9">
          <p className="t-statement" data-scrub="words">
            {words.map((w, i) => (
              <span key={i}>
                <span className="w">{w}</span>{" "}
              </span>
            ))}
          </p>

          <div className="mt-16 grid gap-x-8 gap-y-12 md:mt-28 lg:grid-cols-9">
            <p className="t-lead max-w-[30rem] lg:col-span-4" data-reveal="fade">
              {ABOUT.body}
            </p>

            <div className="lg:col-span-5" data-reveal="fade" data-stagger>
              <p className="t-label mb-5">Our approach</p>
              <ul>
                {ABOUT.approach.map((a, i) => (
                  <li key={a} className="hairline-t grid grid-cols-[2.5rem_1fr] items-baseline py-4 md:py-5">
                    <span aria-hidden className="t-h3 text-emerald">{OPS[i]}</span>
                    <span className="t-h3">{a}</span>
                  </li>
                ))}
                <li className="grid grid-cols-[2.5rem_1fr] items-baseline border-t border-emerald/60 py-4 md:py-5">
                  <span aria-hidden className="t-h3 text-emerald">=</span>
                  <span className="t-h3 text-emerald">Measurable results</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Glyph({ kind }: { kind: (typeof MISSION.items)[number]["glyph"] }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, pathLength: 1 };
  return (
    <svg viewBox="0 0 96 96" className="glyph size-16 text-emerald md:size-24" aria-hidden data-draw>
      {kind === "target" && (
        <>
          <circle cx="44" cy="52" r="38" {...common} />
          <circle cx="44" cy="52" r="25" {...common} />
          <circle cx="44" cy="52" r="12" {...common} />
          <circle cx="44" cy="52" r="3" fill="currentColor" />
          <path d="M90 6L50 46M76 6h14v14" {...common} strokeLinejoin="round" />
        </>
      )}
      {kind === "growth" && (
        <>
          <path d="M6 90H90" {...common} opacity="0.5" />
          <path d="M6 76H30A10 10 0 0 0 40 66V54A10 10 0 0 1 50 44H66A10 10 0 0 0 76 34V12" {...common} />
          <path d="M66 22L76 12L86 22" {...common} strokeLinejoin="miter" />
        </>
      )}
      {kind === "partners" && (
        <>
          <path d="M48 26.5a26 26 0 0 1 0 43a26 26 0 0 1 0-43z" fill="currentColor" opacity="0.18" />
          <circle cx="34" cy="48" r="26" {...common} />
          <circle cx="62" cy="48" r="26" {...common} />
        </>
      )}
    </svg>
  );
}

export function Mission() {
  return (
    <section id="mission" className="section bg-forest" aria-labelledby="mission-title">
      <div className="wrap">
        <div className="mb-14 grid items-end gap-6 md:mb-24 md:grid-cols-12">
          <h2 id="mission-title" className="t-h2 md:col-span-7" data-reveal="lines">
            <span className="ln"><span>Our mission</span></span>
          </h2>
          <p className="t-lead max-w-[26rem] md:col-span-4 md:col-start-9" data-reveal="fade">
            {MISSION.intro}
          </p>
        </div>

        <ul>
          {MISSION.items.map((m) => (
            <li
              key={m.title}
              className="mission-row hairline-t relative grid grid-cols-[auto_1fr] items-start gap-x-6 gap-y-3 py-10 md:grid-cols-12 md:items-center md:gap-8 md:py-14"
              data-reveal="fade"
            >
              <span aria-hidden className="row-rule absolute inset-x-0 -top-px h-px bg-emerald" />
              <div className="row-span-2 md:col-span-2 md:row-span-1">
                <Glyph kind={m.glyph} />
              </div>
              <h3 className="t-h3 self-end md:col-span-5 md:self-auto">{m.title}</h3>
              <p className="max-w-[28rem] text-sage md:col-span-4 md:col-start-9">{m.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
