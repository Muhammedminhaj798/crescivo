"use client";

import dynamic from "next/dynamic";
import { SceneMount } from "./three/SceneMount";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

function Lines({ className, viewBox, paths, w }: { className: string; viewBox: string; paths: string[]; w: [number, number] }) {
  return (
    <svg viewBox={viewBox} preserveAspectRatio="xMidYMid slice" className={`absolute inset-0 h-full w-full ${className}`}>
      {[{ f: "url(#hf-glow)", w: w[0], o: 0.55 }, { f: undefined, w: w[1], o: 1 }].map((s, i) => (
        <g key={i} fill="none" stroke="url(#hf-line)" strokeWidth={s.w} strokeLinecap="round" filter={s.f} opacity={s.o}>
          {paths.map((d, j) => (
            <path key={j} className={j === 2 ? "draw-in draw-late" : "draw-in"} pathLength={1} d={d} strokeLinejoin="miter" />
          ))}
        </g>
      ))}
    </svg>
  );
}

/** Static vector echo of the 3D scene: shown before WebGL is ready, and kept when it is unavailable. */
function HeroFallback() {
  return (
    <>
      <svg aria-hidden className="absolute size-0">
        <defs>
          <linearGradient id="hf-line" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#00C878" stopOpacity="0" />
            <stop offset="0.35" stopColor="#00C878" />
            <stop offset="1" stopColor="#B6FFD9" />
          </linearGradient>
          <filter id="hf-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>
      </svg>
      <div className="absolute inset-x-[-25%] bottom-[-18%] h-[75%] [perspective:900px]">
        <div className="h-full w-full origin-bottom [transform:rotateX(66deg)] bg-[radial-gradient(circle,rgb(160_170_163/0.75)_1.2px,transparent_1.9px)] bg-[length:26px_26px] [mask-image:radial-gradient(ellipse_at_62%_30%,black_10%,transparent_62%)]" />
      </div>
      <Lines className="hidden lg:block" viewBox="0 0 1600 900" w={[10, 3]} paths={[
        "M380 640H880A170 170 0 0 0 1050 470V168",
        "M380 682H880A212 212 0 0 0 1092 470V168",
        "M979 216L1071 140L1163 216",
      ]} />
      <Lines className="lg:hidden" viewBox="0 0 390 844" w={[7, 2.2]} paths={[
        "M-20 586H140A100 100 0 0 0 240 486V292",
        "M-20 608H140A122 122 0 0 0 262 486V292",
        "M199 306L251 262L303 306",
      ]} />
    </>
  );
}

// Phones keep the vector hero: three.js is too heavy a cost for a view that is scrolled past in seconds.
// Elsewhere the scene is pointer-driven, so it loads on the first pointer/key input; until then the
// vector composition (same lines, same intro timing) stands in.
// ponytail: R3F mounts in one commit (~0.45 s main thread once, on first input); split the scene mount
// across frames if that hitch ever shows up on low-end laptops.
const skipWebGL = () =>
  matchMedia("(max-width: 1023px) and (pointer: coarse)").matches ||
  (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;

export function HeroVisual() {
  return (
    <SceneMount
      skip={skipWebGL}
      trigger="interaction"
      className="hero-visual-in absolute inset-0"
      fallback={<HeroFallback />}
      render={(env) => <HeroScene {...env} />}
    />
  );
}
