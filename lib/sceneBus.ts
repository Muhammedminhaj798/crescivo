// Mutable state shared between DOM code (hover, ScrollTrigger) and the WebGL stack scene.
// Read inside useFrame, so writes never trigger React renders.
export const stack = { active: 0, explode: 0 };
