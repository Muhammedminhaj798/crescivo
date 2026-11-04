"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import "./console";
import { stack } from "@/lib/sceneBus";
import { GL_FLAGS, type SceneEnv } from "./SceneMount";
import { FitViewport, Warmup } from "./helpers";

const W = 4, D = 2.6, H = 0.07;
const EMERALD = new THREE.Color("#00C878");
const MINT = new THREE.Color("#B6FFD9");
const SAGE = new THREE.Color("#5f6b64");

const lineGeo = (pts: number[]) => {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
  return g;
};
const rect = (cx: number, cz: number, w: number, d: number, y = H / 2 + 0.002) => {
  const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2;
  return [x0, y, z0, x1, y, z0, x1, y, z0, x1, y, z1, x1, y, z1, x0, y, z1, x0, y, z1, x0, y, z0];
};

/** Surface detail that tells the layers apart: interfaces, a network, a module grid. */
function layerDetail(kind: number) {
  const segs: number[] = [];
  const pts: number[] = [];
  const y = H / 2 + 0.002;
  if (kind === 0) {
    // Interfaces: a browser window and a phone.
    segs.push(...rect(-0.55, 0, 2.0, 1.5), -1.55, y, -0.5, 0.45, y, -0.5);
    for (let i = 0; i < 3; i++) segs.push(-1.35, y, -0.2 + i * 0.3, i === 2 ? -0.75 : -0.1, y, -0.2 + i * 0.3);
    segs.push(...rect(1.2, 0, 0.56, 1.1), 1.08, y, 0.42, 1.32, y, 0.42);
    pts.push(-1.42, y, -0.62, -1.3, y, -0.62, -1.18, y, -0.62);
  } else if (kind === 1) {
    // Integration: a hub-and-spoke network of services.
    const nodes: [number, number][] = [[0, 0], [-1.4, -0.75], [-1.5, 0.6], [1.45, -0.7], [1.4, 0.7], [-0.5, -0.95], [0.6, 0.95]];
    nodes.forEach(([x, z]) => pts.push(x, y, z));
    nodes.slice(1).forEach(([x, z]) => segs.push(0, y, 0, x, y, z));
    segs.push(-1.4, y, -0.75, -1.5, y, 0.6, 1.45, y, -0.7, 1.4, y, 0.7);
  } else {
    // Core applications: a grid of modules.
    for (let i = 0; i < 9; i++) for (let j = 0; j < 5; j++) pts.push(-1.6 + i * 0.4, y, -0.8 + j * 0.4);
    segs.push(...rect(-0.8, -0.2, 1.2, 0.8), ...rect(0.8, 0.4, 0.8, 0.8));
  }
  return { segs: lineGeo(segs), pts: lineGeo(pts) };
}

function Layer({ index }: { index: number }) {
  const ref = useRef<THREE.Group>(null);
  const { box, edges, detail, mats } = useMemo(() => {
    const box = new THREE.BoxGeometry(W, H, D);
    const edges = new THREE.EdgesGeometry(box);
    const detail = layerDetail(index);
    const mats = {
      slab: new THREE.MeshBasicMaterial({ color: "#0D1712", transparent: true, opacity: 0.9, depthWrite: false }),
      edge: new THREE.LineBasicMaterial({ color: EMERALD.clone(), transparent: true, opacity: 0.5 }),
      detail: new THREE.LineBasicMaterial({ color: EMERALD.clone(), transparent: true, opacity: 0.35 }),
      dots: new THREE.PointsMaterial({ color: MINT.clone(), size: 4, sizeAttenuation: false, transparent: true, opacity: 0.6 }),
    };
    return { box, edges, detail, mats };
  }, [index]);

  useEffect(
    () => () => {
      box.dispose(); edges.dispose(); detail.segs.dispose(); detail.pts.dispose();
      Object.values(mats).forEach((m) => m.dispose());
    },
    [box, edges, detail, mats],
  );

  const s = useRef({ on: 0, y: 0 });
  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const gap = 0.62 + stack.explode * 0.55;
    const on = stack.active === index ? 1 : 0;
    const k = 1 - Math.exp(-dt * 6);
    s.current.on += (on - s.current.on) * k;
    const target = (1 - index) * gap + s.current.on * 0.14;
    s.current.y += (target - s.current.y) * (1 - Math.exp(-dt * 8));
    ref.current!.position.y = s.current.y;
    const a = s.current.on;
    mats.edge.opacity = 0.32 + a * 0.68;
    mats.edge.color.copy(EMERALD).lerp(MINT, a * 0.6);
    mats.detail.opacity = 0.18 + a * 0.62;
    mats.detail.color.copy(SAGE).lerp(EMERALD, 0.4 + a * 0.6);
    mats.dots.opacity = 0.3 + a * 0.7;
  });

  return (
    <group ref={ref}>
      <mesh geometry={box} material={mats.slab} renderOrder={index} />
      <lineSegments geometry={edges} material={mats.edge} />
      <lineSegments geometry={detail.segs} material={mats.detail} />
      <points geometry={detail.pts} material={mats.dots} />
    </group>
  );
}

