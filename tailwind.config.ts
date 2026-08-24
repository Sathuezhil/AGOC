import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1E1E22",
        night: "#2A2A30",
        coal: "#35353C",
        crimson: {
          DEFAULT: "#C04A31",
          dark: "#9A3A27",
          soft: "#D46B56",
        },
        olive: {
          DEFAULT: "#4D7436",
          dark: "#3A5829",
          light: "#6B9450",
        },
        gold: "#4D7436",
        steel: "#A6A6A6",
        sand: "#F7F4EF",
        mist: "#C4C0B8",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(77,116,54,0.18), 0 24px 60px rgba(0,0,0,0.45)",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        fadeLeft: {
          from: { opacity: "0", transform: "translateX(-24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          from: { opacity: "0", transform: "translateX(24px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        kenburns: {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
        kenburnsPulse: {
          "0%": { transform: "scale(1) translate3d(0, 0, 0)" },
          "50%": { transform: "scale(1.14) translate3d(-1.2%, -0.6%, 0)" },
          "100%": { transform: "scale(1) translate3d(0, 0, 0)" },
        },
        heroPan: {
          "0%, 100%": { transform: "scale(1.04) translate3d(0, 0, 0)" },
          "50%": { transform: "scale(1.12) translate3d(0, -2.4%, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        imageFloat: {
          "0%, 100%": { transform: "translateY(3%) scale(1.05)" },
          "50%": { transform: "translateY(-3%) scale(1.05)" },
        },
        imageFloatAlt: {
          "0%, 100%": { transform: "translateY(-3%) scale(1.05)" },
          "50%": { transform: "translateY(3%) scale(1.05)" },
        },
        imageFloatFast: {
          "0%, 100%": { transform: "translateY(5%) scale(1.05)" },
          "50%": { transform: "translateY(-5%) scale(1.05)" },
        },
        imageFloatAltFast: {
          "0%, 100%": { transform: "translateY(-5%) scale(1.05)" },
          "50%": { transform: "translateY(5%) scale(1.05)" },
        },
        pulseRing: {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        scroll: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "80%": { opacity: "0" },
          "100%": { transform: "translateY(12px)", opacity: "0" },
        },
        pop: {
          "0%": { opacity: "0", transform: "scale(0.86)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        fadeIn: "fadeIn 0.8s ease forwards",
        fadeLeft: "fadeLeft 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        fadeRight: "fadeRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        kenburns: "kenburns 22s ease-out forwards",
        kenburnsPulse: "kenburnsPulse 7.5s ease-in-out forwards",
        heroPan: "heroPan 14s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
        imageFloat: "imageFloat 5.5s ease-in-out infinite",
        imageFloatAlt: "imageFloatAlt 6.2s ease-in-out infinite",
        imageFloatFast: "imageFloatFast 2.4s ease-in-out infinite",
        imageFloatAltFast: "imageFloatAltFast 2.4s ease-in-out infinite",
        pulseRing: "pulseRing 1.8s ease-out infinite",
        scroll: "scroll 1.6s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        pop: "pop 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
