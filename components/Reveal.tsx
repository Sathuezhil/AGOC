"use client";

import { useEffect, useRef } from "react";

const motions = {
  up: "animate-fadeUp",
  left: "animate-fadeLeft",
  right: "animate-fadeRight",
  in: "animate-fadeIn",
} as const;

export default function Reveal({
  children,
  className = "",
  delay = 0,
  motion = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  motion?: keyof typeof motions;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.animationDelay = `${delay}ms`;
          el.classList.add(motions[motion]);
          observer.disconnect();
        }
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, motion]);

  return (
    <div ref={ref} className={`opacity-0 ${className}`}>
      {children}
    </div>
  );
}
