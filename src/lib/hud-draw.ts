import { N64_H, N64_W, pressStartVisible } from "./game-clock";

/** Chunky SM64-like HUD glyphs — ~12px, yellow fill, thick red outline. */
const HUD: Record<string, string[]> = {
  P: [
    "1111110",
    "1100011",
    "1100011",
    "1111110",
    "1100000",
    "1100000",
    "1100000",
    "1100000",
  ],
  R: [
    "1111110",
    "1100011",
    "1100011",
    "1111110",
    "1101100",
    "1100110",
    "1100011",
    "1100001",
  ],
  E: [
    "1111111",
    "1100000",
    "1100000",
    "1111110",
    "1100000",
    "1100000",
    "1100000",
    "1111111",
  ],
  S: [
    "0111111",
    "1100000",
    "1100000",
    "0111110",
    "0000011",
    "0000011",
    "0000011",
    "1111110",
  ],
  T: [
    "1111111",
    "0011100",
    "0011100",
    "0011100",
    "0011100",
    "0011100",
    "0011100",
    "0011100",
  ],
  A: [
    "0011100",
    "0111110",
    "1100011",
    "1100011",
    "1111111",
    "1100011",
    "1100011",
    "1100011",
  ],
};

/** SM64 `print_text` advances 12px and draws a 16×16 glyph. */
const GLYPH_ADVANCE = 12;

function drawGlyph(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number) {
  const rows = HUD[ch];
  if (!rows) return;
  const px = 2;
  const w = rows[0]!.length;
  const h = rows.length;
  ctx.fillStyle = "#2a0c08";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillRect(x + i * px + 1, y + j * px + 1, px, px);
    }
  }
  ctx.fillStyle = "#c41810";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillRect(x + i * px - 1, y + j * px - 1, px + 2, px + 2);
    }
  }
  ctx.fillStyle = "#ffe14a";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillRect(x + i * px, y + j * px, px, px);
    }
  }
  ctx.fillStyle = "#fff8a0";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillRect(x + i * px, y + j * px, px, 1);
    }
  }
}

/** `centerX` / `textY` match `print_text_centered` (y grows up from the bottom). */
function drawHudWord(ctx: CanvasRenderingContext2D, word: string, centerX: number, textY: number) {
  let cx = Math.round(centerX - (word.length * GLYPH_ADVANCE) / 2);
  const y = 224 - textY;
  for (const ch of word) {
    drawGlyph(ctx, ch, cx, y);
    cx += GLYPH_ADVANCE;
  }
}

const TINY: Record<string, string[]> = {
  "©": ["01110", "10001", "10111", "10100", "10001", "01110"],
  "1": ["01100", "00100", "00100", "00100", "00100", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "01110"],
  "6": ["01110", "10000", "11110", "10001", "10001", "01110"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001"],
  i: ["00100", "00000", "01100", "00100", "00100", "01110"],
  n: ["00000", "00000", "11100", "10010", "10010", "10010"],
  t: ["01000", "11100", "01000", "01000", "01010", "00100"],
  e: ["00000", "01110", "10001", "11111", "10000", "01110"],
  d: ["00001", "00001", "01111", "10001", "10001", "01111"],
  o: ["00000", "01110", "10001", "10001", "10001", "01110"],
  " ": ["00000", "00000", "00000", "00000", "00000", "00000"],
  "&": ["01000", "10100", "01000", "10101", "10010", "01101"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100"],
  M: ["10001", "11011", "10101", "10001", "10001", "10001"],
};

function drawCopyright(ctx: CanvasRenderingContext2D) {
  const text = "©1996 Nintendo";
  const gw = 6;
  const width = text.length * gw;
  let x = Math.round((N64_W - width) / 2);
  const y = N64_H - 13;
  ctx.fillStyle = "#c8b080";
  ctx.fillRect(x - 6, y - 3, width + 12, 12);
  ctx.fillStyle = "#f0e0b8";
  ctx.fillRect(x - 5, y - 2, width + 10, 10);
  for (const ch of text) {
    const rows = TINY[ch] ?? TINY[" "];
    ctx.fillStyle = "#3a2410";
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 5; i++) {
        if (rows![j]![i] !== "1") continue;
        ctx.fillRect(x + i + 1, y + j + 1, 1, 1);
      }
    }
    ctx.fillStyle = "#3a2410";
    for (let j = 0; j < 6; j++) {
      for (let i = 0; i < 5; i++) {
        if (rows![j]![i] !== "1") continue;
        ctx.fillRect(x + i, y + j, 1, 1);
      }
    }
    x += gw;
  }
}

