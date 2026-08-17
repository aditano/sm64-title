import { useLayoutEffect, useMemo } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function prep(tex: THREE.Texture, repeatX = 1, repeatY = 1) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeatX, repeatY);
  tex.anisotropy = 8;
  return tex;
}

function Flag({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 1.45, 6]} />
        <meshLambertMaterial color="#e8d9a8" />
      </mesh>
      <mesh position={[0.32, 1.18, 0]} rotation={[0, 0, -0.12]} castShadow>
        <boxGeometry args={[0.64, 0.28, 0.04]} />
        <meshLambertMaterial color="#d31b2a" />
      </mesh>
      <mesh position={[0.48, 1.18, 0]}>
        <boxGeometry args={[0.28, 0.28, 0.045]} />
        <meshLambertMaterial color="#f4f4f4" />
      </mesh>
    </group>
  );
}

function RoundTree({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.22, 1.1, 6]} />
        <meshLambertMaterial color="#7a4a22" />
      </mesh>
      <mesh position={[0, 1.7, 0]} castShadow>
        <sphereGeometry args={[1.05, 8, 6]} />
        <meshLambertMaterial color="#2f9a38" />
      </mesh>
      <mesh position={[0.15, 2.15, 0.1]} castShadow>
        <sphereGeometry args={[0.72, 8, 6]} />
        <meshLambertMaterial color="#3cb046" />
      </mesh>
    </group>
  );
}

function Window({ position, scale = 1 }: { position: [number, number, number]; scale?: number }) {
  return (
    <group position={position} scale={scale}>
      <mesh>
        <circleGeometry args={[0.38, 12]} />
        <meshLambertMaterial color="#6b4a22" />
      </mesh>
      <mesh position={[0, 0, 0.02]}>
        <circleGeometry args={[0.28, 12]} />
        <meshLambertMaterial color="#8fd0e8" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.04, 0.56, 0.02]} />
        <meshLambertMaterial color="#d8c48a" />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[0.56, 0.04, 0.02]} />
        <meshLambertMaterial color="#d8c48a" />
      </mesh>
    </group>
  );
}

