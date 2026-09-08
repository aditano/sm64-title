import { GameBridge } from "@/lib/game-bridge";
import { HudLayer } from "@/components/scene/HudLayer";

export function TitleOverlay() {
  return (
    <>
      <HudLayer />
      <GameBridge />
    </>
  );
}
