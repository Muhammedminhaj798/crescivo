"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";

export type SceneEnv = { onReady: () => void; reduced: boolean; mobile: boolean; active: boolean };

/** Shared WebGL context flags: refuse software rendering so weak devices keep the static fallback. */
export const GL_FLAGS = {
  antialias: true,
  alpha: true,
  stencil: false,
  powerPreference: "high-performance",
  failIfMajorPerformanceCaveat: true,
} as const;

// If the context can't be created (no WebGL, software-only GPU, lost driver), render nothing and keep the fallback.
class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Mounts a WebGL scene only when it is near the viewport and the main thread is idle,
 * pauses it when offscreen, and crossfades from a static fallback once the first frame lands.
 */
export function SceneMount({
  fallback,
  render,
  skip,
  trigger = "idle",
  className = "absolute inset-0",
}: {
  fallback: ReactNode;
  render: (env: SceneEnv) => ReactNode;
  /** Client-side predicate: true keeps the fallback and never loads WebGL. */
  skip?: () => boolean;
  /** "idle": load once near the viewport and the thread is idle. "interaction": wait for the first pointer/key input. */
  trigger?: "idle" | "interaction";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [env, setEnv] = useState<{ reduced: boolean; mobile: boolean } | null>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof WebGLRenderingContext === "undefined" || skip?.()) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mobile = matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    let idle = 0;
    const mount = () => setEnv({ reduced, mobile });
    const inputs = ["pointermove", "pointerdown", "keydown"] as const;
    const onInput = () => {
      inputs.forEach((t) => window.removeEventListener(t, onInput));
      mount();
    };
    const near = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        near.disconnect();
        if (trigger === "interaction") inputs.forEach((t) => window.addEventListener(t, onInput, { passive: true }));
        else
          idle = window.requestIdleCallback
            ? window.requestIdleCallback(mount, { timeout: 2000 })
            : window.setTimeout(mount, 200);
      },
      { rootMargin: "600px 0px" },
    );
    const vis = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "80px 0px" });
    near.observe(el);
    vis.observe(el);
    return () => {
      inputs.forEach((t) => window.removeEventListener(t, onInput));
      near.disconnect();
      vis.disconnect();
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else clearTimeout(idle);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} aria-hidden className={className}>
      <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-100"}`}>{fallback}</div>
      {env && (
        <div className={`absolute inset-0 transition-opacity duration-[1400ms] ${ready ? "opacity-100" : "opacity-0"}`}>
          <SceneBoundary>{render({ ...env, active, onReady: () => setReady(true) })}</SceneBoundary>
        </div>
      )}
    </div>
  );
}
