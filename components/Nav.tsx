"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { NAV, SITE } from "@/lib/content";
import { Logo, Mark } from "./Logo";

export function Nav() {
  const [active, setActive] = useState<string>("");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bar, setBar] = useState({ x: 0, w: 0 });
  const listRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll-spy: the section crossing the upper-middle band of the viewport is active.
  useEffect(() => {
    const ids = NAV.map((n) => n.href.slice(1));
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const hero = document.getElementById("top");
    const heroIo = hero
      ? new IntersectionObserver(([e]) => e.isIntersecting && e.intersectionRatio > 0.5 && setActive(""), { threshold: [0.5] })
      : null;
    if (hero) heroIo!.observe(hero);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      heroIo?.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useLayoutEffect(() => {
    const link = listRef.current?.querySelector<HTMLAnchorElement>(`a[href="#${active}"]`);
    setBar(link ? { x: link.offsetLeft, w: link.offsetWidth } : { x: bar.x, w: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Mobile menu: lock scroll, close on Escape, move focus in and back out.
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.classList.add("lenis-stopped");
    root.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      root.classList.remove("lenis-stopped");
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        scrolled && !open ? "border-b border-line bg-ink/80 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Primary" className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <a href="#top" className="relative z-10 -m-2 p-2" aria-label="Crescivo Business Solutions — back to top">
          <Logo className="h-8 w-auto text-paper md:h-9" />
        </a>

        <ul ref={listRef} className="relative hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <a
                href={n.href}
                aria-current={active === n.href.slice(1) ? "location" : undefined}
                className={`block px-3.5 py-2 text-[0.9rem] font-[480] transition-colors duration-300 hover:text-paper ${
                  active === n.href.slice(1) ? "text-paper" : "text-sage"
                }`}
              >
                {n.label}
              </a>
            </li>
          ))}
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-0.5 left-0 h-[2px] bg-emerald transition-[transform,width,opacity] duration-700 ease-[var(--ease-expo)]"
            style={{ transform: `translateX(${bar.x + 14}px)`, width: Math.max(bar.w - 28, 0), opacity: bar.w ? 1 : 0 }}
          />
        </ul>

        <div className="flex items-center gap-3">
          <a href="#contact" data-magnetic className="btn btn-primary hidden !h-11 !px-5 sm:inline-flex">
            Let’s talk
            <Mark className="btn-mark" />
          </a>
          <button
            ref={toggleRef}
            type="button"
            className="relative z-10 grid size-11 place-items-center rounded-full border border-line-strong lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-px w-full bg-paper transition-transform duration-500 ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-paper transition-transform duration-500 ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="fixed inset-0 z-0 overflow-y-auto bg-ink pt-[4.5rem] lg:hidden"
      >
        <div className="wrap flex min-h-full flex-col justify-between gap-12 pb-10 pt-8">
          <ul className="flex flex-col">
            {NAV.map((n, i) => (
              <li key={n.href} className="hairline-b">
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="hero-fade block py-4 text-[2rem] font-semibold leading-none tracking-[-0.03em] [font-stretch:118%]"
                  style={{ ["--i" as string]: i - 5 }}
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="t-small flex flex-col gap-1 text-sage">
            <a className="text-paper" href={`mailto:${SITE.email}`}>{SITE.email}</a>
            <a className="text-paper" href={SITE.phoneHref}>{SITE.phone}</a>
          </div>
        </div>
      </div>
    </header>
  );
}
