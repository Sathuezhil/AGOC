"use client";

import {
  useRef,
  type ReactNode,
  type CSSProperties,
  type MouseEvent,
} from "react";

type Props = {
  children: ReactNode;
  className?: string;
  intensity?: number;
};

export default function Card3D({
  children,
  className = "",
  intensity = 11,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(event: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    el.style.setProperty("--rx", `${((0.5 - y) * intensity * 2).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${((x - 0.5) * intensity * 2).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  }

  return (
    <div className={`card-3d-scene h-full ${className}`}>
      <div
        ref={ref}
        className="card-3d h-full"
        style={
          {
            "--rx": "0deg",
            "--ry": "0deg",
            "--gx": "50%",
            "--gy": "50%",
          } as CSSProperties
        }
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        {children}
      </div>
    </div>
  );
}
