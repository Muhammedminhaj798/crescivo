import { CREATIVE, MARKETING, OPERATIONS, SERVICE_AREAS, STRATEGY } from "@/lib/content";
import { Matrix } from "../Matrix";
import { Timecode } from "../Timecode";
import { Mark } from "../Logo";

export function ServicesIntro() {
  return (
    <section className="section pb-0" aria-labelledby="services-title">
      <div className="wrap">
        <h2 id="services-title" className="t-h2 max-w-[14ch]" data-reveal="lines">
          <span className="ln"><span>From strategy</span></span>{" "}
          <span className="ln"><span>to execution.</span></span>
        </h2>
        <p className="t-statement mt-10 max-w-[44ch] text-sage md:mt-14" data-reveal="fade">
          Everything you need in one place. We pair business consulting with hands-on work across{" "}
          {SERVICE_AREAS.map((a, i) => (
            <span key={a.id}>
              <a href={`#${a.id}`} className="inline-link">{a.label}</a>
              {i < SERVICE_AREAS.length - 2 ? ", " : i === SERVICE_AREAS.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Strategy */
// Two concentric step-routes (the logo's parallel strokes) rising through three milestones.
const ROUTE_A = "M20 432H150A40 40 0 0 0 190 392V330A40 40 0 0 1 230 290H330A40 40 0 0 0 370 250V190A40 40 0 0 1 410 150H470A40 40 0 0 0 510 110V66";
const ROUTE_B = "M20 448H150A56 56 0 0 0 206 392V330A24 24 0 0 1 230 306H330A56 56 0 0 0 386 250V190A24 24 0 0 1 410 166H470A56 56 0 0 0 526 110V66";
const NODES = [
  { x: 92, y: 440, at: 0.1, label: { left: "3.3%", bottom: "12.5%" } },
  { x: 280, y: 298, at: 0.46, label: { left: "38.7%", bottom: "43.5%" } },
  { x: 440, y: 158, at: 0.76, label: { left: "68.7%", top: "38.5%" } },
];

export function Strategy() {
  return (
    <section id="strategy" className="section" aria-labelledby="strategy-title">
      <div className="wrap grid items-center gap-x-8 gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h3 id="strategy-title" className="t-h2 t-h2-compact" data-reveal="lines">
            <span className="ln"><span>Business</span></span>{" "}
            <span className="ln"><span>strategy &amp;</span></span>{" "}
            <span className="ln"><span>consulting</span></span>
          </h3>
          <div className="mt-10 max-w-[26rem]" data-reveal="fade">
            <h4 className="t-h4">{STRATEGY.subtitle}</h4>
            <p className="mt-3 text-sage">{STRATEGY.text}</p>
          </div>
          <ol className="mt-10 sm:hidden">
            {STRATEGY.items.map((it, i) => (
              <li key={it} className="hairline-t flex items-baseline gap-4 py-4">
                <span className="t-small t-num text-emerald">0{i + 1}</span>
                <span className="t-h4">{it}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="lg:col-span-8">
          <div className="roadmap relative mx-auto aspect-[600/480] w-full max-w-[760px]" data-roadmap>
            <svg viewBox="0 0 600 480" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden>
              <defs>
                <pattern id="rm-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="1" fill="#A0AAA3" opacity="0.22" />
                </pattern>
                <linearGradient id="rm-fade" x1="0" y1="1" x2="1" y2="0">
                  <stop offset="0" stopColor="#00C878" stopOpacity="0.25" />
                  <stop offset="0.3" stopColor="#00C878" />
                  <stop offset="1" stopColor="#B6FFD9" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="600" height="480" fill="url(#rm-grid)" />
              <path d="M0 470H600" stroke="#A0AAA3" strokeOpacity="0.25" />
              <g fill="none" stroke="#F5F7F5" strokeOpacity="0.08" strokeWidth="4" strokeLinecap="round">
                <path d={ROUTE_A} />
                <path d={ROUTE_B} />
              </g>
              <g fill="none" stroke="url(#rm-fade)" strokeWidth="4" strokeLinecap="round">
                <path className="route" d={ROUTE_A} pathLength={1} />
                <path className="route" d={ROUTE_B} pathLength={1} />
              </g>
              <path className="route" d="M481 74L518 43L555 74" pathLength={1} fill="none" stroke="#B6FFD9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="miter" />
              {NODES.map((n, i) => (
                <g key={i} data-at={n.at} data-on="true">
                  <circle cx={n.x} cy={n.y} r="17" fill="none" stroke="#00C878" strokeOpacity="0.35" className="node" />
                  <circle cx={n.x} cy={n.y} r="8" fill="#00C878" className="node" />
                </g>
              ))}
            </svg>
            <ol className="hidden sm:block">
              {STRATEGY.items.map((it, i) => (
                <li
                  key={it}
                  className="roadmap-label absolute w-[22%]"
                  style={NODES[i].label}
                  data-at={NODES[i].at}
                  data-on="true"
                >
                  <span className="t-small t-num block text-emerald">0{i + 1}</span>
                  <span className="mt-1 block text-[clamp(0.95rem,1.25vw,1.2rem)] font-[560] leading-tight tracking-[-0.01em] [font-stretch:108%]">{it}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Marketing */
export function Marketing() {
  return (
    <section id="marketing" className="section bg-forest" aria-labelledby="marketing-title">
      <div className="wrap">
        <h3 id="marketing-title" className="t-h2 mb-12 md:mb-20" data-reveal="lines">
          <span className="ln"><span>Marketing solutions</span></span>
        </h3>
        <div className="grid gap-x-8 md:grid-cols-12" data-marketing>
          <div className="sticky top-[4.5rem] z-10 -mx-4 bg-forest px-4 pb-6 pt-2 md:static md:col-span-5 md:mx-0 md:bg-transparent md:p-0">
            <div className="md:sticky md:top-28">
              <Matrix className="mx-auto h-[30vh] w-auto max-w-full md:h-auto md:w-full" />
            </div>
          </div>
          <ol className="mkt-list md:col-span-6 md:col-start-7">
            {MARKETING.items.map((it, i) => (
              <li
                key={it.title}
                className="mkt-item flex min-h-[44vh] flex-col justify-center py-10 md:min-h-[62vh]"
                data-index={i}
                data-on={i === 0 ? "true" : "false"}
              >
                <h4 className="t-h3">{it.title}</h4>
                <p className="t-lead mt-5 max-w-[30rem]">{it.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ Creative */
// Static audio waveform: 64 bars as one markup string (no per-bar hydration).
const WAVE = Array.from({ length: 64 }, (_, i) => {
  const h = 5 + Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.45)) * 23;
  return `<rect x="${i * 4}" y="${(28 - h).toFixed(1)}" width="3" height="${h.toFixed(1)}" fill="#B6FFD9" fill-opacity="0.7"/>`;
}).join("");
function VideoFrame() {
  return (
    <div className="crop aspect-[16/10] w-full">
      <span className="crop-b" />
      <div className="relative h-full w-full overflow-hidden bg-[#06100b]">
        <div className="footage absolute inset-[-25%] bg-[radial-gradient(35%_45%_at_35%_45%,rgb(0_200_120/0.55),transparent_70%),radial-gradient(30%_35%_at_70%_60%,rgb(182_255_217/0.25),transparent_70%),radial-gradient(50%_60%_at_60%_20%,rgb(13_23_18/1),transparent)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent_33.2%,rgb(245_247_245/0.12)_33.3%,transparent_33.4%,transparent_66.6%,rgb(245_247_245/0.12)_66.7%,transparent_66.8%),linear-gradient(to_bottom,transparent_33.2%,rgb(245_247_245/0.12)_33.3%,transparent_33.4%,transparent_66.6%,rgb(245_247_245/0.12)_66.7%,transparent_66.8%)]" />
        <div className="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 border border-paper/50 [clip-path:polygon(0_0,30%_0,30%_6%,6%_6%,6%_30%,0_30%,0_70%,6%_70%,6%_94%,30%_94%,30%_100%,70%_100%,70%_94%,94%_94%,94%_70%,100%_70%,100%_30%,94%_30%,94%_6%,70%_6%,70%_0,100%_0,100%_100%,0_100%)]" />
        <div className="t-small t-num absolute inset-x-4 top-3 flex items-center justify-between text-paper/85 md:inset-x-5 md:top-4">
          <span className="flex items-center gap-2"><span className="rec size-2 rounded-full bg-emerald" />REC</span>
          <Timecode />
        </div>
        <div className="absolute inset-x-4 bottom-4 md:inset-x-5 md:bottom-5">
          <svg viewBox="0 0 256 28" preserveAspectRatio="none" className="h-7 w-full opacity-70" aria-hidden dangerouslySetInnerHTML={{ __html: WAVE }} />
          <div className="relative mt-2 h-px bg-paper/30">
            <span className="playhead absolute inset-x-0 -top-1.5 block h-3.5"><span className="block h-full w-px bg-emerald" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArtboardFrame() {
  return (
    <div className="crop aspect-[5/4] w-full">
      <span className="crop-b" />
      <div className="relative h-full w-full overflow-hidden border border-line bg-ink">
        <svg viewBox="0 0 500 400" className="absolute inset-0 h-full w-full" aria-hidden>
          <g stroke="#A0AAA3" strokeOpacity="0.12">
            {[50, 125, 200, 275, 350, 425].map((x) => <path key={x} d={`M${x} 0V400`} />)}
          </g>
          {/* Pen-tool view of the brand curve: path, anchors, handles. */}
          <path d="M70 300C150 300 170 210 250 210S350 120 430 120" fill="none" stroke="#00C878" strokeWidth="3" />
          <g stroke="#F5F7F5" strokeOpacity="0.55">
            <path d="M70 300H150M250 210L170 210M250 210H330M430 120H350" />
          </g>
          <g fill="#F5F7F5">
            {[[150, 300], [170, 210], [330, 210], [350, 120]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r="4" />)}
          </g>
          <g fill="#080B0A" stroke="#00C878" strokeWidth="2">
            {[[70, 300], [250, 210], [430, 120]].map(([x, y]) => <rect key={`${x}${y}`} x={x - 6} y={y - 6} width="12" height="12" />)}
          </g>
          <path d="M436 132l14 34 5-14 14-5z" fill="#F5F7F5" />
        </svg>
        <div className="absolute inset-x-4 bottom-4 flex gap-2 md:inset-x-5 md:bottom-5">
          {[["#00C878", "Emerald"], ["#B6FFD9", "Mint"], ["#0D1712", "Forest"], ["#F5F7F5", "Paper"]].map(([c, n]) => (
            <span key={c} className="flex flex-1 flex-col gap-1.5">
              <span className="block h-6 border border-line" style={{ background: c }} />
              <span className="text-[0.7rem] leading-none text-sage">{n}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsFrame() {
  const lines = (n: number, w = ["92%", "78%", "86%", "60%"]) =>
    Array.from({ length: n }, (_, i) => <span key={i} className="block h-[3px] rounded-full bg-paper/15" style={{ width: w[i % w.length] }} />);
  return (
    <div className="crop aspect-[5/4] w-full">
      <span className="crop-b" />
      <div className="docs group relative h-full w-full overflow-hidden border border-line bg-[radial-gradient(70%_70%_at_50%_100%,rgb(0_200_120/0.12),transparent)]">
        <div className="absolute left-1/2 top-[14%] w-[36%] -translate-x-[95%] rotate-[-8deg] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-x-[110%] group-hover:rotate-[-12deg]">
          <div className="aspect-[1/1.414] border border-line bg-forest p-[10%]"><div className="flex flex-col gap-2">{lines(9)}</div></div>
        </div>
        <div className="absolute left-1/2 top-[14%] w-[36%] -translate-x-[5%] rotate-[7deg] transition-transform duration-700 ease-[var(--ease-expo)] group-hover:translate-x-[10%] group-hover:rotate-[11deg]">
          <div className="aspect-[1/1.414] border border-line bg-forest p-[10%]">
            <span className="mb-3 block aspect-[4/3] w-full bg-emerald/20" />
            <div className="flex flex-col gap-2">{lines(5)}</div>
          </div>
        </div>
        <div className="absolute left-1/2 top-[10%] w-[38%] -translate-x-1/2 transition-transform duration-700 ease-[var(--ease-expo)] group-hover:-translate-y-2">
          <div className="flex aspect-[1/1.414] flex-col justify-between border border-line-strong bg-ink p-[10%] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.8)]">
            <Mark className="w-[34%] text-emerald" />
            <div className="flex flex-col gap-2">
              <span className="block h-[6px] w-[80%] rounded-full bg-paper/70" />
              <span className="block h-[6px] w-[55%] rounded-full bg-paper/70" />
              <span className="mt-2 block h-[3px] w-[40%] rounded-full bg-emerald" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Creative() {
  const [video, design, docs] = CREATIVE.items;
  const Caption = ({ item }: { item: (typeof CREATIVE.items)[number] }) => (
    <figcaption className="mt-6 grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] md:gap-6">
      <h4 className="t-h4">{item.title}</h4>
      <p className="text-sage">{item.text}</p>
    </figcaption>
  );
  return (
    <section id="creative" className="section" aria-labelledby="creative-title">
      <div className="wrap">
        <h3 id="creative-title" className="t-h2 mb-12 md:mb-20" data-reveal="lines">
          <span className="ln"><span>Creative &amp;</span></span>{" "}
          <span className="ln"><span>media services</span></span>
        </h3>
        <div className="grid gap-x-8 gap-y-16 lg:grid-cols-12">
          <div className="lg:col-span-7 lg:row-span-2">
            <figure className="lg:sticky lg:top-28" data-reveal="fade">
              <VideoFrame />
              <Caption item={video} />
            </figure>
          </div>
          <figure className="lg:col-span-5" data-reveal="fade">
            <ArtboardFrame />
            <Caption item={design} />
          </figure>
          <figure className="lg:col-span-5" data-reveal="fade">
            <DocumentsFrame />
            <Caption item={docs} />
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ HR & Technology */
export function Operations() {
  return (
    <section id="operations" className="section bg-forest" aria-labelledby="operations-title">
      <div className="wrap">
        <h3 id="operations-title" className="t-h2 mb-12 md:mb-20" data-reveal="lines">
          <span className="ln"><span>HR &amp; technology</span></span>{" "}
          <span className="ln"><span>solutions</span></span>
        </h3>
        <div className="grid gap-x-16 gap-y-14 md:grid-cols-2">
          <div data-reveal="fade">
            <h4 className="t-label mb-4">Human resources</h4>
            <ul>
              {OPERATIONS.hr.map((h) => (
                <li key={h} className="hairline-t t-h4 py-5 md:py-6">{h}</li>
              ))}
            </ul>
          </div>
          <div data-reveal="fade">
            <h4 className="t-label mb-4">Technology services</h4>
            <ul>
              {OPERATIONS.tech.map((t) => (
                <li key={t.title} className="hairline-t py-5 md:py-6">
                  <span className="t-h4 block">{t.title}</span>
                  <span className="mt-1.5 block text-sage">{t.text}</span>
                </li>
              ))}
            </ul>
            <a href="#solutions" className="link-sweep t-small mt-6 inline-flex items-center gap-2 text-mint">
              See our full technology stack
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
