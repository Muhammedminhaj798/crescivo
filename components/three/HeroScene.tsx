"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./console";
import { GL_FLAGS } from "./SceneMount";
import { Warmup } from "./Warmup";

type Props = { onReady: () => void; reduced: boolean; mobile: boolean; active: boolean };

// Pointer in NDC, shared by the rig and the field. Written by a window listener so the
// canvas can sit behind the hero copy without needing pointer events.
const pointer = { x: 0, y: 0, moved: false };

/* ---------------------------------------------------------------------------------------
 * The twin conduits: the logo's two parallel strokes, drawn at landscape scale.
 * Local plane coords (u along the ground, v up) are mapped into world space.
 * ------------------------------------------------------------------------------------- */
const GAP = 0.36; // distance between the two paths
const R = 1.15; // bend radius of the inner path
const U0 = 1.0; // where the bend starts
const V_APEX = 3.55;
const ORIGIN = new THREE.Vector3(1.45, 0.3, 0.6);
const DIR_U = new THREE.Vector3(1, 0, -0.2).normalize();

const toWorld = (u: number, v: number) =>
  ORIGIN.clone().addScaledVector(DIR_U, u).add(new THREE.Vector3(0, v, 0));

function conduitPoints(offset: number) {
  const pts: THREE.Vector3[] = [];
  const r = R + offset;
  const vBase = -offset; // outer path runs lower
  for (let u = -15; u < U0; u += 0.5) pts.push(toWorld(u, vBase));
  for (let i = 0; i <= 24; i++) {
    const a = -Math.PI / 2 + (i / 24) * (Math.PI / 2); // bottom → right of the bend circle
    pts.push(toWorld(U0 + Math.cos(a) * r, R + Math.sin(a) * r));
  }
  const uTop = U0 + r;
  const vTop = V_APEX - 0.83 * Math.abs(uTop - (U0 + R + GAP / 2)) - 0.06;
  for (let v = R + 0.3; v <= vTop; v += 0.3) pts.push(toWorld(uTop, v));
  pts.push(toWorld(uTop, vTop));
  return pts;
}

function chevronCurve() {
  const mid = U0 + R + GAP / 2;
  const half = GAP * 2.3;
  const drop = half * 0.83;
  const path = new THREE.CurvePath<THREE.Vector3>();
  path.add(new THREE.LineCurve3(toWorld(mid - half, V_APEX - drop), toWorld(mid, V_APEX)));
  path.add(new THREE.LineCurve3(toWorld(mid, V_APEX), toWorld(mid + half, V_APEX - drop)));
  return path;
}

const tubeVert = /* glsl */ `
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vFacing = abs(dot(n, normalize(-mv.xyz)));
    gl_Position = projectionMatrix * mv;
  }
`;
const tubeFrag = /* glsl */ `
  uniform float uTime;
  uniform float uReveal;
  uniform float uHalo;
  uniform float uFadeStart;
  uniform float uPulse;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    float x = vUv.x;
    float shown = 1.0 - smoothstep(uReveal - 0.01, uReveal, x);
    float tip = smoothstep(uReveal - 0.05, uReveal, x) * shown * step(uReveal, 0.999);
    float f = fract(x * 2.6 - uTime * 0.11);
    float pulse = smoothstep(0.9, 0.995, f) * (1.0 - smoothstep(0.995, 1.0, f)) * uPulse;
    float a;
    vec3 col;
    if (uHalo > 0.5) {
      a = pow(vFacing, 2.4) * (0.1 + pulse * 0.3 + tip * 0.6);
      col = mix(uColor, uHot, pulse);
    } else {
      a = 0.35 + 0.65 * vFacing;
      col = uColor * (0.7 + 0.5 * vFacing) + uHot * (pulse * 1.1 + tip * 1.4);
    }
    a *= shown * smoothstep(uFadeStart, uFadeStart + 0.2, x);
    gl_FragColor = vec4(col, a);
  }
`;

function makeTubeMaterial(halo: boolean, fadeStart: number, pulse = 1) {
  return new THREE.ShaderMaterial({
    vertexShader: tubeVert,
    fragmentShader: tubeFrag,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uHalo: { value: halo ? 1 : 0 },
      uFadeStart: { value: fadeStart },
      uPulse: { value: pulse },
      uColor: { value: new THREE.Color("#00C878") },
      uHot: { value: new THREE.Color("#B6FFD9") },
    },
  });
}

