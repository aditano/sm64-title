import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { StretchHead } from "./StretchHead";
import { World } from "./World";
import { TitleLogo } from "./TitleLogo";
import { useFaceStore } from "@/lib/face-store";
import { gameTime, N64_H, N64_W } from "@/lib/game-clock";

const SKY_CLEAR = "#62b4e8";
const DESIGN_VFOV = 45;
const DESIGN_ASPECT = N64_W / N64_H;

/** Match the title's horizontal field of view when the frame is taller than 4:3. */
function verticalFovForAspect(aspect: number) {
  if (!(aspect > 0) || aspect >= DESIGN_ASPECT - 1e-3) return DESIGN_VFOV;
  const tanHalfWidth = Math.tan(THREE.MathUtils.degToRad(DESIGN_VFOV / 2)) * DESIGN_ASPECT;
  return THREE.MathUtils.radToDeg(2 * Math.atan(tanHalfWidth / aspect));
}

const ZOOM: Record<0 | 1 | 2, { pos: [number, number, number]; look: [number, number, number] }> = {
  0: { pos: [0, 1.28, 5.35], look: [0, 1.7, 0] },
  1: { pos: [0, 1.34, 3.75], look: [0, 1.66, 0] },
  2: { pos: [0, 1.44, 2.75], look: [0, 1.72, 0] },
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
    cam.near = 0.1;
    cam.far = 160;
    cam.lookAt(...z.look);
    cam.updateProjectionMatrix();
  }, [camera, zoom]);
  useFrame(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const fov = verticalFovForAspect(cam.aspect);
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
  }, -50);
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
      camera={{ position: [0, 1.28, 5.35], fov: 45, near: 0.1, far: 160 }}
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
