"use client";

import { useState } from "react";
import {
  Calendar, Cloud, Code, Cpu, DollarSign, Layers, LayoutGrid, Link, MessageCircle, Mic, Monitor, Server,
  ShoppingCart, Smartphone, UserPlus, Users, type LucideIcon,
} from "lucide-react";
import { SOLUTIONS } from "@/lib/content";

const ICONS: Record<(typeof SOLUTIONS.items)[number]["icon"], LucideIcon> = {
  layers: Layers, users: Users, "user-plus": UserPlus, dollar: DollarSign, cart: ShoppingCart, monitor: Monitor,
  phone: Smartphone, cloud: Cloud, cpu: Cpu, mic: Mic, message: MessageCircle, calendar: Calendar, grid: LayoutGrid,
  code: Code, link: Link, server: Server,
};

type Group = (typeof SOLUTIONS.groups)[number]["id"] | "all";

export function Solutions() {
  const [group, setGroup] = useState<Group>("all");
  const count = (g: Group) => (g === "all" ? SOLUTIONS.items.length : SOLUTIONS.items.filter((i) => i.group === g).length);
  const label = (g: string) => SOLUTIONS.groups.find((x) => x.id === g)?.label;

  return (
    <section id="solutions" className="section bg-forest" aria-labelledby="solutions-title">
      <div className="wrap">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <h2 id="solutions-title" className="t-h2 lg:col-span-7" data-reveal="lines">
            <span className="ln"><span>Technology &amp;</span></span>{" "}
            <span className="ln"><span>software solutions</span></span>
          </h2>
          <p className="t-lead max-w-[30rem] lg:col-span-4 lg:col-start-9" data-reveal="fade">{SOLUTIONS.text}</p>
        </div>

        <div role="group" aria-label="Filter capabilities" className="mt-12 flex flex-wrap gap-2 md:mt-16" data-reveal="fade">
          {(["all", ...SOLUTIONS.groups.map((g) => g.id)] as Group[]).map((g) => (
            <button
              key={g}
              type="button"
              aria-pressed={group === g}
              onClick={() => setGroup(g)}
              className={`t-small flex h-10 items-center gap-2 rounded-full border px-4 transition-colors duration-300 ${
                group === g ? "border-emerald bg-emerald text-ink" : "border-line-strong text-sage hover:border-sage hover:text-paper"
              }`}
            >
              {g === "all" ? "All capabilities" : label(g)}
              <span className={`t-num text-[0.75rem] ${group === g ? "text-ink/70" : "text-sage/70"}`}>{count(g)}</span>
            </button>
          ))}
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-px overflow-hidden border border-line bg-line sm:grid-cols-4" data-reveal="fade">
          {SOLUTIONS.items.map((it) => {
            const Icon = ICONS[it.icon];
            const dim = group !== "all" && it.group !== group;
            return (
              <li key={it.name} className="cap relative bg-forest" data-dim={dim}>
                <div className="flex aspect-[3/2] flex-col justify-between p-4 sm:p-6 lg:aspect-[2/1]">
                  <Icon aria-hidden className="cap-icon size-5 text-emerald md:size-6" strokeWidth={1.5} />
                  <h3 className="text-[1.05rem] font-[560] leading-tight tracking-[-0.015em] [font-stretch:110%] sm:text-[1.25rem] lg:text-[1.4rem]">
                    {it.name}
                  </h3>
                </div>
              </li>
            );
          })}
        </ul>
        <p className="sr-only" aria-live="polite">
          {group === "all" ? "Showing all capabilities" : `Highlighting ${count(group)} ${label(group)} capabilities`}
        </p>
      </div>
    </section>
  );
}
