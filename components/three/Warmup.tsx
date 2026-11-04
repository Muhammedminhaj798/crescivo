"use client";

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

/** Compiles every program in the scene off the main thread (KHR_parallel_shader_compile), then reports back. */
export function Warmup({ onDone }: { onDone: () => void }) {
  const { gl, scene, camera } = useThree();
  useEffect(() => {
    let live = true;
    gl.compileAsync(scene, camera).then(() => live && onDone(), () => live && onDone());
    return () => {
      live = false;
    };
  }, [gl, scene, camera, onDone]);
  return null;
}
