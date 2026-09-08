import { create } from "zustand";

export type PinchId = "cap" | "earL" | "earR" | "nose" | "stacheL" | "stacheR" | "mouth";

export const useFaceStore = create<{
  resetToken: number;
  requestReset: () => void;
  holdStretch: boolean;
  setHoldStretch: (v: boolean) => void;
  grabbing: boolean;
  setGrabbing: (v: boolean) => void;
  pinchId: PinchId | null;
  setPinchId: (id: PinchId | null) => void;
  zoom: 0 | 1 | 2;
  cycleZoom: () => void;
  torn: boolean;
  setTorn: (v: boolean) => void;
  grabLocal: [number, number, number] | null;
  setGrabLocal: (p: [number, number, number] | null) => void;
  headRot: [number, number, number];
  setHeadRot: (r: [number, number, number]) => void;
  jointOffsets: Record<PinchId, [number, number, number]>;
  setJointOffsets: (o: Record<PinchId, [number, number, number]>) => void;
  gloveOn: boolean;
  gloveX: number;
  gloveY: number;
  setGlove: (on: boolean, x?: number, y?: number) => void;
}>((set) => ({
  resetToken: 0,
  requestReset: () =>
    set({
      resetToken: Date.now(),
      torn: false,
      grabbing: false,
      pinchId: null,
      grabLocal: null,
    }),
  holdStretch: false,
  setHoldStretch: (v) => set({ holdStretch: v }),
  grabbing: false,
  setGrabbing: (v) => set({ grabbing: v }),
  pinchId: null,
  setPinchId: (id) => set({ pinchId: id }),
  zoom: 0,
  cycleZoom: () => set((s) => ({ zoom: ((s.zoom + 1) % 3) as 0 | 1 | 2 })),
  torn: false,
  setTorn: (v) => set({ torn: v }),
  grabLocal: null,
  setGrabLocal: (p) => set({ grabLocal: p }),
  headRot: [0, 0, 0],
  setHeadRot: (r) => set({ headRot: r }),
  jointOffsets: {
    cap: [0, 0, 0],
    earL: [0, 0, 0],
    earR: [0, 0, 0],
    nose: [0, 0, 0],
    stacheL: [0, 0, 0],
    stacheR: [0, 0, 0],
    mouth: [0, 0, 0],
  },
  setJointOffsets: (o) => set({ jointOffsets: o }),
  gloveOn: false,
  gloveX: 160,
  gloveY: 120,
  setGlove: (on, x, y) =>
    set((s) => ({
      gloveOn: on,
      gloveX: x ?? s.gloveX,
      gloveY: y ?? s.gloveY,
    })),
}));
