import * as THREE from "three";
import { box, cone, cyl, disc, mergeParts, place, plumber, sph, tint, torus, type EyeSpec } from "./geom";

export type BuiltHead = {
  geometry: THREE.BufferGeometry;
  eyes: EyeSpec[];
};

type Kit = { parts: THREE.BufferGeometry[]; eyes: EyeSpec[] };

function mario(): Kit {
  return plumber("#E8A060", "#E42020");
}

function luigi(): Kit {
  return plumber("#E8B48A", "#43B047", "#F4F4F4", "#3A2418", { tall: true });
}

function wario(): Kit {
  return plumber("#E8B070", "#F5D000", "#F4F4F4", "#3A2418", { bigNose: true, zigzag: true });
}

function peach(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#F0C4A0";
  const hair = "#F7D35E";
  parts.push(tint(place(sph(0.68, 26, 20), 0, 0, 0, 0.98, 1.08, 0.94), skin, 0.03));
  parts.push(tint(place(sph(0.16, 12, 10), -0.62, 0.04, 0.08, 0.5, 1, 0.9), skin));
  parts.push(tint(place(sph(0.16, 12, 10), 0.62, 0.04, 0.08, 0.5, 1, 0.9), skin));
  parts.push(tint(place(sph(0.14, 12, 10), 0, -0.04, 0.66), skin));
  parts.push(tint(place(sph(0.82, 22, 16), 0, 0.18, -0.12, 1.08, 0.95, 0.95), hair));
  parts.push(tint(place(sph(0.42, 14, 12), -0.55, -0.15, -0.15), hair));
  parts.push(tint(place(sph(0.42, 14, 12), 0.55, -0.15, -0.15), hair));
  parts.push(tint(place(sph(0.36, 12, 10), 0, -0.35, -0.28), hair));
  parts.push(tint(place(cyl(0.22, 0.26, 0.16, 10), 0, 0.82, 0), "#F6D44A"));
  parts.push(tint(place(box(0.08, 0.18, 0.08), 0, 0.96, 0), "#F6D44A"));
  parts.push(tint(place(box(0.08, 0.14, 0.08), -0.16, 0.92, 0), "#F6D44A"));
  parts.push(tint(place(box(0.08, 0.14, 0.08), 0.16, 0.92, 0), "#F6D44A"));
  parts.push(tint(place(sph(0.07, 8, 8), -0.58, -0.12, 0.28), "#F4A4C4"));
  parts.push(tint(place(sph(0.07, 8, 8), 0.58, -0.12, 0.28), "#F4A4C4"));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.1, 0.58], scale: [0.14, 0.18, 0.09], iris: "#3A7AC8" },
      { position: [0.2, 0.1, 0.58], scale: [0.14, 0.18, 0.09], iris: "#3A7AC8" },
    ],
  };
}

function bowser(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#E8A030";
  parts.push(tint(place(sph(0.78, 26, 20), 0, -0.04, 0, 1.12, 0.92, 1.05), skin, 0.05));
  parts.push(tint(place(sph(0.48, 18, 14), 0, -0.18, 0.55, 1.15, 0.75, 1.05), skin));
  parts.push(tint(place(sph(0.08, 8, 8), -0.16, -0.12, 0.98), "#3A2418"));
  parts.push(tint(place(sph(0.08, 8, 8), 0.16, -0.12, 0.98), "#3A2418"));
  parts.push(tint(place(box(0.55, 0.1, 0.12), 0, 0.22, 0.58), "#3A2418"));
  parts.push(tint(place(cone(0.14, 0.42, 8), -0.48, 0.62, 0.1, 1, 1, 1, 0.35), "#F5F0D8"));
  parts.push(tint(place(cone(0.14, 0.42, 8), 0.48, 0.62, 0.1, 1, 1, 1, -0.35), "#F5F0D8"));
  parts.push(tint(place(sph(0.42, 14, 12), 0, 0.55, -0.15, 1.15, 0.7, 0.8), "#C41E1E"));
  parts.push(tint(place(sph(0.18, 10, 8), -0.22, 0.72, -0.05), "#C41E1E"));
  parts.push(tint(place(sph(0.18, 10, 8), 0.22, 0.72, -0.05), "#C41E1E"));
  parts.push(tint(place(sph(0.16, 10, 8), -0.72, 0.02, 0.12, 0.55, 1, 0.8), skin));
  parts.push(tint(place(sph(0.16, 10, 8), 0.72, 0.02, 0.12, 0.55, 1, 0.8), skin));
  return {
    parts,
    eyes: [
      { position: [-0.24, 0.16, 0.62], scale: [0.16, 0.14, 0.1], iris: "#C41E1E" },
      { position: [0.24, 0.16, 0.62], scale: [0.16, 0.14, 0.1], iris: "#C41E1E" },
    ],
  };
}

