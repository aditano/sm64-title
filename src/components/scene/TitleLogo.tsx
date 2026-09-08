import { useLayoutEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { logoAlpha } from "@/lib/game-clock";

const EXTRUDE: THREE.ExtrudeGeometryOptions = {
  depth: 0.07,
  bevelEnabled: true,
  bevelThickness: 0.016,
  bevelSize: 0.012,
  bevelSegments: 1,
  curveSegments: 4,
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

function makeLetterGeo(ch: string) {
  const geo = new THREE.ExtrudeGeometry(letter(ch), EXTRUDE);
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

const RED = "#E31B1B";
const RED_SHADE = "#9A180C";
const GOLD = "#F0C43A";
const GOLD_SHADE = "#A07018";

function skipRaycast() {}

function Word({
  text,
  x,
  y,
  size,
  tracking,
  color,
  shade,
}: {
  text: string;
  x: number;
  y: number;
  size: number;
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
        cx += size * tracking;
        return (
          <group key={i} position={[px, y, 0]} scale={[size, size, size]}>
            <mesh geometry={geo} position={[0.08, -0.1, 0.04]} renderOrder={18} raycast={skipRaycast}>
              <meshBasicMaterial color={shade} fog={false} depthTest={false} depthWrite={false} />
            </mesh>
            <mesh geometry={geo} renderOrder={19} raycast={skipRaycast}>
              <meshBasicMaterial color={color} fog={false} depthTest={false} depthWrite={false} />
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
    <mesh position={[0.46, 0.155, 0]} renderOrder={20} raycast={skipRaycast}>
      <planeGeometry args={[0.11, 0.055]} />
      <meshBasicMaterial map={map} transparent depthTest={false} depthWrite={false} fog={false} />
    </mesh>
  );
}

export function TitleLogo() {
  const ref = useRef<THREE.Group>(null);
  const { camera } = useThree();
  useFrame(() => {
    const g = ref.current;
    if (!g) return;
    const a = logoAlpha();
    g.visible = a > 0.02;
    g.position.copy(camera.position);
    g.quaternion.copy(camera.quaternion);
    g.traverse((o) => {
      if (!(o instanceof THREE.Mesh)) return;
      const m = o.material;
      if (!Array.isArray(m) && "opacity" in m) {
        m.transparent = a < 0.999;
        m.opacity = a;
        m.depthTest = false;
        m.depthWrite = false;
      }
    });
  });

  return (
    <group ref={ref} visible={false}>
      <group position={[-0.34, 0.3, -1.02]}>
        <Word text="SUPER" x={0.02} y={0.128} size={0.052} tracking={0.84} color={RED} shade={RED_SHADE} />
        <Word text="MARIO" x={0} y={0} size={0.108} tracking={0.9} color={RED} shade={RED_SHADE} />
        <Word text="64" x={0.58} y={0} size={0.108} tracking={0.92} color={GOLD} shade={GOLD_SHADE} />
        <TmMark />
      </group>
    </group>
  );
}