function Conduits({ reduced, clock }: { reduced: boolean; clock: React.RefObject<{ t: number; intro: number }> }) {
  const { lines, chevron, mats } = useMemo(() => {
    const curves = [0, GAP].map((o) => new THREE.CatmullRomCurve3(conduitPoints(o), false, "centripetal"));
    const mats = { line: makeTubeMaterial(false, 0.44), halo: makeTubeMaterial(true, 0.44), chev: makeTubeMaterial(false, -1, 0), chevHalo: makeTubeMaterial(true, -1, 0) };
    const lines = curves.map((c) => ({
      core: new THREE.TubeGeometry(c, 420, 0.028, 8, false),
      halo: new THREE.TubeGeometry(c, 210, 0.13, 8, false),
    }));
    const ch = chevronCurve();
    const chevron = { core: new THREE.TubeGeometry(ch, 64, 0.028, 8, false), halo: new THREE.TubeGeometry(ch, 32, 0.13, 8, false) };
    return { lines, chevron, mats };
  }, []);

  useEffect(
    () => () => {
      lines.forEach((l) => (l.core.dispose(), l.halo.dispose()));
      chevron.core.dispose();
      chevron.halo.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [lines, chevron, mats],
  );

  useFrame(() => {
    const { t, intro } = clock.current!;
    // Lines draw first (0 → 2.4s), then the arrowhead snaps in.
    const lineReveal = reduced ? 1 : easeOutCubic(clamp01((intro - 0.25) / 2.4)) * 1.02;
    const chevReveal = reduced ? 1 : easeOutCubic(clamp01((intro - 2.35) / 0.7)) * 1.02;
    mats.line.uniforms.uReveal.value = mats.halo.uniforms.uReveal.value = lineReveal;
    mats.chev.uniforms.uReveal.value = mats.chevHalo.uniforms.uReveal.value = chevReveal;
    for (const m of Object.values(mats)) m.uniforms.uTime.value = t;
  });

  return (
    <group>
      {lines.map((l, i) => (
        <group key={i}>
          <mesh geometry={l.halo} material={mats.halo} renderOrder={1} />
          <mesh geometry={l.core} material={mats.line} renderOrder={2} />
        </group>
      ))}
      <mesh geometry={chevron.halo} material={mats.chevHalo} renderOrder={1} />
      <mesh geometry={chevron.core} material={mats.chev} renderOrder={2} />
    </group>
  );
}

/* ---------------------------------------------------------------------------------------
 * The field: a terrain of points that rises toward the right (growth), lifts and
 * brightens along the conduits, and swells under the pointer.
 * ------------------------------------------------------------------------------------- */
const fieldVert = /* glsl */ `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uMouseAmt;
  uniform float uPixelRatio;
  uniform float uSize;
  attribute float aRand;
  attribute float aProx;
  varying float vAlpha;
  varying float vGlow;

  float surface(vec2 p) {
    float rise = smoothstep(0.0, 8.5, p.x);
    rise = pow(rise, 1.6) * 2.9 * smoothstep(3.0, -6.0, p.y);
    float wave = sin(p.x * 0.55 + uTime * 0.32) * cos(p.y * 0.7 - uTime * 0.21) * 0.11;
    return rise + wave;
  }

  void main() {
    vec3 pos = position;
    float d = distance(pos.xz, uMouse);
    float bump = exp(-d * d * 0.85) * uMouseAmt;
    pos.y += surface(pos.xz) + bump * 0.5 + aProx * 0.07;
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float depth = -mv.z;
    gl_PointSize = uSize * uPixelRatio * (0.55 + aRand * 0.55 + aProx * 0.8 + bump * 1.1) * (10.0 / depth);
    float edge = smoothstep(10.5, 6.0, abs(pos.x - 1.5)) * smoothstep(-8.0, -3.5, pos.z) * smoothstep(4.2, 2.0, pos.z);
    vAlpha = edge;
    vGlow = clamp(aProx * 0.9 + bump * 1.3 + (pos.y - 0.2) * 0.22, 0.0, 1.0);
  }
`;
const fieldFrag = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uAccent;
  uniform vec3 uHot;
  varying float vAlpha;
  varying float vGlow;
  void main() {
    float r = length(gl_PointCoord - 0.5);
    float disc = smoothstep(0.5, 0.18, r);
    vec3 col = mix(uBase, uAccent, smoothstep(0.0, 0.8, vGlow));
    col = mix(col, uHot, pow(vGlow, 3.0) * 0.7);
    gl_FragColor = vec4(col, disc * vAlpha * (0.5 + vGlow * 0.8));
  }
`;

function Field({ mobile, reduced, clock }: { mobile: boolean; reduced: boolean; clock: React.RefObject<{ t: number; intro: number }> }) {
  const { camera, gl } = useThree();
  const { geometry, material } = useMemo(() => {
    const step = mobile ? 0.27 : 0.18;
    const x0 = -9, x1 = 11, z0 = -8, z1 = 4;
    // Path footprint on the ground, for the proximity glow.
    const foot: THREE.Vector2[] = [];
    for (const o of [0, GAP]) {
      const c = new THREE.CatmullRomCurve3(conduitPoints(o));
      for (let i = 0; i <= 64; i++) {
        const p = c.getPoint(i / 64);
        if (p.y < 1.2) foot.push(new THREE.Vector2(p.x, p.z));
      }
    }
    const pos: number[] = [], rand: number[] = [], prox: number[] = [];
    for (let x = x0; x <= x1; x += step) {
      for (let z = z0; z <= z1; z += step) {
        const jx = x + (Math.random() - 0.5) * step * 0.35;
        const jz = z + (Math.random() - 0.5) * step * 0.35;
        pos.push(jx, 0, jz);
        rand.push(Math.random());
        let dmin = Infinity;
        for (const f of foot) dmin = Math.min(dmin, (f.x - jx) ** 2 + (f.y - jz) ** 2);
        prox.push(Math.exp(-dmin / 0.22));
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute("aRand", new THREE.Float32BufferAttribute(rand, 1));
    g.setAttribute("aProx", new THREE.Float32BufferAttribute(prox, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: fieldVert,
      fragmentShader: fieldFrag,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uMouseAmt: { value: 0 },
        uPixelRatio: { value: gl.getPixelRatio() },
        uSize: { value: mobile ? 6.0 : 5.4 },
        uBase: { value: new THREE.Color("#7f8c85") },
        uAccent: { value: new THREE.Color("#00C878") },
        uHot: { value: new THREE.Color("#B6FFD9") },
      },
    });
    return { geometry: g, material: m };
  }, [mobile, gl]);

  useEffect(() => () => (geometry.dispose(), material.dispose()), [geometry, material]);

  const ray = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);

  useFrame((_, dt) => {
    const u = material.uniforms;
    u.uTime.value = clock.current!.t;
    u.uPixelRatio.value = gl.getPixelRatio();
    if (reduced || !pointer.moved) return;
    ndc.set(pointer.x, pointer.y);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) {
      const k = 1 - Math.exp(-dt * 6);
      u.uMouse.value.x += (hit.x - u.uMouse.value.x) * k;
      u.uMouse.value.y += (hit.z - u.uMouse.value.y) * k;
      u.uMouseAmt.value += (1 - u.uMouseAmt.value) * k * 0.5;
    }
  });

  return <points geometry={geometry} material={material} frustumCulled={false} />;
}

/* ---------------------------------------------------------------------------------------
 * Camera rig: framing adapts to aspect; pointer parallax; scroll lifts the camera
 * up the rising line as the hero leaves.
 * ------------------------------------------------------------------------------------- */
function Rig({ reduced, clock, onReady }: { reduced: boolean; clock: React.RefObject<{ t: number; intro: number }>; onReady: () => void }) {
  const { camera, size } = useThree();
  const look = useMemo(() => new THREE.Vector3(), []);
  const smooth = useRef({ x: 0, y: 0, s: 0 });
  const frames = useRef(0);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const c = clock.current!;
    if (!reduced) {
      c.t += dt;
      // Intro runs on page time so it stays in step with the vector fallback it replaces.
      c.intro = performance.now() / 1000;
    }
    const portrait = size.width / size.height < 0.9;
    const cam = camera as THREE.PerspectiveCamera;
    const fov = portrait ? 44 : 31;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    const s = reduced ? 0 : Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);
    const k = 1 - Math.exp(-dt * 3.2);
    const sm = smooth.current;
    sm.x += ((reduced ? 0 : pointer.x) - sm.x) * k;
    sm.y += ((reduced ? 0 : pointer.y) - sm.y) * k;
    sm.s += (s - sm.s) * (1 - Math.exp(-dt * 8));

    const base = portrait ? [2.6, 3.6, 13.5] : [0.4, 3.3, 11.2];
    const target = portrait ? [3.2, 1.75, 0] : [1.35, 1.45, 0];
    // gentle drift so the scene breathes even without input
    const drift = reduced ? 0 : Math.sin(c.t * 0.18) * 0.18;
    camera.position.set(
      base[0] + sm.x * 0.7 + drift,
      base[1] + sm.y * 0.4 + sm.s * 1.5,
      base[2] - sm.s * 1.9,
    );
    look.set(target[0] + sm.x * 0.2, target[1] + sm.s * 1.35, target[2]);
    camera.lookAt(look);

    const need = reduced ? 1 : 3;
    if (frames.current < need && ++frames.current === need) onReady();
  });
  return null;
}

export default function HeroScene({ onReady, reduced, mobile, active }: Props) {
  const clock = useRef({ t: 4.0, intro: 0 });
  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      pointer.moved = true;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  return (
    <Canvas
      dpr={[1, mobile ? 1.5 : 1.75]}
      camera={{ fov: 31, near: 0.1, far: 60, position: [0.4, 3.3, 11.2] }}
      gl={GL_FLAGS}
      frameloop={reduced ? "demand" : active && compiled ? "always" : "never"}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      style={{ position: "absolute", inset: 0 }}
    >
      <Rig reduced={reduced} clock={clock} onReady={onReady} />
      <Field mobile={mobile} reduced={reduced} clock={clock} />
      <Conduits reduced={reduced} clock={clock} />
      <Warmup onDone={onCompiled} />
    </Canvas>
  );
}

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const easeOutCubic = (v: number) => 1 - Math.pow(1 - v, 3);
