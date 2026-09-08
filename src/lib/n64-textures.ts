import * as THREE from "three";

function canvas(w: number, h = w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d");
  if (!ctx) throw new Error("2d context");
  ctx.imageSmoothingEnabled = false;
  return { c, ctx };
}

function hash(x: number, y: number, s = 1) {
  const n = Math.sin(x * 127.1 + y * 311.7 + s * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function tex(c: HTMLCanvasElement, repeatX = 1, repeatY = 1, filter: THREE.MagnificationTextureFilter = THREE.LinearFilter) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = THREE.RepeatWrapping;
  t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeatX, repeatY);
  t.magFilter = filter;
  t.minFilter = THREE.NearestFilter;
  t.generateMipmaps = false;
  t.needsUpdate = true;
  return t;
}

function rgb(ctx: CanvasRenderingContext2D, r: number, g: number, b: number) {
  ctx.fillStyle = `rgb(${r | 0},${g | 0},${b | 0})`;
}

export function makeGrass() {
  const { c, ctx } = canvas(64);
  for (let y = 0; y < 64; y++) {
    for (let x = 0; x < 64; x++) {
      const n = hash(x, y);
      const n2 = hash(x, y, 2);
      rgb(ctx, 52 + n * 40, 150 + n * 50, 40 + n2 * 28);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return tex(c, 18, 18);
}

export function makeBrick() {
  const { c, ctx } = canvas(64);
  rgb(ctx, 196, 176, 148);
  ctx.fillRect(0, 0, 64, 64);
  const bricks: Array<[number, number, number, number]> = [
    [1, 1, 30, 14],
    [33, 1, 30, 14],
    [1, 17, 20, 14],
    [23, 17, 40, 14],
    [1, 33, 30, 14],
    [33, 33, 30, 14],
    [1, 49, 20, 14],
    [23, 49, 40, 14],
  ];
  for (const [x, y, w, h] of bricks) {
    const v = hash(x, y, 3);
    rgb(ctx, 228 + v * 18, 214 + v * 16, 188 + v * 14);
    ctx.fillRect(x, y, w, h);
    rgb(ctx, 168, 148, 120);
    ctx.fillRect(x, y + h - 1, w, 1);
    ctx.fillRect(x + w - 1, y, 1, h);
  }
  return tex(c, 2.4, 2.2);
}

export function makeRoof() {
  const { c, ctx } = canvas(32);
  rgb(ctx, 176, 24, 24);
  ctx.fillRect(0, 0, 32, 32);
  for (let row = 0; row < 8; row++) {
    const y = row * 4;
    const odd = row % 2;
    for (let col = -1; col < 9; col++) {
      const x = col * 4 + (odd ? 2 : 0);
      rgb(ctx, 196 + hash(col, row) * 24, 28 + hash(col, row, 2) * 16, 28);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 4, y);
      ctx.lineTo(x + 2, y + 4);
      ctx.closePath();
      ctx.fill();
    }
  }
  return tex(c, 2, 2);
}

export function makeDirt() {
  const { c, ctx } = canvas(32);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const n = hash(x, y, 4);
      rgb(ctx, 168 + n * 36, 132 + n * 24, 72 + n * 16);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return tex(c, 4, 8);
}

export function makeStone() {
  const { c, ctx } = canvas(32);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const n = hash(x, y, 5);
      rgb(ctx, 148 + n * 28, 144 + n * 24, 138 + n * 22);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  return tex(c, 1.4, 1.4);
}

export function makeWater() {
  const { c, ctx } = canvas(32);
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const n = 0.5 + 0.5 * Math.sin(x * 0.4 + y * 0.25);
      rgb(ctx, 40 + n * 30, 110 + n * 40, 180 + n * 40);
      ctx.fillRect(x, y, 1, 1);
    }
  }
  const t = tex(c, 8, 8);
  return t;
}

export function makeLeaves() {
  const { c, ctx } = canvas(32);
  rgb(ctx, 24, 110, 32);
  ctx.fillRect(0, 0, 32, 32);
  for (let i = 0; i < 80; i++) {
    const x = (hash(i, 1, 8) * 32) | 0;
    const y = (hash(i, 2, 9) * 32) | 0;
    const n = hash(i, 3, 10);
    rgb(ctx, 32 + n * 40, 130 + n * 70, 36 + n * 30);
    ctx.beginPath();
    ctx.ellipse(x, y, 3 + n * 3, 2 + n * 2, n * 3, 0, Math.PI * 2);
    ctx.fill();
  }
  return tex(c, 1, 1);
}

