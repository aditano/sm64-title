import { useEffect, useRef } from "react";
import { N64_H, N64_W, gameTime } from "@/lib/game-clock";
import { drawTitleHud, hudBitmapSize } from "@/lib/hud-draw";
import { useFaceStore } from "@/lib/face-store";

function isCoarse() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(hover: none)").matches;
}

function reduceMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HudLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const canvas = ref.current;
      const ctx = canvas?.getContext("2d");
      const s = useFaceStore.getState();
      if (canvas && ctx) {
        const frame = canvas.closest("[data-n64-frame]");
        const cssW = frame instanceof HTMLElement ? frame.clientWidth : canvas.clientWidth;
        const cssH = frame instanceof HTMLElement ? frame.clientHeight : canvas.clientHeight;
        const bitmap = hudBitmapSize(cssW, cssH);
        if (canvas.width !== bitmap.w || canvas.height !== bitmap.h) {
          canvas.width = bitmap.w;
          canvas.height = bitmap.h;
        }
        const coarse = isCoarse();
        drawTitleHud(
          ctx,
          gameTime.frame30,
          gameTime.t,
          {
            on: s.gloveOn,
            x: s.gloveX,
            y: s.gloveY,
            grabbing: s.grabbing,
          },
          {
            boardY: bitmap.boardY,
            touchHint: coarse && !s.gloveOn,
            reduceMotion: reduceMotion(),
          },
        );
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const coarse = isCoarse();
    const place = (e: PointerEvent) => {
      if (coarse && e.type === "pointermove" && e.buttons === 0) return;
      const frame = document.querySelector("[data-n64-frame]");
      if (!(frame instanceof HTMLElement)) return;
      const r = frame.getBoundingClientRect();
      const inside =
        e.clientX >= r.left && e.clientX < r.right && e.clientY >= r.top && e.clientY < r.bottom;
      if (!inside) {
        useFaceStore.getState().setGlove(false);
        return;
      }
      const bitmap = hudBitmapSize(r.width, r.height);
      const x = ((e.clientX - r.left) / r.width) * bitmap.w;
      const y = ((e.clientY - r.top) / r.height) * bitmap.h - bitmap.boardY;
      useFaceStore.getState().setGlove(true, x, y);
    };
    const hide = () => useFaceStore.getState().setGlove(false);
    const release = (e: PointerEvent) => {
      if (coarse) hide();
      else place(e);
    };
    window.addEventListener("pointermove", place);
    window.addEventListener("pointerdown", place);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    if (!coarse) {
      window.addEventListener("blur", hide);
      document.documentElement.addEventListener("mouseleave", hide);
    }
    return () => {
      window.removeEventListener("pointermove", place);
      window.removeEventListener("pointerdown", place);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
      if (!coarse) {
        window.removeEventListener("blur", hide);
        document.documentElement.removeEventListener("mouseleave", hide);
      }
    };
  }, []);

  return (
    <canvas
      ref={ref}
      width={N64_W}
      height={N64_H}
      className="n64-hud"
      style={{ imageRendering: "pixelated" }}
      aria-hidden
    />
  );
}
