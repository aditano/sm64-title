export type FeatureId = "cap" | "earL" | "earR" | "nose" | "stacheL" | "stacheR" | "mouth";

export const FEATURE_IDS: readonly FeatureId[];

export const MARIO_JOINTS: {
  id: FeatureId;
  position: [number, number, number];
  radius: number;
}[];

export function emptyVecs(): Record<FeatureId, [number, number, number]>;

export function featureWeight(dist: number, radius: number): number;

export function headWidth(
  joints?: { id: FeatureId; position: [number, number, number]; radius: number }[],
): number;

export function deformInto(
  rest: ArrayLike<number>,
  out: Float32Array,
  joints: { id: string; position: [number, number, number]; radius: number }[],
  offsets: Record<string, [number, number, number] | undefined>,
): Float32Array;

export function deformPositions(
  rest: ArrayLike<number>,
  joints: { id: string; position: [number, number, number]; radius: number }[],
  offsets: Record<string, [number, number, number] | undefined>,
): Float32Array;

export function springStep(
  offsets: Record<string, [number, number, number]>,
  velocities: Record<string, [number, number, number]>,
  opts?: { hold?: boolean; grabbingId?: string | null },
): Record<string, [number, number, number]>;

export function pupilOffset(
  pointerX: number,
  pointerY: number,
  width?: number,
  height?: number,
): [number, number];

export const GLOVE_SIZE: number;

export function glovePose(grabbing: boolean): {
  kind: "open" | "pinch";
  hot: [number, number];
  size: number;
};

export function gloveMask(grabbing: boolean): Uint8Array;
