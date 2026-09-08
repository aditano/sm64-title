import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { StretchHead } from "./StretchHead";
import { World } from "./World";
import { TitleLogo } from "./TitleLogo";
import { useFaceStore } from "@/lib/face-store";
import { gameTime } from "@/lib/game-clock";

const SKY_CLEAR = "#62b4e8";

const ZOOM: Record<0 | 1 | 2, { pos: [number, number, number]; look: [number, number, number] }> = {
  0: { pos: [0, 1.16, 5.15], look: [0, 1.5, 0] },
  1: { pos: [0, 1.28, 3.7], look: [0, 1.52, 0] },
  2: { pos: [0, 1.38, 2.7], look: [0, 1.54, 0] },
};

function ClockDriver() {
  useFrame((_, dt) => {
    gameTime.tick(dt);
  }, -100);
  return null;
}

function Lights() {
  return (
    <>
      <hemisphereLight args={["#fff1d4", "#4a7a30", 0.22]} />
      <ambientLight intensity={0.12} />
      <directionalLight position={[4.5, 6.5, 8]} intensity={1.45} color="#fff4dc" />
      <pointLight position={[0.6, 2.4, 5.4]} intensity={0.55} color="#ffe8c8" distance={12} />
      <directionalLight position={[-6, 1.2, 4]} intensity={0.16} color="#6a9cc8" />
      <directionalLight position={[0, -2, 5]} intensity={0.1} color="#c89060" />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();
  const zoom = useFaceStore((s) => s.zoom);
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const z = ZOOM[zoom];
    cam.position.set(...z.pos);
    cam.fov = 45;
    cam.near = 0.1;
    cam.far = 160;
    cam.lookAt(...z.look);
    cam.updateProjectionMatrix();
  }, [camera, zoom]);
  return null;
}

function PixelLook() {
  const { gl } = useThree();
  useLayoutEffect(() => {
    gl.setClearColor(SKY_CLEAR);
    gl.domElement.style.touchAction = "none";
    gl.domElement.style.imageRendering = "pixelated";
  }, [gl]);
  return null;
}

export function TitleScene({ dpr }: { dpr: number }) {
  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0, 1.16, 5.15], fov: 45, near: 0.1, far: 160 }}
      dpr={dpr}
      gl={{
        antialias: false,
        toneMapping: THREE.NoToneMapping,
        alpha: false,
        preserveDrawingBuffer: true,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor("#62b4e8");
        gl.domElement.style.background = "#62b4e8";
        gl.domElement.style.touchAction = "none";
        gl.domElement.style.imageRendering = "pixelated";
      }}
    >
      <PixelLook />
      <ClockDriver />
      <CameraRig />
      <Lights />
      <Suspense fallback={null}>
        <World />
        <StretchHead />
        <TitleLogo />
      </Suspense>
    </Canvas>
  );
}
