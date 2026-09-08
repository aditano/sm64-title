import { useEffect, useRef } from "react";
import { N64_H, N64_W, gameTime } from "@/lib/game-clock";
import { drawTitleHud } from "@/lib/hud-draw";
import { useFaceStore } from "@/lib/face-store";

function isCoarse() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

export function HudLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const ctx = ref.current?.getContext("2d");
      const s = useFaceStore.getState();
      if (ctx) {
        drawTitleHud(ctx, gameTime.frame30, gameTime.t, {
          on: s.gloveOn && !isCoarse(),
          x: s.gloveX,
          y: s.gloveY,
          grabbing: s.grabbing,
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (isCoarse()) return;
    const onMove = (e: PointerEvent) => {
      const frame = document.querySelector("[data-n64-frame]");
      if (!(frame instanceof HTMLElement)) return;
      const r = frame.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) return;
      const x = ((e.clientX - r.left) / r.width) * N64_W;
      const y = ((e.clientY - r.top) / r.height) * N64_H;
      useFaceStore.getState().setGlove(true, x, y);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <canvas
      ref={ref}
      width={N64_W}
      height={N64_H}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    />
  );
}