function toad(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#F5D5B8";
  parts.push(tint(place(sph(0.52, 22, 16), 0, -0.22, 0, 1.05, 0.95, 0.95), skin, 0.03));
  parts.push(tint(place(sph(0.78, 24, 18), 0, 0.28, 0, 1.15, 0.82, 1.05), "#F7F4EE"));
  parts.push(tint(place(sph(0.2, 10, 8), -0.42, 0.42, 0.42), "#E52521"));
  parts.push(tint(place(sph(0.2, 10, 8), 0.42, 0.42, 0.42), "#E52521"));
  parts.push(tint(place(sph(0.18, 10, 8), 0, 0.58, 0.28), "#E52521"));
  parts.push(tint(place(sph(0.16, 10, 8), -0.28, 0.22, 0.62), "#E52521"));
  parts.push(tint(place(sph(0.16, 10, 8), 0.28, 0.22, 0.62), "#E52521"));
  parts.push(tint(place(sph(0.12, 10, 8), 0, -0.18, 0.48), skin));
  return {
    parts,
    eyes: [
      { position: [-0.16, -0.12, 0.46], scale: [0.13, 0.2, 0.09], iris: "#1E1A18" },
      { position: [0.16, -0.12, 0.46], scale: [0.13, 0.2, 0.09], iris: "#1E1A18" },
    ],
  };
}

function dk(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const fur = "#6B3A1F";
  const muzzle = "#E8B896";
  parts.push(tint(place(sph(0.78, 26, 20), 0, 0.08, -0.08, 1.05, 0.95, 0.95), fur, 0.06));
  parts.push(tint(place(sph(0.52, 20, 14), 0, -0.18, 0.42, 1.2, 0.85, 1), muzzle));
  parts.push(tint(place(sph(0.08, 8, 8), -0.16, -0.08, 0.88), "#3A2418"));
  parts.push(tint(place(sph(0.08, 8, 8), 0.16, -0.08, 0.88), "#3A2418"));
  parts.push(tint(place(sph(0.22, 12, 10), -0.62, 0.55, -0.08, 0.7, 1.1, 0.55), fur));
  parts.push(tint(place(sph(0.22, 12, 10), 0.62, 0.55, -0.08, 0.7, 1.1, 0.55), fur));
  parts.push(tint(place(box(0.28, 0.42, 0.08), 0, -0.62, 0.22), "#E52521"));
  parts.push(tint(place(torus(0.12, 0.035, 8, 14), 0, -0.48, 0.27, 1, 1, 1, Math.PI / 2), "#F6D44A"));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.18, 0.55], scale: [0.14, 0.16, 0.09], iris: "#1E1A18" },
      { position: [0.2, 0.18, 0.55], scale: [0.14, 0.16, 0.09], iris: "#1E1A18" },
    ],
  };
}

function link(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#E8B898";
  const hat = "#2E8B3A";
  const hair = "#C4A035";
  parts.push(tint(place(sph(0.66, 24, 18), 0, -0.04, 0, 0.95, 1.08, 0.95), skin, 0.03));
  parts.push(tint(place(sph(0.18, 12, 10), -0.68, 0.08, 0.02, 0.4, 1.35, 0.7), skin));
  parts.push(tint(place(sph(0.18, 12, 10), 0.68, 0.08, 0.02, 0.4, 1.35, 0.7), skin));
  parts.push(tint(place(sph(0.12, 10, 8), 0, -0.02, 0.64), skin));
  parts.push(tint(place(sph(0.28, 12, 10), -0.42, 0.22, 0.28, 0.8, 0.7, 0.55), hair));
  parts.push(tint(place(sph(0.28, 12, 10), 0.42, 0.22, 0.28, 0.8, 0.7, 0.55), hair));
  parts.push(tint(place(cone(0.62, 1.15, 14), 0, 0.72, -0.18, 1, 1, 1, -0.55), hat));
  parts.push(tint(place(sph(0.22, 10, 8), 0.02, 1.18, -0.55), hat));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.08, 0.56], scale: [0.13, 0.16, 0.08], iris: "#2E6B3A" },
      { position: [0.2, 0.08, 0.56], scale: [0.13, 0.16, 0.08], iris: "#2E6B3A" },
    ],
  };
}

