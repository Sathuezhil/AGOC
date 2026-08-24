"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center rounded-full border border-black/10 bg-black/[0.04] p-0.5"
      role="group"
      aria-label="Color theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Light theme"
        title="Light theme"
        className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[0.65rem] tracking-[0.12em] uppercase transition duration-300 sm:px-3 ${
          theme === "light"
            ? "bg-white text-black shadow-sm"
            : "text-black/50 hover:text-black"
        }`}
      >
        <Sun size={14} strokeWidth={2} />
        <span className="hidden md:inline">Light</span>
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Dark theme"
        title="Dark theme"
        className={`inline-flex h-9 items-center gap-1.5 rounded-full px-2.5 text-[0.65rem] tracking-[0.12em] uppercase transition duration-300 sm:px-3 ${
          theme === "dark"
            ? "bg-[#1E1E22] text-[#F7F4EF] shadow-sm"
            : "text-black/50 hover:text-black"
        }`}
      >
        <Moon size={14} strokeWidth={2} />
        <span className="hidden md:inline">Dark</span>
      </button>
    </div>
  );
}