export function makeSky() {
  const { c, ctx } = canvas(128, 64);
  const g = ctx.createLinearGradient(0, 0, 0, 64);
  g.addColorStop(0, "#7ec8f4");
  g.addColorStop(0.55, "#62b4e8");
  g.addColorStop(1, "#8fd0f0");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 64);
  ctx.fillStyle = "#f4f7ff";
  const clouds = [
    [18, 14, 16, 7],
    [40, 10, 22, 8],
    [88, 16, 18, 7],
    [110, 12, 14, 6],
    [60, 22, 12, 5],
  ];
  for (const [x, y, w, h] of clouds) {
    ctx.beginPath();
    ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + w * 0.45, y + 2, w * 0.7, h * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  const small = canvas(64, 32);
  small.ctx.imageSmoothingEnabled = false;
  small.ctx.drawImage(c, 0, 0, 64, 32);
  const t = tex(small.c, 1, 1, THREE.NearestFilter);
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

/** N64-simple Peach stained glass — flat colors, thick leading. */
export function makeStainedGlass() {
  const { c, ctx } = canvas(64);
  rgb(ctx, 72, 56, 40);
  ctx.fillRect(0, 0, 64, 64);
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.fillStyle = "#6eb8e0";
  ctx.fill();

  ctx.fillStyle = "#f0d24a";
  ctx.beginPath();
  ctx.ellipse(32, 22, 14, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f2c49a";
  ctx.beginPath();
  ctx.ellipse(32, 26, 10, 11, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f4a8c8";
  ctx.beginPath();
  ctx.ellipse(32, 46, 12, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f0d24a";
  ctx.fillRect(22, 8, 20, 6);
  ctx.fillStyle = "#e8c43c";
  ctx.fillRect(26, 4, 12, 6);
  ctx.fillStyle = "#2a1810";
  ctx.fillRect(26, 24, 3, 3);
  ctx.fillRect(35, 24, 3, 3);
  ctx.fillStyle = "#d07090";
  ctx.fillRect(30, 30, 4, 2);

  ctx.strokeStyle = "#1a1008";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(32, 32, 30, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(32, 2);
  ctx.lineTo(32, 62);
  ctx.moveTo(2, 32);
  ctx.lineTo(62, 32);
  ctx.stroke();

  const t = tex(c, 1, 1, THREE.NearestFilter);
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export function makeStar(color = "#fff4a8") {
  const { c, ctx } = canvas(16);
  ctx.clearRect(0, 0, 16, 16);
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(8, 0);
  ctx.lineTo(9.5, 6);
  ctx.lineTo(16, 8);
  ctx.lineTo(9.5, 10);
  ctx.lineTo(8, 16);
  ctx.lineTo(6.5, 10);
  ctx.lineTo(0, 8);
  ctx.lineTo(6.5, 6);
  ctx.closePath();
  ctx.fill();
  const t = tex(c, 1, 1, THREE.NearestFilter);
  t.wrapS = THREE.ClampToEdgeWrapping;
  t.wrapT = THREE.ClampToEdgeWrapping;
  return t;
}

export type WorldTextures = {
  grass: THREE.CanvasTexture;
  brick: THREE.CanvasTexture;
  roof: THREE.CanvasTexture;
  dirt: THREE.CanvasTexture;
  stone: THREE.CanvasTexture;
  water: THREE.CanvasTexture;
  leaves: THREE.CanvasTexture;
  sky: THREE.CanvasTexture;
  glass: THREE.CanvasTexture;
};

export function makeWorldTextures(): WorldTextures {
  return {
    grass: makeGrass(),
    brick: makeBrick(),
    roof: makeRoof(),
    dirt: makeDirt(),
    stone: makeStone(),
    water: makeWater(),
    leaves: makeLeaves(),
    sky: makeSky(),
    glass: makeStainedGlass(),
  };
}

export function disposeWorldTextures(t: WorldTextures) {
  for (const v of Object.values(t)) v.dispose();
}
