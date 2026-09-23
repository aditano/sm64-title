import { useEffect } from "react";
import { useFaceStore } from "@/lib/face-store";
import { gameTime, logoAlpha, pressStartVisible } from "@/lib/game-clock";

function snapshot() {
  const s = useFaceStore.getState();
  return JSON.stringify({
    coords: "World: +x right, +y up, +z toward camera. HUD text is 320x240 with y up from the bottom. Glove x/y are pixels on that board, y down from the top. A taller frame keeps the board centered.",
    mode: "title",
    t: Number(gameTime.t.toFixed(3)),
    frame30: gameTime.frame30,
    logoAlpha: Number(logoAlpha().toFixed(3)),
    pressStart: pressStartVisible(),
    grabbing: s.grabbing,
    pinchId: s.pinchId,
    holdStretch: s.holdStretch,
    zoom: s.zoom,
    torn: s.torn,
    head: { x: 0, y: 1.42, z: 0.08, rot: s.headRot },
    glove: { on: s.gloveOn, x: s.gloveX, y: s.gloveY },
    joints: s.jointOffsets,
    grabLocal: s.grabLocal,
  });
}

export function GameBridge() {
  const requestReset = useFaceStore((s) => s.requestReset);
  const setHoldStretch = useFaceStore((s) => s.setHoldStretch);
  const cycleZoom = useFaceStore((s) => s.cycleZoom);

  useEffect(() => {
    const g = window as Window & {
      advanceTime?: (ms: number) => Promise<void> | void;
      render_game_to_text?: () => string;
    };
    g.render_game_to_text = () => snapshot();
    g.advanceTime = (ms: number) => {
      gameTime.advance(ms);
      return new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") requestReset();
      if (e.key === "Shift") setHoldStretch(true);
      if (e.key === "b" || e.key === "B") cycleZoom();
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      }
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.key === "Shift") setHoldStretch(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("keyup", onUp);
    };
  }, [cycleZoom, requestReset, setHoldStretch]);

  return null;
}
