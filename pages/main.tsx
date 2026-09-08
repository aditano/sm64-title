import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TitleScene } from "@/components/scene/TitleScene";
import { TitleOverlay } from "@/components/ui/TitleOverlay";
import { N64Frame } from "@/components/N64Frame";
import "@/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="relative h-dvh w-full overflow-hidden overscroll-none bg-black touch-none">
      <N64Frame>
        {(dpr) => (
          <>
            <TitleScene dpr={dpr} />
            <TitleOverlay />
          </>
        )}
      </N64Frame>
    </main>
  </StrictMode>,
);
