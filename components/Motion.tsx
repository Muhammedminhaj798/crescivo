"use client";

import { useEffect } from "react";
import { stack } from "@/lib/sceneBus";

/**
 * One place for scroll choreography. Sections stay server-rendered and opt in with data attributes:
 *   data-reveal="lines"  masked line rise (.ln > span)
 *   data-reveal="fade"   soft rise; add data-stagger to stagger direct children
 *   data-scrub="words"   words brighten with scroll (.w)
 *   data-draw            SVG strokes (with pathLength) draw in once
 *   data-draw-scrub      SVG strokes draw with scroll
 * plus section hooks: data-hero, data-roadmap, data-marketing, data-process, data-software.
 * GSAP + Lenis load after hydration so they never block first paint. Content is fully visible without JS.
 */
export function Motion() {
  useEffect(() => {
    const cleanups: (() => void)[] = [];
    let cancelled = false;

    // Magnetic buttons (fine pointers only). CSS transition on .btn handles the easing.
    if (matchMedia("(pointer: fine)").matches && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.22}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
        };
        const leave = () => (el.style.transform = "");
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => (el.removeEventListener("pointermove", move), el.removeEventListener("pointerleave", leave)));
      });
    }

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      stack.explode = 1;
      return () => cleanups.forEach((c) => c());
    }

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({ lerp: 0.11, anchors: true, autoRaf: false }); // offset comes from CSS scroll-margin-top
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (t: number) => lenis.raf(t * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);

      const mm = gsap.matchMedia();
      const ctx = gsap.context(() => {
        const $ = <T extends Element = HTMLElement>(s: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(s) as NodeListOf<T>);

        // Hero copy drifts up and dims as the hero leaves.
        const hero = document.querySelector("[data-hero]");
        if (hero) {
          gsap.to("[data-hero-content]", {
            yPercent: -10, opacity: 0.1, ease: "none",
            scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
          });
        }

        $('[data-reveal="lines"]').forEach((el) =>
          gsap.from($(".ln > span", el), {
            yPercent: 112, duration: 1.25, ease: "expo.out", stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );

        $('[data-reveal="fade"]').forEach((el) =>
          gsap.from(el.hasAttribute("data-stagger") ? Array.from(el.children) : el, {
            y: 36, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.09,
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }),
        );

        $('[data-scrub="words"]').forEach((el) =>
          gsap.fromTo($(".w", el), { opacity: 0.4 }, {
            opacity: 1, ease: "none", stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 50%", scrub: true },
          }),
        );

        $<SVGSVGElement>("[data-draw]").forEach((svg) => {
          const shapes = $<SVGGeometryElement>("[pathLength]", svg);
          gsap.set(shapes, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.to(shapes, {
            strokeDashoffset: 0, duration: 1.8, ease: "power3.inOut", stagger: 0.14,
            scrollTrigger: { trigger: svg, start: "top 88%", once: true },
          });
        });

        $<SVGSVGElement>("[data-draw-scrub]").forEach((svg) => {
          const shapes = $<SVGGeometryElement>("[pathLength]", svg);
          gsap.set(shapes, { strokeDasharray: 1, strokeDashoffset: 1 });
          gsap.timeline({ scrollTrigger: { trigger: svg.parentElement, start: "top 75%", end: "center 45%", scrub: 0.6 } })
            .to(shapes.slice(0, 2), { strokeDashoffset: 0, ease: "none", duration: 0.8 })
            .to(shapes.slice(2), { strokeDashoffset: 0, ease: "power2.out", duration: 0.2 });
        });

        // Strategy roadmap: the twin route draws with scroll; milestones light as it reaches them.
        const rm = document.querySelector<HTMLElement>("[data-roadmap]");
        if (rm) {
          const routes = $<SVGPathElement>("path.route", rm);
          const marks = $<HTMLElement>("[data-at]", rm);
          gsap.set(routes, { strokeDashoffset: 1 });
          marks.forEach((m) => (m.dataset.on = "false"));
          const tl = gsap.timeline({
            scrollTrigger: { trigger: rm, start: "top 78%", end: "bottom 55%", scrub: 0.8 },
            onUpdate: () => {
              const p = tl.progress();
              marks.forEach((m) => (m.dataset.on = String(p >= Number(m.dataset.at))));
            },
          });
          tl.to(routes.slice(0, 2), { strokeDashoffset: 0, ease: "none", duration: 0.9 })
            .to(routes.slice(2), { strokeDashoffset: 0, ease: "power2.out", duration: 0.1 });
        }

        // Marketing: the item crossing the middle of the viewport drives the dot-matrix pattern.
        const mk = document.querySelector<HTMLElement>("[data-marketing]");
        if (mk) {
          const matrix = mk.querySelector<SVGSVGElement>(".matrix")!;
          const list = mk.querySelector<HTMLElement>(".mkt-list")!;
          const items = $<HTMLElement>(".mkt-item", mk);
          list.dataset.js = "";
          items.forEach((it, i) =>
            ScrollTrigger.create({
              trigger: it, start: "top 62%", end: "bottom 62%",
              onToggle: (self) => {
                if (!self.isActive) return;
                matrix.dataset.active = String(i);
                items.forEach((x) => (x.dataset.on = String(x === it)));
              },
            }),
          );
        }

        // Software: the stack separates as the section arrives.
        const sw = document.querySelector("[data-software]");
        if (sw) {
          ScrollTrigger.create({
            trigger: sw, start: "top 85%", end: "center 45%",
            onUpdate: (self) => (stack.explode = self.progress),
          });
        }

        // Process: twin rail fills with scroll; pinned on desktop, free-flowing on smaller screens.
        const pr = document.querySelector<HTMLElement>("[data-process]");
        if (pr) {
          const steps = $<HTMLElement>(".step", pr);
          const count = pr.querySelector<HTMLElement>("[data-process-count]");
          pr.dataset.js = "";
          const set = (p: number) => {
            pr.style.setProperty("--p", p.toFixed(4));
            let n = 0;
            steps.forEach((s, i) => {
              const on = p >= i / steps.length + 0.01;
              s.dataset.on = String(on);
              if (on) n++;
            });
            if (count) count.textContent = `0${Math.max(n, 1)}`;
          };
          set(0);
          mm.add("(min-width: 1024px)", () => {
            ScrollTrigger.create({ trigger: pr, start: "top top", end: "+=140%", pin: true, refreshPriority: 1, onUpdate: (s) => set(s.progress) });
          });
          mm.add("(max-width: 1023.98px)", () => {
            ScrollTrigger.create({ trigger: pr.querySelector("ol"), start: "top 70%", end: "bottom 55%", onUpdate: (s) => set(s.progress) });
          });
        }
      });

      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh);

      cleanups.push(() => {
        window.removeEventListener("load", refresh);
        mm.revert();
        ctx.revert();
        gsap.ticker.remove(tick);
        lenis.destroy();
      });
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((c) => c());
    };
  }, []);

  return null;
}