/** Vertical links between layers with packets travelling along them. */
function Links({ reduced }: { reduced: boolean }) {
  const posts: [number, number][] = [[-1.7, -1.05], [1.7, -1.05], [-1.7, 1.05], [1.7, 1.05], [0, 0], [0.9, -0.5]];
  const { lines, packets, lmat, pmat } = useMemo(() => {
    const l: number[] = [];
    posts.forEach(([x, z]) => l.push(x, -1, z, x, 1, z));
    const p = new Float32Array(posts.length * 2 * 3);
    return {
      lines: lineGeo(l),
      packets: new THREE.BufferGeometry().setAttribute("position", new THREE.BufferAttribute(p, 3)),
      lmat: new THREE.LineBasicMaterial({ color: "#A0AAA3", transparent: true, opacity: 0.18 }),
      pmat: new THREE.PointsMaterial({ color: "#B6FFD9", size: 5, sizeAttenuation: false, transparent: true, opacity: 0.95 }),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => () => (lines.dispose(), packets.dispose(), lmat.dispose(), pmat.dispose()), [lines, packets, lmat, pmat]);

  const group = useRef<THREE.Group>(null);
  const t = useRef(0);
  useFrame((_, delta) => {
    if (!reduced) t.current += Math.min(delta, 1 / 30);
    const gap = 0.62 + stack.explode * 0.55;
    group.current!.scale.y = gap;
    const arr = packets.attributes.position.array as Float32Array;
    posts.forEach(([x, z], i) => {
      for (let k = 0; k < 2; k++) {
        const ph = (t.current * (0.22 + i * 0.03) + i * 0.37 + k * 0.5) % 1;
        const dir = (i + k) % 2 ? 1 : -1;
        const o = (i * 2 + k) * 3;
        arr[o] = x; arr[o + 1] = dir * (ph * 2 - 1); arr[o + 2] = z;
      }
    });
    packets.attributes.position.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments geometry={lines} material={lmat} />
      <points geometry={packets} material={pmat} frustumCulled={false} />
    </group>
  );
}

function Rig({ reduced, onReady }: { reduced: boolean; onReady: () => void }) {
  const { camera, size } = useThree();
  const p = useRef({ x: 0, y: 0, sx: 0, sy: 0, t: 0, frames: 0 });
  const scene = useThree((s) => s.scene);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      p.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      p.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const c = p.current;
    if (!reduced) c.t += dt;
    const k = 1 - Math.exp(-dt * 3);
    c.sx += (c.x - c.sx) * k;
    c.sy += (c.y - c.sy) * k;
    const cam = camera as THREE.OrthographicCamera;
    const zoom = Math.min(size.width / 6.6, size.height / 5.6);
    if (Math.abs(cam.zoom - zoom) > 0.01) {
      cam.zoom = zoom;
      cam.updateProjectionMatrix();
    }
    const g = scene.getObjectByName("stack-root");
    if (g) {
      g.rotation.y = Math.sin(c.t * 0.25) * 0.12 + c.sx * 0.22;
      g.rotation.x = c.sy * 0.06;
    }
    const need = reduced ? 1 : 3;
    if (c.frames < need && ++c.frames === need) onReady();
  });
  return null;
}

export default function StackScene({ onReady, reduced, active }: SceneEnv) {
  const [compiled, setCompiled] = useState(false);
  const onCompiled = useCallback(() => setCompiled(true), []);
  return (
    <Canvas
      orthographic
      dpr={[1, 1.75]}
      camera={{ position: [7, 5.2, 7], zoom: 80, near: 0.1, far: 50 }}
      gl={GL_FLAGS}
      frameloop={reduced ? "demand" : active && compiled ? "always" : "never"}
      onCreated={({ gl, camera }) => {
        gl.setClearColor(0x000000, 0);
        camera.lookAt(0, 0, 0);
      }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Rig reduced={reduced} onReady={onReady} />
      <group name="stack-root">
        <Links reduced={reduced} />
        {[2, 1, 0].map((i) => (
          <Layer key={i} index={i} />
        ))}
      </group>
      <Warmup onDone={onCompiled} />
      <FitViewport />
    </Canvas>
  );
}
