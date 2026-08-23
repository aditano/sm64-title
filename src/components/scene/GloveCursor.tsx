import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFaceStore } from "@/lib/face-store";

const _hit = new THREE.Vector3();
const _normal = new THREE.Vector3(0, 0, 1);
const _scale = new THREE.Vector3();
const GLOVE = "#f6f1e6";

/** Plane in front of Mario's nose — glove must render above the face mesh. */
const FACE_CENTER = new THREE.Vector3(0, 1.8, 0.95);

const gloveMat = new THREE.MeshLambertMaterial({
  color: GLOVE,
  flatShading: true,
  depthTest: false,
  depthWrite: false,
});

function isCoarse() {
  if (typeof window === "undefined") return false;
  // Show glove whenever a mouse/trackpad is available.
  if (window.matchMedia("(pointer: fine)").matches) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function Finger({
  position,
  curled,
  rotZ = 0,
}: {
  position: [number, number, number];
  curled: number;
  rotZ?: number;
}) {
  return (
    <group position={position} rotation={[0, 0, rotZ]}>
      <mesh
        position={[0, 0.032 - curled * 0.009, -curled * 0.017]}
        rotation={[curled * 1.15, 0, 0]}
        material={gloveMat}
        castShadow={false}
      >
        <boxGeometry args={[0.024, 0.068, 0.024]} />
      </mesh>
      <mesh
        position={[0, 0.062 - curled * 0.006, -curled * 0.012]}
        rotation={[curled * 0.55, 0, 0]}
        material={gloveMat}
        castShadow={false}
      >
        <boxGeometry args={[0.022, 0.044, 0.022]} />
      </mesh>
    </group>
  );
}

function GloveMesh({ curl }: { curl: number }) {
  return (
    <group>
      <mesh material={gloveMat} castShadow={false}>
        <boxGeometry args={[0.11, 0.115, 0.05]} />
      </mesh>
      <mesh
        position={[-0.064, -0.012, 0.012]}
        rotation={[0.15, 0, 0.65 + curl * 0.45]}
        material={gloveMat}
        castShadow={false}
      >
        <boxGeometry args={[0.026, 0.06, 0.024]} />
      </mesh>
      <Finger position={[-0.036, 0.062, 0]} curled={curl} rotZ={-0.08} />
      <Finger position={[-0.012, 0.074, 0]} curled={curl} />
      <Finger position={[0.014, 0.072, 0]} curled={curl} rotZ={0.05} />
      <Finger position={[0.04, 0.058, 0]} curled={curl} rotZ={0.12} />
    </group>
  );
}

/** SM64 white glove cursor — shown on desktop only (original used A to reveal). */
export function GloveCursor() {
  const ref = useRef<THREE.Group>(null);
  const grabbing = useFaceStore((s) => s.grabbing);
  const { camera, pointer, raycaster } = useThree();
  const hidden = isCoarse();
  const plane = useRef(new THREE.Plane());

  useFrame(() => {
    const g = ref.current;
    if (!g || hidden) return;

    plane.current.setFromNormalAndCoplanarPoint(_normal, FACE_CENTER);
    raycaster.setFromCamera(pointer, camera);
    if (!raycaster.ray.intersectPlane(plane.current, _hit)) return;

    g.position.lerp(_hit, 0.55);
    g.lookAt(camera.position);
    g.rotateY(Math.PI);

    const pinch = grabbing ? 0.9 : 1;
    _scale.set(pinch, pinch, pinch);
    g.scale.lerp(_scale, 0.35);
  });

  if (hidden) return null;

  return (
    <group ref={ref} renderOrder={999} position={FACE_CENTER.toArray()}>
      <GloveMesh curl={grabbing ? 1 : 0} />
    </group>
  );
}
