"use client";

import { useEffect, useLayoutEffect } from "react";
import { useThree } from "@react-three/fiber";

/** Compiles every program in the scene off the main thread (KHR_parallel_shader_compile), then reports back. */
export function Warmup({ onDone }: { onDone: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let live = true;
    // Without the extension compileAsync can't run in parallel (and warns); the first frame compiles instead.
    if (!gl.extensions.has("KHR_parallel_shader_compile")) {
      onDone();
      return;
    }
    gl.compileAsync(scene, camera).then(() => live && onDone(), () => live && onDone());
    return () => {
      live = false;
    };
  }, [gl, scene, camera, onDone]);
  return null;
}

/**
 * three.js sizes the drawing buffer with floor() but the viewport with round(), so fractional canvas sizes
 * (fluid layouts, DPR 1.5) end up with a viewport 1px larger than the buffer (Firefox warns). Snap the
 * viewport to the real buffer after every resize.
 */
export function FitViewport() {
  const gl = useThree((s) => s.gl);
  const size = useThree((s) => s.size);
  const dpr = useThree((s) => s.viewport.dpr);
  useLayoutEffect(() => {
    const ctx = gl.getContext();
    const r = gl.getPixelRatio();
    gl.setViewport(0, 0, ctx.drawingBufferWidth / r, ctx.drawingBufferHeight / r);
  }, [gl, size, dpr]);
  return null;
}
