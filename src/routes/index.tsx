import { createFileRoute } from "@tanstack/react-router";
import { TitleOverlay } from "@/components/ui/TitleOverlay";
import { TitleScene } from "@/components/scene/TitleScene";
import { N64Frame } from "@/components/N64Frame";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  return (
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
  );
}
