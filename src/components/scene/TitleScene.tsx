import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { StretchHead } from "./StretchHead";
import { World } from "./World";
import { GloveCursor } from "./GloveCursor";
import { useFaceStore } from "@/lib/face-store";

function Lights() {
  return (
    <>
      <hemisphereLight args={["#c5e4ff", "#6a9a45", 1.05]} />
      <ambientLight intensity={0.48} />
      <directionalLight
        position={[10, 16, 10]}
        intensity={1.25}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={2}
        shadow-camera-far={80}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-10}
      />
    </>
  );
}

function CameraRig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const portrait = size.height / Math.max(size.width, 1) > 1.15;
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(0, portrait ? 2.85 : 2.25, portrait ? 11.4 : 8.8);
    cam.fov = portrait ? 54 : 42;
    cam.near = 0.1;
    cam.far = 220;
    cam.lookAt(0, portrait ? 1.95 : 1.6, 0);
    cam.updateProjectionMatrix();
  }, [camera, size.height, size.width]);
  return null;
}

export function TitleScene() {
  const characterId = useFaceStore((s) => s.characterId);

  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0, 2.25, 8.8], fov: 42, near: 0.1, far: 220 }}
      dpr={[1, 1.5]}
      shadows
      gl={{
        antialias: true,
        toneMapping: THREE.NoToneMapping,
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#5eb3e8");
        gl.domElement.style.touchAction = "none";
      }}
    >
      <fog attach="fog" args={["#9ad0ee", 48, 130]} />
      <CameraRig />
      <Lights />
      <Suspense fallback={null}>
        <World />
        <StretchHead characterId={characterId} />
        <GloveCursor />
      </Suspense>
    </Canvas>
  );
}
