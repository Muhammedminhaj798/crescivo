import { buildMatrix, N } from "@/lib/matrix";

const CELL = 20;

// Built once at build time as a markup string: 441 decorative circles that React never has to hydrate.
const CIRCLES = buildMatrix()
  .map((d) => {
    const cls = [0, 1, 2].flatMap((p) => (d.on[p] ? [`p${p}`] : [])).concat(d.hot.some(Boolean) ? ["hot"] : []);
    return `<circle cx="${d.i * CELL + CELL / 2}" cy="${d.j * CELL + CELL / 2}" r="3.4"${cls.length ? ` class="${cls.join(" ")}"` : ""} style="--d:${Math.round(d.d * 22)}ms"/>`;
  })
  .join("");

/** Dot matrix; the active pattern is switched via data-active and CSS does the rest. */
export function Matrix({ className }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 ${N * CELL} ${N * CELL}`}
      className={`matrix ${className ?? ""}`}
      data-active="0"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: CIRCLES }}
    />
  );
}
