"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle({
  variant = "header",
  compact = false,
}: {
  variant?: "header" | "admin";
  /** Icon-only toggle for tight headers */
  compact?: boolean;
}) {
  const { theme, setTheme } = useTheme();
  const admin = variant === "admin";
  const iconOnly = compact || variant === "header";

  return (
    <div
      className={`shrink-0 ${
        admin
          ? "flex items-center rounded-full border border-sand/15 bg-sand/[0.04] p-0.5"
          : "flex items-center rounded-full border border-black/10 bg-black/[0.04] p-0.5"
      }`}
      role="group"
      aria-label="Color theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Light theme"
        title="Light theme"
        className={`inline-flex h-8 items-center gap-1.5 rounded-full transition duration-300 sm:h-9 ${
          iconOnly ? "px-2" : "px-2.5 sm:px-3"
        } text-[0.65rem] tracking-[0.12em] uppercase ${
          theme === "light"
            ? "bg-white text-navy shadow-sm"
            : admin
              ? "text-mist hover:text-sand"
              : "text-navy/45 hover:text-navy"
        }`}
      >
        <Sun size={14} strokeWidth={2} />
        {!iconOnly && <span className="hidden md:inline">Light</span>}
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Dark theme"
        title="Dark theme"
        className={`inline-flex h-8 items-center gap-1.5 rounded-full transition duration-300 sm:h-9 ${
          iconOnly ? "px-2" : "px-2.5 sm:px-3"
        } text-[0.65rem] tracking-[0.12em] uppercase ${
          theme === "dark"
            ? "bg-navy text-white shadow-sm"
            : admin
              ? "text-mist hover:text-sand"
              : "text-navy/45 hover:text-navy"
        }`}
      >
        <Moon size={14} strokeWidth={2} />
        {!iconOnly && <span className="hidden md:inline">Dark</span>}
      </button>
    </div>
  );
}
