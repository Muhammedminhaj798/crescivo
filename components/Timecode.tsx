"use client";

import { useEffect, useRef } from "react";

/** SMPTE-style timecode that runs at 25 fps while visible. Writes text directly to avoid re-renders. */
export function Timecode() {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0, timer = 0;
    const pad = (n: number) => String(n).padStart(2, "0");
    const tick = () => {
      frame++;
      const f = frame % 25, s = Math.floor(frame / 25);
      el.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}:${pad(f)}`;
    };
    const io = new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) timer = window.setInterval(tick, 40);
    });
    io.observe(el);
    return () => (io.disconnect(), clearInterval(timer));
  }, []);
  return <span ref={ref}>00:00:00:00</span>;
}
