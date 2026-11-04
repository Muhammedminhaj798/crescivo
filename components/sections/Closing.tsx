import { BriefcaseBusiness, ChartColumn, CircleCheck, Globe, Mail, Phone, SlidersHorizontal } from "lucide-react";
import { CTA, NAV, PROCESS, SERVICE_AREAS, SITE, WHY } from "@/lib/content";
import { Logo, Mark } from "../Logo";

const WHY_ICONS = { check: CircleCheck, sliders: SlidersHorizontal, chart: ChartColumn, briefcase: BriefcaseBusiness } as const;

export function Why() {
  return (
    <section id="why" className="section" aria-labelledby="why-title">
      <div className="wrap grid gap-x-8 gap-y-16 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 id="why-title" className="t-h4 flex items-center gap-3">
            <span aria-hidden className="inline-block size-2 rounded-full bg-emerald" />
            {WHY.title}
          </h2>
          <p className="t-display mt-8 !text-[clamp(3.25rem,7.2vw,6.5rem)]" data-scrub="words">
            {WHY.motto.map((m) => (
              <span key={m} className="block">
                <span className="w">{m}</span>
              </span>
            ))}
          </p>
        </div>

        <ul className="grid self-end border-line sm:grid-cols-2 lg:col-span-6 lg:col-start-7" data-reveal="fade" data-stagger>
          {WHY.items.map((it, i) => {
            const Icon = WHY_ICONS[it.icon];
            return (
              <li
                key={it.title}
                className={`border-line py-10 sm:px-8 ${i % 2 === 0 ? "sm:border-r sm:pl-0" : "sm:pr-0"} ${i < 2 ? "border-b" : "border-b sm:border-b-0"}`}
              >
                <Icon aria-hidden className="size-7 text-emerald" strokeWidth={1.4} />
                <h3 className="t-h3 mt-10 !text-[clamp(1.45rem,2.1vw,2rem)]">{it.title}</h3>
                <p className="mt-3 max-w-[20rem] text-sage">{it.text}</p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section id="process" className="process relative bg-forest" aria-labelledby="process-title" data-process>
      <div className="wrap section flex flex-col justify-center lg:min-h-[100svh]">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <h2 id="process-title" className="t-h2 lg:col-span-9" data-reveal="lines">
            <span className="ln"><span>Our proven process</span></span>
          </h2>
          <p className="t-label lg:col-span-3 lg:col-start-10 lg:text-right" aria-hidden>
            <span className="t-num text-paper" data-process-count>04</span> / 04
          </p>
        </div>

        <ol className="relative mt-16 grid gap-y-14 pl-10 lg:mt-24 lg:grid-cols-4 lg:gap-x-8 lg:pl-0 lg:pt-14">
          {/* Twin rail: the brand's parallel strokes as progress. */}
          <span aria-hidden className="absolute inset-x-0 top-0 hidden h-[7px] lg:block">
            <span className="absolute inset-x-0 top-0 h-px bg-line-strong" />
            <span className="absolute inset-x-0 bottom-0 h-px bg-line-strong" />
            <span className="rail-fill absolute inset-x-0 top-0 h-px bg-emerald" />
            <span className="rail-fill absolute inset-x-0 bottom-0 h-px bg-mint/70" />
          </span>
          <span aria-hidden className="absolute bottom-0 left-[7px] top-2 w-[7px] lg:hidden">
            <span className="absolute inset-y-0 left-0 w-px bg-line-strong" />
            <span className="absolute inset-y-0 right-0 w-px bg-line-strong" />
            <span className="rail-fill-v absolute inset-y-0 left-0 w-px bg-emerald" />
            <span className="rail-fill-v absolute inset-y-0 right-0 w-px bg-mint/70" />
          </span>

          {PROCESS.steps.map((s, i) => (
            <li key={s.title} className="step relative" data-on="true">
              <span
                aria-hidden
                className="step-node absolute -left-10 top-[0.6rem] size-[21px] rounded-full border-[5px] border-forest bg-emerald shadow-[0_0_0_1px_var(--color-emerald)] lg:-top-[4.25rem] lg:left-0"
              />
              <span aria-hidden className="step-num num-outline t-num block text-[clamp(3.5rem,6vw,6rem)] font-semibold leading-none tracking-[-0.04em] text-emerald [font-stretch:125%]">
                0{i + 1}
              </span>
              <h3 className="t-h3 mt-6">{s.title}</h3>
              <p className="mt-3 max-w-[18rem] text-sage">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Contact() {
  const mail = `mailto:${SITE.email}?subject=${encodeURIComponent("Let’s grow together")}`;
  const rows = [
    { label: "Phone", value: SITE.phone, href: SITE.phoneHref, Icon: Phone },
    { label: "Email", value: SITE.email, href: `mailto:${SITE.email}`, Icon: Mail },
    { label: "Website", value: SITE.website, href: SITE.url, Icon: Globe },
  ];
  return (
    <section id="contact" className="section grain relative overflow-hidden" aria-labelledby="contact-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_85%_20%,rgb(0_200_120/0.14),transparent_70%)]" />
      <svg
        viewBox="96 150 506 396"
        aria-hidden
        className="pointer-events-none absolute -right-[3vw] top-[4%] hidden w-[38vw] max-w-[640px] text-emerald opacity-80 md:block"
        data-draw-scrub
      >
        <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
          <path pathLength={1} d="M120.5 479.5V469.5A105 105 0 0 1 225.5 364.5H387.5A60 60 0 0 0 447.5 304.5V235" />
          <path pathLength={1} d="M206.5 520.5V489.5A40 40 0 0 1 246.5 449.5H403.5A130 130 0 0 0 533.5 319.5V235" />
          <path pathLength={1} strokeLinejoin="miter" d="M403.5 254.7L490.5 182.6L577.5 254.7" />
        </g>
      </svg>

      <div className="wrap relative">
        <h2 id="contact-title" className="t-display" data-reveal="lines">
          <span className="ln"><span>Let’s grow</span></span>{" "}
          <span className="ln"><span>together.</span></span>
        </h2>

        <div className="mt-14 grid gap-x-8 gap-y-14 md:mt-20 lg:grid-cols-12">
          <div className="lg:col-span-5" data-reveal="fade">
            <p className="t-lead !text-paper">{CTA.lead}</p>
            <p className="t-lead mt-4">
              {CTA.question} {CTA.text}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a href={mail} data-magnetic className="btn btn-primary">
                Start a conversation
                <Mark className="btn-mark" />
              </a>
              <a href={SITE.phoneHref} className="btn btn-ghost">
                Call us
              </a>
            </div>
          </div>

          <dl className="lg:col-span-6 lg:col-start-7" data-reveal="fade" data-stagger>
            {rows.map(({ label, value, href, Icon }) => (
              <div key={label} className="hairline-t group">
                <dt className="t-label flex items-center gap-2 pt-5">
                  <Icon aria-hidden className="size-4 text-emerald" strokeWidth={1.5} />
                  {label}
                </dt>
                <dd className="pb-5 pt-2">
                  <a
                    href={href}
                    className="link-sweep text-[clamp(1.4rem,2.6vw,2.4rem)] font-[540] leading-tight tracking-[-0.025em] [font-stretch:110%] hover:text-mint"
                  >
                    {value}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  const company = NAV.filter((n) => n.href !== "#services" && n.href !== "#solutions");
  const services = [...SERVICE_AREAS.map((a) => ({ href: `#${a.id}`, label: a.label[0].toUpperCase() + a.label.slice(1) })), { href: "#solutions", label: "Technology & software solutions" }];
  return (
    <footer className="border-t border-line bg-ink">
      <div className="wrap grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-12 lg:col-span-4">
          <a href="#top" aria-label="Crescivo Business Solutions — back to top" className="inline-block">
            <Logo className="h-10 w-auto text-paper" />
          </a>
          <p className="mt-6 max-w-[20rem] text-sage">
            Your growth, our strategy. A business consulting &amp; technology partner.
          </p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-8 lg:col-span-5">
          <div>
            <h2 className="t-label mb-4">Company</h2>
            <ul className="space-y-2.5">
              {company.map((n) => (
                <li key={n.href}><a className="link-sweep hover:text-mint" href={n.href}>{n.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="t-label mb-4">Services</h2>
            <ul className="space-y-2.5">
              {services.map((n) => (
                <li key={n.href}><a className="link-sweep hover:text-mint" href={n.href}>{n.label}</a></li>
              ))}
            </ul>
          </div>
        </nav>
        <div className="md:col-span-4 lg:col-span-3">
          <h2 className="t-label mb-4">Get in touch</h2>
          <ul className="space-y-2.5">
            <li><a className="link-sweep hover:text-mint" href={SITE.phoneHref}>{SITE.phone}</a></li>
            <li><a className="link-sweep hover:text-mint" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
            <li><a className="link-sweep hover:text-mint" href={SITE.url}>{SITE.website}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap t-small flex flex-col gap-3 py-6 text-sage sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <a href="#top" className="link-sweep w-fit hover:text-paper">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