function zelda(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#F0C8A8";
  const hair = "#F4D56A";
  parts.push(tint(place(sph(0.66, 24, 18), 0, 0, 0, 0.95, 1.1, 0.94), skin, 0.03));
  parts.push(tint(place(sph(0.16, 12, 10), -0.66, 0.08, 0.04, 0.38, 1.4, 0.65), skin));
  parts.push(tint(place(sph(0.16, 12, 10), 0.66, 0.08, 0.04, 0.38, 1.4, 0.65), skin));
  parts.push(tint(place(sph(0.11, 10, 8), 0, 0, 0.64), skin));
  parts.push(tint(place(sph(0.78, 20, 16), 0, 0.2, -0.16, 1.05, 1.05, 0.9), hair));
  parts.push(tint(place(sph(0.28, 12, 10), -0.38, -0.35, 0.18, 0.7, 1.3, 0.55), hair));
  parts.push(tint(place(sph(0.28, 12, 10), 0.38, -0.35, 0.18, 0.7, 1.3, 0.55), hair));
  parts.push(tint(place(torus(0.28, 0.035, 8, 16), 0, 0.62, 0.12, 1, 1, 1, 0.4), "#E8C84A"));
  parts.push(tint(place(sph(0.06, 8, 8), 0, 0.72, 0.28), "#7BC4C8"));
  return {
    parts,
    eyes: [
      { position: [-0.18, 0.1, 0.56], scale: [0.13, 0.17, 0.08], iris: "#3A8B6A" },
      { position: [0.18, 0.1, 0.56], scale: [0.13, 0.17, 0.08], iris: "#3A8B6A" },
    ],
  };
}

function ganondorf(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#C48A58";
  const hair = "#C41E1E";
  parts.push(tint(place(sph(0.74, 24, 18), 0, 0, 0, 1.02, 1.12, 0.98), skin, 0.04));
  parts.push(tint(place(sph(0.16, 10, 8), 0, -0.02, 0.7), skin));
  parts.push(tint(place(box(0.5, 0.08, 0.1), 0, 0.22, 0.58), "#3A2418"));
  parts.push(tint(place(sph(0.55, 16, 12), 0, 0.55, -0.22, 1.2, 1.15, 0.85), hair));
  parts.push(tint(place(sph(0.28, 12, 10), -0.22, 0.15, -0.55, 0.7, 1.6, 0.55), hair));
  parts.push(tint(place(sph(0.28, 12, 10), 0.22, 0.15, -0.55, 0.7, 1.6, 0.55), hair));
  parts.push(tint(place(torus(0.3, 0.04, 8, 16), 0, 0.58, 0.18, 1, 1, 1, 0.35), "#E8C84A"));
  parts.push(tint(place(box(0.22, 0.08, 0.16), 0, -0.42, 0.42), "#3A2418"));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.12, 0.62], scale: [0.14, 0.12, 0.08], iris: "#C41E1E" },
      { position: [0.2, 0.12, 0.62], scale: [0.14, 0.12, 0.08], iris: "#C41E1E" },
    ],
  };
}

