import { useEffect } from "react";
import { useFaceStore } from "@/lib/face-store";

/**
 * Faithful recreation of the US/JP Super Mario 64 "Press Start" title screen HUD.
 * The original only showed Mario's face — no character dock, Hold/Reset buttons, or quotes.
 */
export function TitleOverlay() {
  const requestReset = useFaceStore((s) => s.requestReset);
  const setHoldStretch = useFaceStore((s) => s.setHoldStretch);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") requestReset();
      if (e.key === "Shift") setHoldStretch(true);
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
  }, [requestReset, setHoldStretch]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <header className="px-4 pt-[max(0.35rem,env(safe-area-inset-top))] sm:px-6 sm:pt-3">
        <div className="sm64-logo" aria-label="Super Mario 64">
          <div className="sm64-logo-super">SUPER</div>
          <div className="sm64-logo-row">
            <span className="sm64-logo-mario">MARIO</span>
            <span className="sm64-logo-sixtyfour">
              64
              <sup className="sm64-logo-tm">TM</sup>
            </span>
          </div>
        </div>
      </header>

      <div className="flex-1" />

      <footer className="flex flex-col items-center gap-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-3 sm:pb-4">
        <p className="press-start font-display text-[1.35rem] tracking-[0.14em] sm:text-[1.75rem]">
          PRESS START
        </p>
        <p className="font-ui text-[0.55rem] tracking-wide text-white/90 sm:text-[0.65rem]">
          ©1996 Nintendo
        </p>
      </footer>
    </div>
  );
}
