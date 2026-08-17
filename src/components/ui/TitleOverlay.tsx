import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { SignedIn, SignedOut, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { ROSTER, getCharacter } from "@/lib/characters";
import { useFaceStore } from "@/lib/face-store";

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-8 w-8 animate-pulse rounded-full bg-cream/20" />;
  }
  return user ? (
    <SignedIn>
      <UserButton />
    </SignedIn>
  ) : (
    <SignedOut>
      <Link
        to="/login"
        className="rounded-full border-2 border-gold/80 bg-wood-deep/80 px-2.5 py-1 font-display text-[0.65rem] tracking-wider text-gold sm:px-3 sm:text-xs"
      >
        Sign in
      </Link>
    </SignedOut>
  );
}

function Portrait({ id, swatch, accent, skin }: { id: string; swatch: string; accent: string; skin: string }) {
  return (
    <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden>
      <circle cx="32" cy="32" r="32" fill={swatch} />
      <circle cx="32" cy="38" r="18" fill={skin} />
      <ellipse cx="32" cy="22" rx="20" ry="10" fill={swatch} />
      <circle cx="32" cy="20" r="5" fill={accent} />
      <circle cx="26" cy="36" r="3" fill="#1a1410" />
      <circle cx="38" cy="36" r="3" fill="#1a1410" />
      {id === "samus" ? (
        <>
          <ellipse cx="32" cy="36" rx="16" ry="8" fill="#0A160E" />
          <ellipse cx="32" cy="36" rx="13" ry="5.5" fill="#24C84A" />
          <rect x="18" y="33" width="28" height="3" rx="1" fill="#8CFF90" />
        </>
      ) : id === "mario" || id === "luigi" || id === "wario" ? (
        <path d="M22 42c6 6 14 6 20 0" fill="#3a2418" />
      ) : null}
    </svg>
  );
}

export function TitleOverlay() {
  const characterId = useFaceStore((s) => s.characterId);
  const setCharacter = useFaceStore((s) => s.setCharacter);
  const requestReset = useFaceStore((s) => s.requestReset);
  const holdStretch = useFaceStore((s) => s.holdStretch);
  const setHoldStretch = useFaceStore((s) => s.setHoldStretch);
  const quote = useFaceStore((s) => s.quote);
  const setQuote = useFaceStore((s) => s.setQuote);
  const character = getCharacter(characterId);
  const index = ROSTER.findIndex((c) => c.id === characterId);

  const step = (dir: number) => {
    const next = ROSTER[(index + dir + ROSTER.length) % ROSTER.length]!;
    setCharacter(next.id);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") requestReset();
      if (e.key === "Shift") setHoldStretch(true);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
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
  }, [characterId, requestReset, setHoldStretch]);

  useEffect(() => {
    const t = window.setTimeout(() => setQuote(character.quote), 1100);
    const hide = window.setTimeout(() => setQuote(null), 3000);
    return () => {
      window.clearTimeout(t);
      window.clearTimeout(hide);
    };
  }, [character, setQuote]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <header className="flex items-start justify-between px-3 pt-[max(0.5rem,env(safe-area-inset-top))] sm:px-6 sm:pt-4">
        <div className="logo-3d">
          <div className="text-[0.7rem] text-roof sm:text-[clamp(1.1rem,3vw,1.85rem)]">Super</div>
          <div className="flex items-end gap-1.5 sm:gap-2">
            <span className="text-[1.55rem] leading-none text-roof sm:text-[clamp(2.2rem,6.5vw,4.6rem)]">
              Mario
            </span>
            <span className="pb-0.5 text-[1.25rem] leading-none text-gold sm:text-[clamp(1.8rem,5.2vw,3.8rem)]">
              64
            </span>
          </div>
        </div>
        {import.meta.env.VITE_PAGES === "1" ? null : (
          <div className="pointer-events-auto pt-0.5">
            <AuthSlot />
          </div>
        )}
      </header>

      <div className="hidden flex-1 items-start justify-end pr-16 pt-16 sm:flex">
        {quote ? (
          <div className="rounded-2xl border-2 border-wood-deep bg-cream px-4 py-2 font-display text-2xl text-ink shadow-[0_4px_0_#3d2110]">
            {quote}
          </div>
        ) : null}
      </div>
      <div className="flex-1 sm:hidden" />

      <div className="pointer-events-auto px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-3 sm:pb-3">
        <div className="mx-auto w-[min(100%,72rem)] rounded-[18px] border-[3px] border-gold-deep bg-wood-deep/92 p-1.5 shadow-[0_6px_0_#2a1408] sm:rounded-[22px] sm:border-4 sm:p-3">
          <div className="mb-1.5 flex items-center gap-2 px-0.5 sm:mb-2">
            <button
              type="button"
              aria-label="Previous character"
              onClick={() => step(-1)}
              className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-gold/60 bg-plaque font-display text-xl text-cream sm:hidden"
            >
              ‹
            </button>
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-lg leading-none tracking-wide text-gold sm:text-2xl">
                {character.name}
              </p>
              <p className="hidden truncate text-sm text-cream/70 sm:block">{character.series}</p>
            </div>
            <button
              type="button"
              onClick={() => setHoldStretch(!holdStretch)}
              className={`h-11 shrink-0 rounded-xl border-2 px-3 font-display text-sm tracking-wide shadow-[0_3px_0_#2a1408] sm:h-auto sm:py-2 ${
                holdStretch ? "border-gold bg-gold text-ink" : "border-gold/60 bg-plaque text-cream"
              }`}
            >
              Hold
            </button>
            <button
              type="button"
              onClick={requestReset}
              className="h-11 shrink-0 rounded-xl border-2 border-gold/60 bg-plaque px-3 font-display text-sm tracking-wide text-cream shadow-[0_3px_0_#2a1408] sm:h-auto sm:py-2"
            >
              Reset
            </button>
            <button
              type="button"
              aria-label="Next character"
              onClick={() => step(1)}
              className="grid size-11 shrink-0 place-items-center rounded-xl border-2 border-gold/60 bg-plaque font-display text-xl text-cream sm:hidden"
            >
              ›
            </button>
          </div>
          <div className="dock-scroll flex gap-1.5 overflow-x-auto overscroll-x-contain pb-0.5 sm:gap-2">
            {ROSTER.map((c) => {
              const on = c.id === characterId;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCharacter(c.id)}
                  className={`flex w-12 shrink-0 flex-col items-center gap-0.5 rounded-[12px] p-1 sm:w-20 sm:gap-1 sm:rounded-[14px] sm:p-1.5 ${
                    on ? "bg-gold text-ink" : "bg-wood/80 text-cream"
                  }`}
                >
                  <span
                    className={`block size-10 overflow-hidden rounded-full border-2 sm:size-14 ${
                      on ? "border-ink" : "border-cream/30"
                    }`}
                  >
                    <Portrait id={c.id} swatch={c.swatch} accent={c.accent} skin={c.skin} />
                  </span>
                  <span className="hidden w-full truncate text-center font-display text-xs tracking-wide sm:block">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