function samus(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const orange = "#E07018";
  const deep = "#C45412";
  const shade = "#8A3810";
  const visor = "#0A160E";
  const glass = "#24C84A";
  const glow = "#8CFF90";
  const steel = "#D0C4A4";

  parts.push(tint(place(sph(0.78, 32, 24), 0, 0.06, 0, 1.06, 1.1, 1.04), orange, 0.03));
  parts.push(tint(place(sph(0.48, 20, 16), 0, -0.38, 0.16, 1.12, 0.78, 0.98), deep));
  parts.push(tint(place(sph(0.22, 12, 10), 0, -0.58, 0.32, 1.15, 0.7, 0.85), deep));

  parts.push(tint(place(sph(0.58, 20, 14), 0, 0.22, 0.46, 1.12, 0.36, 0.42), deep));
  parts.push(tint(place(box(0.12, 0.62, 0.2), 0, 0.38, 0.52), deep));

  parts.push(tint(place(sph(0.52, 22, 16), 0, 0.05, 0.52, 1.22, 0.5, 0.36), visor, 0.02));
  parts.push(tint(place(sph(0.46, 22, 16), 0, 0.05, 0.62, 1.16, 0.42, 0.26), glass, 0.04));
  parts.push(tint(place(sph(0.16, 12, 8), 0, 0.12, 0.78, 2.05, 0.22, 0.16), glow, 0.02));

  parts.push(tint(place(sph(0.26, 14, 12), -0.74, 0.02, 0.06, 0.82, 0.95, 1.2), deep));
  parts.push(tint(place(sph(0.26, 14, 12), 0.74, 0.02, 0.06, 0.82, 0.95, 1.2), deep));
  parts.push(tint(place(cyl(0.11, 0.13, 0.18, 10), -0.88, 0.02, 0.06, 1, 1, 1, 0, 0, Math.PI / 2), shade));
  parts.push(tint(place(cyl(0.11, 0.13, 0.18, 10), 0.88, 0.02, 0.06, 1, 1, 1, 0, 0, Math.PI / 2), shade));
  parts.push(tint(place(cyl(0.06, 0.07, 0.05, 8), -0.98, 0.02, 0.06, 1, 1, 1, 0, 0, Math.PI / 2), visor));
  parts.push(tint(place(cyl(0.06, 0.07, 0.05, 8), 0.98, 0.02, 0.06, 1, 1, 1, 0, 0, Math.PI / 2), visor));

  parts.push(tint(place(cyl(0.4, 0.46, 0.18, 14), 0, -0.68, 0.02), shade));
  parts.push(tint(place(torus(0.42, 0.035, 8, 18), 0, -0.58, 0.02, 1, 1, 1, Math.PI / 2), steel));

  return {
    parts,
    eyes: [
      { position: [-0.2, 0.06, 0.66], scale: [0.15, 0.1, 0.06], iris: "#3ECF6A" },
      { position: [0.2, 0.06, 0.66], scale: [0.15, 0.1, 0.06], iris: "#3ECF6A" },
    ],
  };
}

function yoshi(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const green = "#7CCB4A";
  parts.push(tint(place(sph(0.68, 24, 18), 0, 0.08, -0.08, 1.05, 1, 0.95), green, 0.04));
  parts.push(tint(place(sph(0.42, 18, 14), 0, -0.12, 0.55, 1.25, 0.72, 1.15), green));
  parts.push(tint(place(sph(0.22, 12, 10), -0.42, -0.02, 0.42), "#F4F4F4"));
  parts.push(tint(place(sph(0.22, 12, 10), 0.42, -0.02, 0.42), "#F4F4F4"));
  parts.push(tint(place(sph(0.07, 8, 8), -0.14, -0.08, 0.98), "#3A2418"));
  parts.push(tint(place(sph(0.07, 8, 8), 0.14, -0.08, 0.98), "#3A2418"));
  parts.push(tint(place(sph(0.16, 10, 8), 0, 0.62, 0.05, 1.4, 0.55, 0.7), "#E52521"));
  parts.push(tint(place(sph(0.12, 8, 8), -0.18, 0.7, 0.02), "#E52521"));
  parts.push(tint(place(sph(0.12, 8, 8), 0.18, 0.7, 0.02), "#E52521"));
  return {
    parts,
    eyes: [
      { position: [-0.22, 0.22, 0.48], scale: [0.16, 0.22, 0.1], iris: "#2A5CAA" },
      { position: [0.22, 0.22, 0.48], scale: [0.16, 0.22, 0.1], iris: "#2A5CAA" },
    ],
  };
}

function kirby(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const pink = "#FFB6C8";
  parts.push(tint(place(sph(0.82, 28, 22), 0, 0, 0), pink, 0.03));
  parts.push(tint(place(sph(0.12, 10, 8), -0.32, -0.08, 0.68, 1.15, 0.7, 0.5), "#F08090"));
  parts.push(tint(place(sph(0.12, 10, 8), 0.32, -0.08, 0.68, 1.15, 0.7, 0.5), "#F08090"));
  parts.push(tint(place(sph(0.22, 10, 8), -0.7, -0.35, 0.15, 1.1, 0.55, 0.7), "#E85878"));
  parts.push(tint(place(sph(0.22, 10, 8), 0.7, -0.35, 0.15, 1.1, 0.55, 0.7), "#E85878"));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.16, 0.7], scale: [0.12, 0.22, 0.08], iris: "#1E1A18" },
      { position: [0.2, 0.16, 0.7], scale: [0.12, 0.22, 0.08], iris: "#1E1A18" },
    ],
  };
}

