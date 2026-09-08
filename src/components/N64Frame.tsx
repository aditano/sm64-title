import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { N64_H, N64_W } from "@/lib/game-clock";

export function N64Frame({ children }: { children: (dpr: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      setDpr(N64_W / Math.max(el.clientWidth, 1));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="n64-stage">
      <div ref={ref} className="n64-frame" data-n64-frame="true">
        {children(dpr)}
      </div>
    </div>
  );
}

export function n64Size() {
  return { w: N64_W, h: N64_H };
}
