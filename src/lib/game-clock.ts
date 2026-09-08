/** Shared title-screen clock. SM64 HUD blinks on a 30 Hz frame counter. */

export const N64_W = 320;
export const N64_H = 240;

export const gameTime = {
  t: 0,
  frame30: 0,
  lastDt: 0,
  manual: false,
  pending: 0,
  tick(realDt: number) {
    const dt = this.manual ? this.pending : Math.min(realDt, 0.05);
    this.pending = 0;
    this.lastDt = dt;
    this.t += dt;
    this.frame30 = Math.floor(this.t * 30);
    return dt;
  },
  advance(ms: number) {
    this.manual = true;
    this.pending += Math.max(0, ms) / 1000;
  },
};

/** PRESS START is visible when (gGlobalTimer & 0x1F) < 20. */
export function pressStartVisible(frame30 = gameTime.frame30) {
  return (frame30 & 0x1f) < 20;
}

/** Face first, then logo. Manual: "Mario's face will be displayed, followed by the title logo." */
export function logoAlpha(t = gameTime.t) {
  const start = 1.35;
  const fade = 0.35;
  if (t < start) return 0;
  return Math.min(1, (t - start) / fade);
}