const GLOVE_SIZE = 32;
/** Fingertip / knuckle — the pixel that tracks the pointer. */
const OPEN_HOT: [number, number] = [9, 2];
const FIST_HOT: [number, number] = [9, 5];

function roundFinger(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 2);
  ctx.fill();
}

function paintGlove(closed: boolean) {
  const c = document.createElement("canvas");
  c.width = GLOVE_SIZE;
  c.height = GLOVE_SIZE;
  const g = c.getContext("2d");
  if (!g) return c;
  g.fillStyle = "#ffffff";
  if (!closed) {
    roundFinger(g, 1, 9, 4, 11);
    roundFinger(g, 8, 2, 5, 15);
    roundFinger(g, 16, 8, 4, 11);
    roundFinger(g, 23, 11, 4, 8);
    g.beginPath();
    g.ellipse(15, 23, 11, 7, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.roundRect(7, 24, 16, 7, 2);
    g.fill();
    g.beginPath();
    g.ellipse(4, 20, 4.5, 4.5, 0, 0, Math.PI * 2);
    g.fill();
  } else {
    g.beginPath();
    g.ellipse(16, 19, 10, 9, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.ellipse(6, 19, 5, 5, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.roundRect(9, 22, 14, 8, 2);
    g.fill();
    g.beginPath();
    g.ellipse(10, 8, 3.2, 3.2, 0, 0, Math.PI * 2);
    g.fill();
  }
  const img = g.getImageData(0, 0, GLOVE_SIZE, GLOVE_SIZE);
  const src = new Uint8ClampedArray(img.data);
  const out = img.data;
  for (let y = 0; y < GLOVE_SIZE; y++) {
    for (let x = 0; x < GLOVE_SIZE; x++) {
      const i = (y * GLOVE_SIZE + x) * 4;
      if (src[i + 3]! > 128) {
        const cuff = y > 23;
        out[i] = cuff ? 214 : 247;
        out[i + 1] = cuff ? 208 : 243;
        out[i + 2] = cuff ? 196 : 234;
        out[i + 3] = 255;
        continue;
      }
      let edge = false;
      for (let dy = -1; dy <= 1 && !edge; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= GLOVE_SIZE || ny >= GLOVE_SIZE) continue;
          if (src[(ny * GLOVE_SIZE + nx) * 4 + 3]! > 128) edge = true;
        }
      }
      if (edge) {
        out[i] = 42;
        out[i + 1] = 24;
        out[i + 2] = 16;
        out[i + 3] = 255;
      }
    }
  }
  g.putImageData(img, 0, 0);
  return c;
}

let openSprite: HTMLCanvasElement | null = null;
let fistSprite: HTMLCanvasElement | null = null;

function gloveSprite(closed: boolean) {
  if (closed) {
    fistSprite ??= paintGlove(true);
    return fistSprite;
  }
  openSprite ??= paintGlove(false);
  return openSprite;
}

export function drawGlove(ctx: CanvasRenderingContext2D, x: number, y: number, grabbing: boolean) {
  const hot = grabbing ? FIST_HOT : OPEN_HOT;
  ctx.drawImage(gloveSprite(grabbing), Math.round(x) - hot[0], Math.round(y) - hot[1]);
}

export function drawTitleHud(
  ctx: CanvasRenderingContext2D,
  frame30: number,
  _t: number,
  glove?: { on: boolean; x: number; y: number; grabbing: boolean },
) {
  ctx.clearRect(0, 0, N64_W, N64_H);

  if (pressStartVisible(frame30)) {
    drawHudWord(ctx, "PRESS", 60, 38);
    drawHudWord(ctx, "START", 60, 20);
  }

  drawCopyright(ctx);

  if (glove?.on) drawGlove(ctx, glove.x, glove.y, glove.grabbing);
}
