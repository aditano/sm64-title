import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { logoAlpha, N64_H, N64_W } from "@/lib/game-clock";

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.14,
  bevelEnabled: true,
  bevelThickness: 0.03,
  bevelSize: 0.02,
  bevelSegments: 1,
  curveSegments: 5,
};

function letter(ch: string): THREE.Shape {
  const s = new THREE.Shape();
  const hole = (h: THREE.Path) => s.holes.push(h);
  switch (ch) {
    case "S":
      s.moveTo(0.08, 0);
      s.lineTo(0.92, 0);
      s.lineTo(0.92, 0.38);
      s.lineTo(0.32, 0.38);
      s.lineTo(0.32, 0.48);
      s.lineTo(0.92, 0.48);
      s.lineTo(0.92, 1);
      s.lineTo(0.08, 1);
      s.lineTo(0.08, 0.62);
      s.lineTo(0.68, 0.62);
      s.lineTo(0.68, 0.52);
      s.lineTo(0.08, 0.52);
      s.closePath();
      return s;
    case "U":
      s.moveTo(0.08, 1);
      s.lineTo(0.08, 0.22);
      s.lineTo(0.28, 0);
      s.lineTo(0.72, 0);
      s.lineTo(0.92, 0.22);
      s.lineTo(0.92, 1);
      s.lineTo(0.7, 1);
      s.lineTo(0.7, 0.28);
      s.lineTo(0.3, 0.28);
      s.lineTo(0.3, 1);
      s.closePath();
      return s;
    case "P":
      s.moveTo(0.08, 0);
      s.lineTo(0.08, 1);
      s.lineTo(0.7, 1);
      s.lineTo(0.92, 0.82);
      s.lineTo(0.92, 0.6);
      s.lineTo(0.7, 0.42);
      s.lineTo(0.3, 0.42);
      s.lineTo(0.3, 0);
      s.closePath();
      {
        const h = new THREE.Path();
        h.moveTo(0.3, 0.58);
        h.lineTo(0.62, 0.58);
        h.lineTo(0.7, 0.66);
        h.lineTo(0.7, 0.78);
        h.lineTo(0.62, 0.86);
        h.lineTo(0.3, 0.86);
        h.closePath();
        hole(h);
      }
      return s;
    case "E":
      s.moveTo(0.08, 0);
      s.lineTo(0.08, 1);
      s.lineTo(0.92, 1);
      s.lineTo(0.92, 0.78);
      s.lineTo(0.3, 0.78);
      s.lineTo(0.3, 0.6);
      s.lineTo(0.78, 0.6);
      s.lineTo(0.78, 0.4);
      s.lineTo(0.3, 0.4);
      s.lineTo(0.3, 0.22);
      s.lineTo(0.92, 0.22);
      s.lineTo(0.92, 0);
      s.closePath();
      return s;
    case "R":
      s.moveTo(0.08, 0);
      s.lineTo(0.08, 1);
      s.lineTo(0.68, 1);
      s.lineTo(0.92, 0.82);
      s.lineTo(0.92, 0.62);
      s.lineTo(0.72, 0.48);
      s.lineTo(0.92, 0);
      s.lineTo(0.66, 0);
      s.lineTo(0.48, 0.42);
      s.lineTo(0.3, 0.42);
      s.lineTo(0.3, 0);
      s.closePath();
      {
        const h = new THREE.Path();
        h.moveTo(0.3, 0.58);
        h.lineTo(0.6, 0.58);
        h.lineTo(0.7, 0.68);
        h.lineTo(0.7, 0.8);
        h.lineTo(0.6, 0.86);
        h.lineTo(0.3, 0.86);
        h.closePath();
        hole(h);
      }
      return s;
    case "M":
      s.moveTo(0.04, 0);
      s.lineTo(0.04, 1);
      s.lineTo(0.28, 1);
      s.lineTo(0.5, 0.55);
      s.lineTo(0.72, 1);
      s.lineTo(0.96, 1);
      s.lineTo(0.96, 0);
      s.lineTo(0.76, 0);
      s.lineTo(0.76, 0.62);
      s.lineTo(0.5, 0.22);
      s.lineTo(0.24, 0.62);
      s.lineTo(0.24, 0);
      s.closePath();
      return s;
    case "A":
      s.moveTo(0.04, 0);
      s.lineTo(0.38, 1);
      s.lineTo(0.62, 1);
      s.lineTo(0.96, 0);
      s.lineTo(0.72, 0);
      s.lineTo(0.64, 0.26);
      s.lineTo(0.36, 0.26);
      s.lineTo(0.28, 0);
      s.closePath();
      {
        const h = new THREE.Path();
        h.moveTo(0.4, 0.42);
        h.lineTo(0.6, 0.42);
        h.lineTo(0.5, 0.74);
        h.closePath();
        hole(h);
      }
      return s;
    case "I":
      s.moveTo(0.18, 0);
      s.lineTo(0.18, 0.2);
      s.lineTo(0.38, 0.2);
      s.lineTo(0.38, 0.8);
      s.lineTo(0.18, 0.8);
      s.lineTo(0.18, 1);
      s.lineTo(0.82, 1);
      s.lineTo(0.82, 0.8);
      s.lineTo(0.62, 0.8);
      s.lineTo(0.62, 0.2);
      s.lineTo(0.82, 0.2);
      s.lineTo(0.82, 0);
      s.closePath();
      return s;
    case "O":
      s.absellipse(0.5, 0.5, 0.44, 0.5, 0, Math.PI * 2, false, 0);
      {
        const h = new THREE.Path();
        h.absellipse(0.5, 0.5, 0.22, 0.28, 0, Math.PI * 2, true, 0);
        hole(h);
      }
      return s;
    case "6":
      s.moveTo(0.16, 0.08);
      s.lineTo(0.16, 0.92);
      s.lineTo(0.84, 0.92);
      s.lineTo(0.84, 0.74);
      s.lineTo(0.38, 0.74);
      s.lineTo(0.38, 0.52);
      s.lineTo(0.74, 0.52);
      s.lineTo(0.88, 0.38);
      s.lineTo(0.88, 0.2);
      s.lineTo(0.74, 0.08);
      s.closePath();
      {
        const h = new THREE.Path();
        h.moveTo(0.38, 0.22);
        h.lineTo(0.66, 0.22);
        h.lineTo(0.66, 0.38);
        h.lineTo(0.38, 0.38);
        h.closePath();
        hole(h);
      }
      return s;
    case "4":
      s.moveTo(0.58, 0);
      s.lineTo(0.58, 0.36);
      s.lineTo(0.08, 0.36);
      s.lineTo(0.5, 1);
      s.lineTo(0.78, 1);
      s.lineTo(0.78, 0.36);
      s.lineTo(0.92, 0.36);
      s.lineTo(0.92, 0.18);
      s.lineTo(0.78, 0.18);
      s.lineTo(0.78, 0);
      s.closePath();
      return s;
    default: {
      s.moveTo(0.1, 0.1);
      s.lineTo(0.9, 0.1);
      s.lineTo(0.9, 0.9);
      s.lineTo(0.1, 0.9);
      s.closePath();
      return s;
    }
  }
}

