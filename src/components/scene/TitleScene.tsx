import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { StretchHead } from "./StretchHead";
import { World } from "./World";
import { GloveCursor } from "./GloveCursor";

/** Castle Grounds skybox clear / fog tones from SM64 outside areas. */
const SKY_CLEAR = "#6eb8e8";
const FOG_COLOR = "#8ec8e8";

function Lights() {
  return (
    <>
      <hemisphereLight args={["#b8dcff", "#4a9a38", 0.85]} />
      <ambientLight intensity={0.42} />
      <directionalLight
        position={[8, 14, 6]}
        intensity={1.1}
        color="#fff8e8"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-near={2}
        shadow-camera-far={80}
        shadow-camera-left={-16}
        shadow-camera-right={16}
        shadow-camera-top={16}
        shadow-camera-bottom={-8}
      />
    </>
  );
}

function CameraRig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const portrait = size.height / Math.max(size.width, 1) > 1.15;
    const cam = camera as THREE.PerspectiveCamera;
    // SM64 menu frustum is 45°; pull in closer so Mario fills the frame like the original.
    cam.position.set(0, portrait ? 2.35 : 1.85, portrait ? 8.4 : 6.1);
    cam.fov = 45;
    cam.near = 0.1;
    cam.far = 200;
    cam.lookAt(0, portrait ? 1.68 : 1.38, 0);
    cam.updateProjectionMatrix();
  }, [camera, size.height, size.width]);
  return null;
}

export function TitleScene() {
  return (
    <Canvas
      className="h-full w-full touch-none"
      camera={{ position: [0, 1.85, 6.1], fov: 45, near: 0.1, far: 200 }}
      dpr={[1, 1.25]}
      shadows
      gl={{
        antialias: false,
        toneMapping: THREE.NoToneMapping,
        alpha: false,
      }}
      onCreated={({ gl }) => {
        gl.setClearColor(SKY_CLEAR);
        gl.domElement.style.touchAction = "none";
        gl.domElement.style.imageRendering = "pixelated";
      }}
    >
      <fog attach="fog" args={[FOG_COLOR, 38, 95]} />
      <CameraRig />
      <Lights />
      <Suspense fallback={null}>
        <World />
        <StretchHead />
        <GloveCursor />
      </Suspense>
    </Canvas>
  );
}
