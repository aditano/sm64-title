import { useLayoutEffect, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { disposeWorldTextures, makeWorldTextures } from "@/lib/n64-textures";
import { gameTime } from "@/lib/game-clock";

function Flag({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.035, 0.04, 1.15, 6]} />
        <meshLambertMaterial color="#e8d9a8" flatShading />
      </mesh>
      <mesh position={[0.28, 0.95, 0]} rotation={[0, 0, -0.08]}>
        <boxGeometry args={[0.56, 0.26, 0.03]} />
        <meshLambertMaterial color="#d42020" flatShading />
      </mesh>
      <mesh position={[0.42, 0.95, 0.02]}>
        <circleGeometry args={[0.08, 8]} />
        <meshLambertMaterial color="#f4f4f4" flatShading />
      </mesh>
    </group>
  );
}

function MushroomWindow({
  position,
  scale = 1,
}: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <circleGeometry args={[0.42, 10]} />
        <meshLambertMaterial color="#c4a056" flatShading />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.3, 10]} />
        <meshLambertMaterial color="#7ec8e8" flatShading />
      </mesh>
      <mesh position={[0, -0.38, 0]}>
        <boxGeometry args={[0.48, 0.36, 0.06]} />
        <meshLambertMaterial color="#c4a056" flatShading />
      </mesh>
      <mesh position={[0, -0.38, 0.03]}>
        <boxGeometry args={[0.32, 0.24, 0.04]} />
        <meshLambertMaterial color="#5aa8c8" flatShading />
      </mesh>
    </group>
  );
}

function Sm64Tree({
  position,
  scale = 1,
  leaves,
}: {
  position: [number, number, number];
  scale?: number;
  leaves: THREE.Texture;
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.16, 0.26, 1.1, 6]} />
        <meshLambertMaterial color="#7a4a22" flatShading />
      </mesh>
      <mesh position={[0, 1.42, 0]} scale={[1.2, 0.72, 1.1]}>
        <sphereGeometry args={[0.95, 8, 6]} />
        <meshLambertMaterial map={leaves} color="#34a038" flatShading />
      </mesh>
      <mesh position={[-0.38, 1.72, 0.18]} scale={[0.72, 0.48, 0.68]}>
        <sphereGeometry args={[0.8, 8, 6]} />
        <meshLambertMaterial map={leaves} color="#48b84c" flatShading />
      </mesh>
      <mesh position={[0.34, 1.8, -0.12]} scale={[0.68, 0.46, 0.62]}>
        <sphereGeometry args={[0.75, 8, 6]} />
        <meshLambertMaterial map={leaves} color="#2e9432" flatShading />
      </mesh>
    </group>
  );
}

function Tower({
  position,
  radius,
  height,
  roofH,
  brick,
  roof,
  flag,
}: {
  position: [number, number, number];
  radius: number;
  height: number;
  roofH: number;
  brick: THREE.Texture;
  roof: THREE.Texture;
  flag?: boolean;
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]} castShadow={false}>
        <cylinderGeometry args={[radius * 0.92, radius, height, 8]} />
        <meshLambertMaterial map={brick} color="#efe8dc" flatShading />
      </mesh>
      <mesh position={[0, height + roofH / 2, 0]}>
        <coneGeometry args={[radius * 1.28, roofH, 8]} />
        <meshLambertMaterial map={roof} color="#d42020" flatShading />
      </mesh>
      {flag ? <Flag position={[0, height + roofH, 0]} /> : null}
    </group>
  );
}