function dropClosing(pts: THREE.Vector2[]) {
  if (pts.length > 1 && pts[0]!.distanceTo(pts[pts.length - 1]!) < 1e-4) return pts.slice(0, -1);
  return pts;
}

/** Pull polygon corners in so the extruded logo reads as the rounded SM64 lockup. */
function roundLoop(pts: THREE.Vector2[], radius: number, path: THREE.Path) {
  const n = pts.length;
  if (n < 3) {
    const first = pts[0] ?? new THREE.Vector2();
    path.moveTo(first.x, first.y);
    for (const p of pts.slice(1)) path.lineTo(p.x, p.y);
    path.closePath();
    return;
  }
  const corner = (i: number) => {
    const prev = pts[(i - 1 + n) % n]!;
    const cur = pts[i]!;
    const next = pts[(i + 1) % n]!;
    const v1x = cur.x - prev.x;
    const v1y = cur.y - prev.y;
    const v2x = next.x - cur.x;
    const v2y = next.y - cur.y;
    const l1 = Math.hypot(v1x, v1y) || 1;
    const l2 = Math.hypot(v2x, v2y) || 1;
    const r = Math.min(radius, l1 * 0.46, l2 * 0.46);
    return {
      ax: cur.x - (v1x / l1) * r,
      ay: cur.y - (v1y / l1) * r,
      bx: cur.x + (v2x / l2) * r,
      by: cur.y + (v2y / l2) * r,
      cx: cur.x,
      cy: cur.y,
    };
  };
  const first = corner(0);
  path.moveTo(first.ax, first.ay);
  path.quadraticCurveTo(first.cx, first.cy, first.bx, first.by);
  for (let i = 1; i < n; i++) {
    const c = corner(i);
    path.lineTo(c.ax, c.ay);
    path.quadraticCurveTo(c.cx, c.cy, c.bx, c.by);
  }
  path.closePath();
}

