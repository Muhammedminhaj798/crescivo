"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { SOFTWARE } from "@/lib/content";
import { stack } from "@/lib/sceneBus";
import { SceneMount } from "../three/SceneMount";

const StackScene = dynamic(() => import("../three/StackScene"), { ssr: false });

// Isometric projection for the static fallback.
const iso = (x: number, y: number, z: number) => [300 + (x - z) * 62, 250 + (x + z) * 36 - y * 72] as const;
const slab = (y: number) =>
  [[-2, -1.3], [2, -1.3], [2, 1.3], [-2, 1.3]].map(([x, z]) => iso(x, y, z).join(",")).join(" ");

function StackFallback({ active }: { active: number }) {
  return (
    <svg viewBox="0 0 600 500" className="absolute inset-0 h-full w-full" aria-hidden>
      {[2, 1, 0].map((i) => (
        <polygon
          key={i}
          points={slab((1 - i) * 1.05)}
          fill="#0D1712"
          fillOpacity="0.9"
          stroke={active === i ? "#B6FFD9" : "#00C878"}
          strokeOpacity={active === i ? 1 : 0.45}
          className="transition-[stroke,stroke-opacity] duration-500"
        />
      ))}
    </svg>
  );
}

export function Software() {
  const [hover, setHover] = useState<number | null>(null);
  const [auto, setAuto] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const active = hover ?? auto;

  // Gently cycle the highlighted layer while visible, so the mapping reads without hover (touch screens).
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(() => setAuto((a) => (a + 1) % 3), 3200);
    });
    io.observe(ref.current!);
    return () => (io.disconnect(), clearInterval(timer));
  }, []);

  useEffect(() => {
    stack.active = active;
  }, [active]);

  return (
    <section ref={ref} id="software" className="section overflow-hidden" aria-labelledby="software-title" data-software>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_50%_at_75%_50%,rgb(0_200_120/0.09),transparent_70%)]" />
      <div className="wrap relative grid items-center gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 id="software-title" className="t-h2 t-h2-compact" data-reveal="lines">
            <span className="ln"><span>Software</span></span>{" "}
            <span className="ln"><span>development</span></span>
          </h3>
          <p className="t-lead mt-8 max-w-[30rem]" data-reveal="fade">{SOFTWARE.text}</p>

          <ul className="mt-12" onMouseLeave={() => setHover(null)}>
            {SOFTWARE.items.map((it, i) => (
              <li
                key={it.title}
                onMouseEnter={() => setHover(i)}
                className="hairline-t relative cursor-default py-6"
              >
                <span
                  aria-hidden
                  className={`absolute -top-px left-0 h-px bg-emerald transition-[width] duration-700 ease-[var(--ease-expo)] ${active === i ? "w-full" : "w-0"}`}
                />
                <h4 className={`t-h4 transition-colors duration-500 ${active === i ? "text-paper" : "text-sage"}`}>{it.title}</h4>
                <p className={`mt-2 max-w-[28rem] transition-colors duration-500 ${active === i ? "text-sage" : "text-dim"}`}>{it.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative aspect-[6/5] w-full lg:col-span-7">
          <SceneMount fallback={<StackFallback active={active} />} render={(env) => <StackScene {...env} />} />
        </div>
      </div>
    </section>
  );
}
