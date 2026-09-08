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

function drawGlyph(ctx: CanvasRenderingContext2D, ch: string, x: number, y: number) {
  const rows = HUD[ch];
  if (!rows) return 0;
  const px = 2;
  const w = rows[0]!.length;
  const h = rows.length;
  ctx.fillStyle = "#2a0c08";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillRect(x + i * px + 3, y + j * px + 3, px, px);
    }
  }
  ctx.fillStyle = "#c41810";
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillRect(x + i * px - 2, y + j * px - 2, px + 4, px + 4);
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
  return w * px + 4;
}

function drawHudWord(ctx: CanvasRenderingContext2D, word: string, x: number, cy: number) {
  const h = 16;
  let cx = x;
  const y = Math.round(N64_H - cy - h);
  for (const ch of word) cx += drawGlyph(ctx, ch, cx, y);
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

const GLOVE_OPEN = [
  "....1111........",
  "...111111.......",
  "..11.11111......",
  ".11...11111.....",
  "111...111111....",
  "11....1111111...",
  "11....1111111...",
  "111...11111111..",
  ".111.1111111111.",
  "..1111111111111.",
  "...11111111111..",
  "....111111111...",
  ".....1111111....",
  "......11111.....",
];

const GLOVE_PINCH = [
  "................",
  "......1111......",
  ".....111111.....",
  "....11111111....",
  "...111111111....",
  "..11111111111...",
  ".111111111111...",
  "1111111111111...",
  ".111111111111...",
  "..11111111111...",
  "...111111111....",
  "....1111111.....",
  ".....11111......",
  "......111.......",
];

function drawGloveBitmap(ctx: CanvasRenderingContext2D, x: number, y: number, rows: string[]) {
  const ox = Math.round(x) - 8;
  const oy = Math.round(y) - 8;
  for (let j = 0; j < rows.length; j++) {
    for (let i = 0; i < rows[j]!.length; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillStyle = "#3a2418";
      ctx.fillRect(ox + i - 1, oy + j, 3, 3);
    }
  }
  for (let j = 0; j < rows.length; j++) {
    for (let i = 0; i < rows[j]!.length; i++) {
      if (rows[j]![i] !== "1") continue;
      ctx.fillStyle = "#c8c0b0";
      ctx.fillRect(ox + i, oy + j + 1, 1, 1);
      ctx.fillStyle = "#f6f1e6";
      ctx.fillRect(ox + i, oy + j, 1, 1);
    }
  }
}

export function drawGlove(ctx: CanvasRenderingContext2D, x: number, y: number, grabbing: boolean) {
  drawGloveBitmap(ctx, x, y, grabbing ? GLOVE_PINCH : GLOVE_OPEN);
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