function soften(shape: THREE.Shape, radius: number) {
  const extracted = shape.extractPoints(4);
  const next = new THREE.Shape();
  roundLoop(dropClosing(extracted.shape), radius, next);
  for (const hole of extracted.holes) {
    const h = new THREE.Path();
    roundLoop(dropClosing(hole), radius * 0.7, h);
    next.holes.push(h);
  }
  return next;
}

function makeLetterGeo(ch: string) {
  const geo = new THREE.ExtrudeGeometry(soften(letter(ch), ch === "O" || ch === "6" ? 0.04 : 0.08), EXTRUDE);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

const RED = "#E10612";
const RED_SHADE = "#8C100C";
const GOLD = "#FFD000";
const GOLD_SHADE = "#C47A00";

/** Far enough to sit behind Mario at every zoom, close enough to cover the castle. */
const LOGO_Z = 6.2;

function skipRaycast() {}

function Word({
  text,
  x,
  y,
  w,
  h,
  tracking,
  color,
  shade,
}: {
  text: string;
  /** Center of the first letter, in 320×240 screen pixels (origin top-left). */
  x: number;
  y: number;
  w: number;
  h: number;
  tracking: number;
  color: string;
  shade: string;
}) {
  const geos = useMemo(() => text.split("").map(makeLetterGeo), [text]);
  useLayoutEffect(
    () => () => {
      for (const g of geos) g.dispose();
    },
    [geos],
  );
  let cx = x;
  return (
    <group>
      {geos.map((geo, i) => {
        const px = cx;
        cx += tracking;
        return (
          <group key={i} position={[px - N64_W / 2, N64_H / 2 - y, 0]} scale={[w, h, 22]}>
            <mesh geometry={geo} position={[0.05, -0.08, -0.06]} renderOrder={4} raycast={skipRaycast}>
              <meshBasicMaterial color={shade} fog={false} />
            </mesh>
            <mesh geometry={geo} renderOrder={5} raycast={skipRaycast}>
              <meshBasicMaterial color={color} fog={false} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

function TmMark() {
  const map = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 32;
    c.height = 16;
    const ctx = c.getContext("2d");
    if (!ctx) throw new Error("2d");
    ctx.clearRect(0, 0, 32, 16);
    ctx.fillStyle = "#f4f4f4";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("TM", 1, 13);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.magFilter = THREE.NearestFilter;
    t.minFilter = THREE.NearestFilter;
    t.generateMipmaps = false;
    t.needsUpdate = true;
    return t;
  }, []);
  useLayoutEffect(() => () => map.dispose(), [map]);
  return (
    <mesh position={[286 - N64_W / 2, N64_H / 2 - 28, 1]} renderOrder={6} raycast={skipRaycast}>
      <planeGeometry args={[18, 9]} />
      <meshBasicMaterial map={map} transparent fog={false} />
    </mesh>
  );
}

export function TitleLogo() {
  const ref = useRef<THREE.Group>(null);
  const screenRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame(() => {
    const g = ref.current;
    const screen = screenRef.current;
    if (!g || !screen) return;
    const a = logoAlpha();
    g.visible = a > 0.02;
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    const cam = camera as THREE.PerspectiveCamera;
    const halfW = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2)) * LOGO_Z * cam.aspect;
    const s = halfW / (N64_W / 2);
    screen.position.set(0, 0, -LOGO_Z);
    screen.scale.set(s, s, s);
    g.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const m = o.material;
      if (!Array.isArray(m) && "opacity" in m) {
        m.transparent = a < 0.999;
        m.opacity = a;
        m.depthTest = true;
        m.depthWrite = true;
      }
    });
  });

  return (
    <group ref={ref} visible={false}>
      <group ref={screenRef}>
        <Word text="SUPER" x={87} y={24} w={15} h={15} tracking={16} color={RED} shade={RED_SHADE} />
        <Word text="MARIO" x={44} y={52} w={32} h={40} tracking={30} color={RED} shade={RED_SHADE} />
        <Word text="64" x={235} y={53} w={34} h={38} tracking={32} color={GOLD} shade={GOLD_SHADE} />
        <TmMark />
      </group>
    </group>
  );
}
