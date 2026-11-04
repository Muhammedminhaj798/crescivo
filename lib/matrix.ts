// Dot-matrix patterns for the marketing "signal" visual. Pure and computed at build time.
//  0 · Digital marketing     → broadcast rings radiating from a source
//  1 · Traditional campaigns → local clusters (communities)
//  2 · Online branding       → the Crescivo mark, rendered in dots

export const N = 21;
const C = (N - 1) / 2;

export type Dot = { i: number; j: number; on: [boolean, boolean, boolean]; hot: [boolean, boolean, boolean]; d: number };

const CLUSTERS: [number, number, number][] = [
  [4, 5, 1.8], [15, 4, 1.5], [5, 15, 2.2], [15, 15, 1.8], [10, 10, 1.2], [17, 9, 1.0],
];

// The mark's strokes in its native 700-unit space (see components/Logo.tsx).
function markSamples() {
  const pts: [number, number][] = [];
  const line = (x0: number, y0: number, x1: number, y1: number) => {
    for (let t = 0; t <= 1; t += 0.02) pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t]);
  };
  const arc = (cx: number, cy: number, r: number, a0: number, a1: number) => {
    for (let t = 0; t <= 1; t += 0.02) {
      const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180;
      pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
    }
  };
  line(120.5, 479.5, 120.5, 469.5); arc(225.5, 469.5, 105, 180, 270); line(225.5, 364.5, 387.5, 364.5); arc(387.5, 304.5, 60, 90, 0); line(447.5, 304.5, 447.5, 235);
  line(206.5, 520.5, 206.5, 489.5); arc(246.5, 489.5, 40, 180, 270); line(246.5, 449.5, 403.5, 449.5); arc(403.5, 319.5, 130, 90, 0); line(533.5, 319.5, 533.5, 235);
  line(403.5, 254.7, 490.5, 182.6); line(490.5, 182.6, 577.5, 254.7);
  return pts;
}

export function buildMatrix(): Dot[] {
  const mark = markSamples();
  const cell = 506 / (N - 2);
  const rowOffset = (N - 396 / cell) / 2;
  const dots: Dot[] = [];
  for (let j = 0; j < N; j++) {
    for (let i = 0; i < N; i++) {
      const d = Math.hypot(i - C, j - C);
      const ring = [2.6, 5.4, 8.2].some((r) => Math.abs(d - r) < 0.5);
      const cl = CLUSTERS.find(([cx, cy, r]) => Math.hypot(i - cx, j - cy) <= r);
      const X = 96 + (i - 1 + 0.5) * cell;
      const Y = 150 + (j - rowOffset + 0.5) * cell;
      let m = Infinity;
      for (const [px, py] of mark) m = Math.min(m, Math.hypot(px - X, py - Y));
      const inMark = m < cell * 0.62;
      dots.push({
        i, j, d,
        on: [ring || d < 1.1, !!cl, inMark],
        hot: [d < 1.1, !!cl && cl[0] === i && cl[1] === j, inMark && Y < 260],
      });
    }
  }
  return dots;
}

// Self-check: `node --experimental-strip-types lib/matrix.ts` prints each pattern as ASCII.
if (typeof process !== "undefined" && process.argv[1]?.endsWith("matrix.ts")) {
  const dots = buildMatrix();
  for (let p = 0; p < 3; p++) {
    const rows: string[] = [];
    for (let j = 0; j < N; j++) rows.push(dots.filter((d) => d.j === j).map((d) => (d.hot[p] ? "@" : d.on[p] ? "o" : ".")).join(" "));
    const count = dots.filter((d) => d.on[p]).length;
    console.log(`pattern ${p} (${count} dots)\n${rows.join("\n")}\n`);
    if (count < 12) throw new Error(`pattern ${p} is too sparse`);
  }
}
