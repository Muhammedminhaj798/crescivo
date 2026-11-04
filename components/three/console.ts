import { setConsoleFunction } from "three";

// R3F 9.8 still constructs THREE.Clock, which three r183+ flags as deprecated on every page that mounts a
// scene. Drop only that notice; every other three.js log, warning and error passes through unchanged.
// Remove once R3F moves to THREE.Timer.
setConsoleFunction((type: "log" | "warn" | "error", message: string, ...params: unknown[]) => {
  if (type === "warn" && message.startsWith("THREE.Clock:")) return;
  console[type](message, ...params);
});
