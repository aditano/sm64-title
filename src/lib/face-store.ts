import { create } from "zustand";

export const useFaceStore = create<{
  characterId: string;
  setCharacter: (id: string) => void;
  resetToken: number;
  requestReset: () => void;
  holdStretch: boolean;
  setHoldStretch: (v: boolean) => void;
  grabbing: boolean;
  setGrabbing: (v: boolean) => void;
  quote: string | null;
  setQuote: (q: string | null) => void;
}>((set) => ({
  characterId: "mario",
  setCharacter: (id) => set({ characterId: id, quote: null }),
  resetToken: 0,
  requestReset: () => set((s) => ({ resetToken: s.resetToken + 1 })),
  holdStretch: false,
  setHoldStretch: (v) => set({ holdStretch: v }),
  grabbing: false,
  setGrabbing: (v) => set({ grabbing: v }),
  quote: null,
  setQuote: (q) => set({ quote: q }),
}));