function fox(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const orange = "#E87830";
  const cream = "#F4E8D8";
  parts.push(tint(place(sph(0.66, 22, 16), 0, 0.06, -0.08, 1, 0.95, 0.95), orange, 0.04));
  parts.push(tint(place(sph(0.32, 14, 12), 0, -0.12, 0.52, 1.05, 0.75, 1.25), cream));
  parts.push(tint(place(sph(0.07, 8, 8), 0, -0.08, 0.88), "#1E1A18"));
  parts.push(tint(place(cone(0.18, 0.42, 8), -0.42, 0.58, -0.05, 0.7, 1, 0.55, 0.25, 0, 0.4), orange));
  parts.push(tint(place(cone(0.18, 0.42, 8), 0.42, 0.58, -0.05, 0.7, 1, 0.55, 0.25, 0, -0.4), orange));
  parts.push(tint(place(box(0.72, 0.08, 0.16), 0, 0.18, 0.42), "#4A5560"));
  parts.push(tint(place(box(0.18, 0.12, 0.28), -0.42, 0.02, 0.05), "#4A5560"));
  parts.push(tint(place(box(0.18, 0.12, 0.28), 0.42, 0.02, 0.05), "#4A5560"));
  return {
    parts,
    eyes: [
      { position: [-0.18, 0.14, 0.52], scale: [0.13, 0.14, 0.08], iris: "#2A5CAA" },
      { position: [0.18, 0.14, 0.52], scale: [0.13, 0.14, 0.08], iris: "#2A5CAA" },
    ],
  };
}

function pikachu(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const yellow = "#F7D133";
  parts.push(tint(place(sph(0.7, 24, 18), 0, -0.02, 0, 1.02, 1, 0.95), yellow, 0.04));
  parts.push(tint(place(cone(0.16, 0.62, 8), -0.38, 0.72, -0.05, 0.75, 1, 0.55, 0.15, 0, 0.35), yellow));
  parts.push(tint(place(cone(0.16, 0.62, 8), 0.38, 0.72, -0.05, 0.75, 1, 0.55, 0.15, 0, -0.35), yellow));
  parts.push(tint(place(cone(0.1, 0.2, 8), -0.48, 1.02, -0.12, 0.8, 1, 0.55, 0.2, 0, 0.35), "#1E1A18"));
  parts.push(tint(place(cone(0.1, 0.2, 8), 0.48, 1.02, -0.12, 0.8, 1, 0.55, 0.2, 0, -0.35), "#1E1A18"));
  parts.push(tint(place(sph(0.14, 10, 8), -0.42, -0.08, 0.52), "#E52521"));
  parts.push(tint(place(sph(0.14, 10, 8), 0.42, -0.08, 0.52), "#E52521"));
  parts.push(tint(place(sph(0.07, 8, 8), 0, -0.08, 0.7), "#1E1A18"));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.12, 0.58], scale: [0.13, 0.16, 0.08], iris: "#1E1A18" },
      { position: [0.2, 0.12, 0.58], scale: [0.13, 0.16, 0.08], iris: "#1E1A18" },
    ],
  };
}

function jigglypuff(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const pink = "#FFC0D4";
  parts.push(tint(place(sph(0.8, 26, 20), 0, 0, 0), pink, 0.03));
  parts.push(tint(place(sph(0.2, 12, 10), -0.42, 0.62, 0.08, 0.7, 1.15, 0.45), pink));
  parts.push(tint(place(sph(0.2, 12, 10), 0.42, 0.62, 0.08, 0.7, 1.15, 0.45), pink));
  parts.push(tint(place(torus(0.08, 0.035, 8, 12), 0, 0.82, 0.05, 1, 1, 1, 0.2), "#E080A0"));
  parts.push(tint(place(sph(0.12, 10, 8), -0.3, -0.08, 0.68, 1.1, 0.65, 0.45), "#F090A8"));
  parts.push(tint(place(sph(0.12, 10, 8), 0.3, -0.08, 0.68, 1.1, 0.65, 0.45), "#F090A8"));
  return {
    parts,
    eyes: [
      { position: [-0.2, 0.12, 0.7], scale: [0.16, 0.18, 0.08], iris: "#3A7AC8" },
      { position: [0.2, 0.12, 0.7], scale: [0.16, 0.18, 0.08], iris: "#3A7AC8" },
    ],
  };
}

