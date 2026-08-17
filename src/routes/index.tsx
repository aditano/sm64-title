import { createFileRoute } from "@tanstack/react-router";
import { TitleOverlay } from "@/components/ui/TitleOverlay";
import { TitleScene } from "@/components/scene/TitleScene";

export const Route = createFileRoute("/")({
  ssr: false,
  component: Home,
});

function Home() {
  return (
    <main className="relative h-dvh w-full overflow-hidden overscroll-none bg-sky touch-none">
      <TitleScene />
      <TitleOverlay />
    </main>
  );
}
