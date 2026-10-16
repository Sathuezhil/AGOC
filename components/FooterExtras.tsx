"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function DubaiClock({ label }: { label: string }) {
  const [time, setTime] = useState("--:--");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Dubai",
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className="ops-foot-clock">
      <i aria-hidden />
      {label}
      <b dir="ltr">{time}</b>
      <span className="text-white/40">GST</span>
    </span>
  );
}

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="ops-foot-top"
      aria-label={label}
      title={label}
      onClick={() => {
        const lenis = window.__agocLenis;
        if (lenis) lenis.scrollTo(0, { duration: 1.8 });
        else window.scrollTo({ top: 0, behavior: "smooth" });
      }}
    >
      <span>{label}</span>
      <ArrowUp size={16} />
    </button>
  );
}