function falcon(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const blue = "#1E4A9C";
  parts.push(tint(place(sph(0.76, 24, 18), 0, 0, 0, 1, 1.08, 1.02), blue, 0.04));
  parts.push(tint(place(box(0.7, 0.16, 0.22), 0, 0.08, 0.62), "#F5C400"));
  parts.push(tint(place(box(0.18, 0.28, 0.12), 0, 0.28, 0.68), "#F5C400"));
  parts.push(tint(place(sph(0.22, 12, 10), 0, -0.22, 0.55), "#E8B898"));
  parts.push(tint(place(box(0.16, 0.18, 0.28), -0.68, 0.08, 0.05), blue));
  parts.push(tint(place(box(0.16, 0.18, 0.28), 0.68, 0.08, 0.05), blue));
  parts.push(tint(place(cyl(0.12, 0.16, 0.16, 8), 0, 0.78, -0.02), "#F4F4F4"));
  return {
    parts,
    eyes: [
      { position: [-0.18, 0.08, 0.68], scale: [0.12, 0.08, 0.05], iris: "#1E1A18" },
      { position: [0.18, 0.08, 0.68], scale: [0.12, 0.08, 0.05], iris: "#1E1A18" },
    ],
  };
}

function ness(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const skin = "#F0C4A0";
  parts.push(tint(place(sph(0.66, 24, 18), 0, -0.04, 0, 1, 1, 0.96), skin, 0.03));
  parts.push(tint(place(sph(0.14, 10, 8), 0, -0.04, 0.64), skin));
  parts.push(tint(place(sph(0.22, 12, 10), -0.52, 0.08, 0.18, 0.7, 0.9, 0.55), "#1E1A18"));
  parts.push(tint(place(sph(0.22, 12, 10), 0.52, 0.08, 0.18, 0.7, 0.9, 0.55), "#1E1A18"));
  const cap = new THREE.SphereGeometry(0.7, 22, 14, 0, Math.PI * 2, 0, Math.PI * 0.5);
  parts.push(tint(place(cap, 0, 0.18, -0.04, 1.08, 0.85, 1.02), "#E52521"));
  parts.push(tint(place(disc(0.42, 16), 0, 0.2, 0.42, 1, 1, 1, -0.55), "#E52521"));
  parts.push(tint(place(sph(0.08, 8, 8), 0, 0.42, 0.55), "#F6D44A"));
  return {
    parts,
    eyes: [
      { position: [-0.18, 0.08, 0.58], scale: [0.14, 0.16, 0.08], iris: "#1E1A18" },
      { position: [0.18, 0.08, 0.58], scale: [0.14, 0.16, 0.08], iris: "#1E1A18" },
    ],
  };
}

function pikmin(): Kit {
  const parts: THREE.BufferGeometry[] = [];
  const red = "#E52521";
  parts.push(tint(place(sph(0.62, 22, 16), 0, -0.18, 0, 0.95, 1.05, 0.95), red, 0.04));
  parts.push(tint(place(cyl(0.05, 0.05, 0.72, 8), 0, 0.52, 0), "#3D8B3D"));
  parts.push(tint(place(box(0.32, 0.04, 0.18), 0, 0.88, 0.04), "#5CB85C"));
  parts.push(tint(place(box(0.18, 0.04, 0.28), 0, 0.88, 0.04), "#5CB85C"));
  parts.push(tint(place(sph(0.08, 8, 8), 0, -0.28, 0.55), "#F4F4F4"));
  return {
    parts,
    eyes: [
      { position: [-0.18, 0.02, 0.52], scale: [0.12, 0.16, 0.08], iris: "#1E1A18" },
      { position: [0.18, 0.02, 0.52], scale: [0.12, 0.16, 0.08], iris: "#1E1A18" },
    ],
  };
}

const BUILDERS: Record<string, () => Kit> = {
  mario,
  luigi,
  wario,
  peach,
  bowser,
  toad,
  dk,
  link,
  zelda,
  ganondorf,
  samus,
  yoshi,
  kirby,
  fox,
  pikachu,
  jigglypuff,
  falcon,
  ness,
  pikmin,
};

export function buildHead(id: string): BuiltHead {
  const kit = (BUILDERS[id] ?? mario)();
  return { geometry: mergeParts(kit.parts), eyes: kit.eyes };
}
