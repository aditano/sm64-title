import { forwardRef, useImperativeHandle, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { makeStar } from "@/lib/n64-textures";

type Spark = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  max: number;
  red: boolean;
};

export type SparkleHandle = {
  burst: (p: THREE.Vector3, n?: number, red?: boolean) => void;
};

export const Sparkles = forwardRef<SparkleHandle>(function Sparkles(_, ref) {
  const silver = useMemo(() => makeStar("#fff4a8"), []);
  const red = useMemo(() => makeStar("#ff6a4a"), []);
  const list = useRef<Spark[]>([]);
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useImperativeHandle(ref, () => ({
    burst(p, n = 6, isRed = false) {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2;
        const b = Math.random() * Math.PI;
        const s = 0.6 + Math.random() * 1.4;
        list.current.push({
          pos: p.clone(),
          vel: new THREE.Vector3(Math.cos(a) * Math.sin(b), Math.cos(b) + 0.4, Math.sin(a) * Math.sin(b)).multiplyScalar(s),
          life: 0,
          max: 0.45 + Math.random() * 0.4,
          red: isRed || Math.random() < 0.2,
        });
      }
    },
  }));

  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    const d = Math.min(dt, 0.05);
    const next: Spark[] = [];
    for (const s of list.current) {
      s.life += d;
      s.pos.addScaledVector(s.vel, d);
      s.vel.y -= 0.9 * d;
      if (s.life < s.max) next.push(s);
    }
    list.current = next.slice(-48);

    while (g.children.length < list.current.length) {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.14, 0.14),
        new THREE.MeshBasicMaterial({
          map: silver,
          transparent: true,
          depthWrite: false,
          side: THREE.DoubleSide,
        }),
      );
      g.add(m);
    }
    for (let i = 0; i < g.children.length; i++) {
      const m = g.children[i] as THREE.Mesh;
      const s = list.current[i];
      m.visible = !!s;
      if (!s) continue;
      m.position.copy(s.pos);
      const t = 1 - s.life / s.max;
      m.scale.setScalar(0.6 + t);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.map = s.red ? red : silver;
      mat.opacity = t;
      m.lookAt(camera.position);
    }
  });

  return <group ref={group} />;
});