export function World() {
  const textures = useMemo(() => makeWorldTextures(), []);

  useLayoutEffect(() => () => disposeWorldTextures(textures), [textures]);

  useFrame(() => {
    const map = textures.water;
    map.offset.x = gameTime.t * 0.04;
    map.offset.y = gameTime.t * 0.02;
  });

  const { grass, brick, roof, dirt, stone, water, leaves, glass } = textures;

  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[90, 16, 10]} />
        <meshBasicMaterial color="#5eb8f0" side={THREE.BackSide} depthWrite={false} fog={false} />
      </mesh>
      <mesh position={[-24, 14, -42]} scale={[9, 3.2, 4.5]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color="#f4f8ff" depthWrite={false} fog={false} />
      </mesh>
      <mesh position={[18, 16, -46]} scale={[11, 3.8, 5]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color="#eef4ff" depthWrite={false} fog={false} />
      </mesh>
      <mesh position={[2, 18, -50]} scale={[7, 2.6, 3.5]}>
        <sphereGeometry args={[1, 8, 6]} />
        <meshBasicMaterial color="#f7fbff" depthWrite={false} fog={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8]}>
        <circleGeometry args={[70, 24]} />
        <meshLambertMaterial map={grass} color="#48c040" flatShading />
      </mesh>

      <mesh position={[-18, 1.2, -28]}>
        <sphereGeometry args={[7, 8, 6]} />
        <meshLambertMaterial map={grass} color="#3a9a38" flatShading />
      </mesh>
      <mesh position={[20, 1.4, -30]}>
        <sphereGeometry args={[8, 8, 6]} />
        <meshLambertMaterial map={grass} color="#3a9a38" flatShading />
      </mesh>
      <mesh position={[0, 0.8, -40]}>
        <sphereGeometry args={[10, 8, 6]} />
        <meshLambertMaterial map={grass} color="#348c34" flatShading />
      </mesh>

      <mesh position={[0, 0.06, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8.4, 13.6, 24]} />
        <meshLambertMaterial map={water} color="#4aa4d0" transparent opacity={0.82} flatShading />
      </mesh>

      <mesh position={[0, 0.05, -7]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.1, 8]} />
        <meshLambertMaterial map={dirt} color="#c9a060" flatShading />
      </mesh>
      <mesh position={[-1.35, 0.16, -7]}>
        <boxGeometry args={[0.18, 0.24, 7.2]} />
        <meshLambertMaterial map={stone} color="#c8b080" flatShading />
      </mesh>
      <mesh position={[1.35, 0.16, -7]}>
        <boxGeometry args={[0.18, 0.24, 7.2]} />
        <meshLambertMaterial map={stone} color="#c8b080" flatShading />
      </mesh>

      <group position={[0, -0.15, -15.4]} scale={1.08}>
        <mesh position={[0, 3.5, 0]}>
          <boxGeometry args={[8.4, 7.0, 8.6]} />
          <meshLambertMaterial map={brick} color="#efe8dc" flatShading />
        </mesh>
        <mesh position={[0, 7.12, 0]}>
          <boxGeometry args={[9.2, 0.4, 9.2]} />
          <meshLambertMaterial map={brick} color="#f4eee4" flatShading />
        </mesh>

        <mesh position={[0, 1.7, 4.38]}>
          <boxGeometry args={[2.2, 3.4, 0.28]} />
          <meshLambertMaterial color="#3a2414" flatShading />
        </mesh>
        <mesh position={[-0.5, 1.7, 4.48]}>
          <boxGeometry args={[0.95, 3.1, 0.08]} />
          <meshLambertMaterial color="#2a1810" flatShading />
        </mesh>
        <mesh position={[0.5, 1.7, 4.48]}>
          <boxGeometry args={[0.95, 3.1, 0.08]} />
          <meshLambertMaterial color="#2a1810" flatShading />
        </mesh>

        <mesh position={[0, 5.6, 4.36]}>
          <circleGeometry args={[1.35, 16]} />
          <meshBasicMaterial map={glass} toneMapped={false} />
        </mesh>
        <mesh position={[0, 5.6, 4.34]}>
          <ringGeometry args={[1.35, 1.55, 16]} />
          <meshLambertMaterial color="#c4a056" flatShading />
        </mesh>

        <MushroomWindow position={[-2.35, 4.5, 4.36]} />
        <MushroomWindow position={[2.35, 4.5, 4.36]} />
        <MushroomWindow position={[-2.35, 2.55, 4.36]} scale={0.82} />
        <MushroomWindow position={[2.35, 2.55, 4.36]} scale={0.82} />

        <Tower position={[-5.55, 0, 3.9]} radius={1.5} height={6.4} roofH={2.7} brick={brick} roof={roof} flag />
        <Tower position={[5.55, 0, 3.9]} radius={1.5} height={6.4} roofH={2.7} brick={brick} roof={roof} flag />
        <Tower position={[-5.1, 0, -2.8]} radius={1.2} height={5.2} roofH={2.1} brick={brick} roof={roof} />
        <Tower position={[5.1, 0, -2.8]} radius={1.2} height={5.2} roofH={2.1} brick={brick} roof={roof} />

        <mesh position={[0, 8.6, -0.4]}>
          <cylinderGeometry args={[1.45, 1.6, 4.4, 8]} />
          <meshLambertMaterial map={brick} color="#efe8dc" flatShading />
        </mesh>
        <mesh position={[0, 11.5, -0.4]}>
          <coneGeometry args={[2.05, 2.8, 8]} />
          <meshLambertMaterial map={roof} color="#d42020" flatShading />
        </mesh>
        <Flag position={[0, 12.7, -0.4]} />

        <mesh position={[-3.6, 8.0, 1.0]} rotation={[0, 0.35, 0]}>
          <coneGeometry args={[2.2, 1.6, 4]} />
          <meshLambertMaterial map={roof} color="#d42020" flatShading />
        </mesh>
        <mesh position={[3.6, 8.0, 1.0]} rotation={[0, -0.35, 0]}>
          <coneGeometry args={[2.2, 1.6, 4]} />
          <meshLambertMaterial map={roof} color="#d42020" flatShading />
        </mesh>
      </group>

      <Sm64Tree position={[-4.15, 0, -5.6]} scale={1.22} leaves={leaves} />
      <Sm64Tree position={[4.45, 0, -5.3]} scale={1.12} leaves={leaves} />
      <Sm64Tree position={[-7.4, 0, -9.5]} scale={1.35} leaves={leaves} />
      <Sm64Tree position={[8.1, 0, -10]} scale={1.28} leaves={leaves} />
      <Sm64Tree position={[-4.8, 0, -17]} scale={1.05} leaves={leaves} />
      <Sm64Tree position={[5.6, 0, -18]} scale={1.1} leaves={leaves} />

      <group position={[0, 0, 0.15]}>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.82, 0.9, 0.1, 20]} />
          <meshLambertMaterial map={stone} color="#9a968f" />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[0.42, 0.5, 0.28, 20]} />
          <meshLambertMaterial map={stone} color="#a8a49e" />
        </mesh>
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[0.58, 0.48, 0.08, 20]} />
          <meshLambertMaterial map={stone} color="#b8b4ae" />
        </mesh>
      </group>
    </group>
  );
}
