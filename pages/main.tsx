import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { TitleScene } from "@/components/scene/TitleScene";
import { TitleOverlay } from "@/components/ui/TitleOverlay";
import "@/styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <main className="relative h-dvh w-full overflow-hidden overscroll-none bg-sky touch-none">
      <TitleScene />
      <TitleOverlay />
    </main>
  </StrictMode>,
);