export function World() {
  const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
  const [grass, stone, roof, sky, glass, pedestal] = useTexture([
    asset("textures/grass.jpg"),
    asset("textures/stone.jpg"),
    asset("textures/roof.jpg"),
    asset("textures/sky.jpg"),
    asset("textures/glass.jpg"),
    asset("textures/pedestal.jpg"),
  ]);

  useLayoutEffect(() => {
    prep(grass, 22, 22);
    prep(stone, 3, 2.4);
    prep(roof, 2.4, 2.4);
    prep(pedestal, 1.6, 1.6);
    sky.colorSpace = THREE.SRGBColorSpace;
    glass.colorSpace = THREE.SRGBColorSpace;
  }, [grass, stone, roof, sky, glass, pedestal]);

  const trees = useMemo(
    () =>
      [
        [-11, 0, -10, 1.15],
        [11.4, 0, -9.5, 1.05],
        [-16, 0, -18, 1.35],
        [15.5, 0, -17, 1.25],
        [-8, 0, -26, 1.1],
        [9, 0, -27, 1.2],
        [-20, 0, -12, 0.95],
        [19, 0, -13, 1],
      ] as Array<[number, number, number, number]>,
    [],
  );

  const fenceZ = -8.4;

  return (
    <group>
      <mesh scale={[-1, 1, 1]}>
        <sphereGeometry args={[120, 24, 16]} />
        <meshBasicMaterial map={sky} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]} receiveShadow>
        <circleGeometry args={[80, 48]} />
        <meshLambertMaterial map={grass} color="#8fd45a" />
      </mesh>

      <mesh position={[0, 0.04, -14]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[9.2, 13.4, 48]} />
        <meshLambertMaterial color="#4aa3c4" transparent opacity={0.7} />
      </mesh>

      <mesh position={[0, 0.12, -7.2]} receiveShadow>
        <boxGeometry args={[3.2, 0.16, 9.6]} />
        <meshLambertMaterial color="#d6c27a" />
      </mesh>
      <mesh position={[0, 0.22, -3.6]} receiveShadow>
        <boxGeometry args={[3.6, 0.18, 2.2]} />
        <meshLambertMaterial map={stone} color="#d8d2c4" />
      </mesh>

      {Array.from({ length: 9 }, (_, i) => {
        const x = -7.2 + i * 1.8;
        return (
          <group key={i} position={[x, 0, fenceZ]}>
            <mesh position={[0, 0.38, 0]}>
              <boxGeometry args={[0.1, 0.76, 0.1]} />
              <meshLambertMaterial color="#8a5a28" />
            </mesh>
            <mesh position={[0.9, 0.52, 0]}>
              <boxGeometry args={[1.8, 0.08, 0.06]} />
              <meshLambertMaterial color="#6b4220" />
            </mesh>
          </group>
        );
      })}

      <group position={[0, 0, -15.5]} scale={1.22}>
        <mesh position={[0, 3.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[14, 7.2, 10]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[0, 7.35, 0]} castShadow>
          <boxGeometry args={[15.2, 0.55, 11]} />
          <meshLambertMaterial map={stone} color="#f4eee4" />
        </mesh>

        <mesh position={[0, 9.1, 1.2]} castShadow>
          <boxGeometry args={[6.4, 3.4, 4.2]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[0, 11.7, 1.2]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[4.6, 2.8, 4]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>

        <mesh position={[0, 13.4, -0.6]} castShadow receiveShadow>
          <cylinderGeometry args={[1.55, 1.7, 5.6, 8]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[0, 17.1, -0.6]} castShadow>
          <coneGeometry args={[2.15, 3.2, 8]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>
        <Flag position={[0, 18.4, -0.6]} />

        <mesh position={[0, 6.55, 5.08]}>
          <circleGeometry args={[1.35, 20]} />
          <meshBasicMaterial map={glass} toneMapped={false} />
        </mesh>
        <mesh position={[0, 6.55, 5.05]}>
          <ringGeometry args={[1.35, 1.55, 20]} />
          <meshLambertMaterial color="#c4a056" />
        </mesh>

        <mesh position={[0, 1.85, 5.15]} castShadow>
          <boxGeometry args={[2.6, 3.7, 0.35]} />
          <meshLambertMaterial color="#4a2c14" />
        </mesh>
        <mesh position={[0, 2.55, 5.22]}>
          <boxGeometry args={[1.9, 2.1, 0.12]} />
          <meshLambertMaterial color="#2a1810" />
        </mesh>
        <mesh position={[0, 1.85, 5.34]}>
          <boxGeometry args={[0.12, 3.7, 0.08]} />
          <meshLambertMaterial color="#d8c48a" />
        </mesh>

        <Window position={[-3.6, 4.6, 5.06]} />
        <Window position={[3.6, 4.6, 5.06]} />
        <Window position={[-3.6, 2.6, 5.06]} scale={0.85} />
        <Window position={[3.6, 2.6, 5.06]} scale={0.85} />

        <mesh position={[-8.2, 3.2, 2.4]} castShadow receiveShadow>
          <cylinderGeometry args={[1.55, 1.65, 6.4, 8]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[-8.2, 7.4, 2.4]} castShadow>
          <coneGeometry args={[2.15, 2.9, 8]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>
        <Flag position={[-8.2, 8.6, 2.4]} />

        <mesh position={[8.2, 3.2, 2.4]} castShadow receiveShadow>
          <cylinderGeometry args={[1.55, 1.65, 6.4, 8]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[8.2, 7.4, 2.4]} castShadow>
          <coneGeometry args={[2.15, 2.9, 8]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>
        <Flag position={[8.2, 8.6, 2.4]} />

        <mesh position={[-7.4, 2.8, -3.6]} castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.45, 5.6, 8]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[-7.4, 6.5, -3.6]} castShadow>
          <coneGeometry args={[1.9, 2.5, 8]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>

        <mesh position={[7.4, 2.8, -3.6]} castShadow receiveShadow>
          <cylinderGeometry args={[1.35, 1.45, 5.6, 8]} />
          <meshLambertMaterial map={stone} color="#efe8dc" />
        </mesh>
        <mesh position={[7.4, 6.5, -3.6]} castShadow>
          <coneGeometry args={[1.9, 2.5, 8]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>

        <mesh position={[-5.6, 8.4, 1.4]} rotation={[0, 0.4, 0]} castShadow>
          <coneGeometry args={[3.4, 2.2, 4]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>
        <mesh position={[5.6, 8.4, 1.4]} rotation={[0, -0.4, 0]} castShadow>
          <coneGeometry args={[3.4, 2.2, 4]} />
          <meshLambertMaterial map={roof} color="#d83a32" />
        </mesh>
      </group>

      {trees.map(([x, y, z, s], i) => (
        <RoundTree key={i} position={[x, y, z]} scale={s} />
      ))}

      <group position={[0, 0, 0.2]}>
        <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.62, 0.74, 0.84, 20]} />
          <meshLambertMaterial map={pedestal} color="#b8b4ae" />
        </mesh>
        <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.78, 0.64, 0.14, 20]} />
          <meshLambertMaterial map={pedestal} color="#c4c0ba" />
        </mesh>
        <mesh position={[0, 0.07, 0]} receiveShadow>
          <cylinderGeometry args={[0.88, 0.96, 0.14, 20]} />
          <meshLambertMaterial map={pedestal} color="#a8a49e" />
        </mesh>
      </group>
    </group>
  );
}
