"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const TILT_SELECTOR =
  ".ops-tile, .ops-service-card, .ops-trust-card, .ops-step, .ops-job, .ops-stat-strip, .ops-site-chip, .ops-info-link, [data-tilt]";
const MAG_SELECTOR = ".ops-btn, [data-mag]";
const SPOT_SELECTOR = ".ops-dark, .ops-cta, [data-spot]";
const REVEAL_SELECTOR = ".ops-h2, .ops-media, .ops-map, [data-wipe], [data-rise]";

type Scene = { el: HTMLElement; p: number };
type Track = { el: HTMLElement; track: HTMLElement; max: number; p: number };
type Exit = { el: HTMLElement; next: HTMLElement; x: number };
type KineticChar = { el: HTMLElement; t: number; w: number; y: number };
type Kinetic = { el: HTMLElement; chars: KineticChar[]; base: number; peak: number };

declare global {
  interface Window {
    __agocLenis?: Lenis | null;
    __agocMotion?: boolean;
  }
}

function clamp(v: number, a: number, b: number) {
  return v < a ? a : v > b ? b : v;
}

let hydrated = false;

/** React tags each DOM node it has claimed with a `__reactFiber$…` key. */
function isHydrated(main: HTMLElement) {
  const nodes = [
    ...Array.from(main.querySelectorAll("section, [data-scene], [data-hx-scene]")),
    ...Array.from(document.querySelectorAll(".ops-foot, .ops-foot [data-rise], .ops-foot [data-spot]")),
  ];
  for (const node of nodes) {
    if (!Object.keys(node).some((k) => k.startsWith("__reactFiber$"))) return false;
  }
  return true;
}

function sectionTone(el: Element | null) {
  if (!el) return "";
  if (el.classList.contains("ops-dark")) return "dark";
  if (el.classList.contains("ops-light")) return "light";
  return "";
}

export default function MotionEngine() {
  const pathname = usePathname();
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.__agocMotion = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      document.documentElement.removeAttribute("data-motion");
      return;
    }
    document.documentElement.setAttribute("data-motion", "1");

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
    window.__agocLenis = lenis;

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href*='#']") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (url.pathname !== window.location.pathname || url.search !== window.location.search || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      e.stopPropagation();
      lenis.scrollTo(target, { offset: -90, duration: 1.5 });
      window.history.replaceState(null, "", url.hash);
    };
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
      lenis.destroy();
      window.__agocLenis = null;
    };
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const root = document.documentElement;
    const main = document.querySelector("main");
    if (!main) return;

    let scenes: Scene[] = [];
    let tracks: Track[] = [];
    let exits: Exit[] = [];
    let kinetics: Kinetic[] = [];
    let spots: HTMLElement[] = [];
    let parallax: HTMLElement[] = [];
    let vh = window.innerHeight;
    let vw = window.innerWidth;
    let lastY = window.scrollY;
    let navHidden = false;
    let pointerX = -9999;
    let pointerY = -9999;
    let raf = 0;
    let alive = true;

    // Reveal targets start fully clipped, which IntersectionObserver reports as zero area.
    let reveals: HTMLElement[] = [];

    function collect() {
      scenes = Array.from(main!.querySelectorAll<HTMLElement>("[data-scene]")).map((el) => ({
        el,
        p: -1,
      }));

      const desktop = window.matchMedia("(min-width: 1024px)").matches;
      tracks = Array.from(main!.querySelectorAll<HTMLElement>("[data-hx-scene]"))
        .map((el) => {
          const track = el.querySelector<HTMLElement>("[data-hx]");
          if (!track) return null;
          if (!desktop || reduced) {
            el.style.height = "";
            track.style.transform = "";
            return null;
          }
          const max = Math.max(0, track.scrollWidth - track.clientWidth);
          el.style.height = `${Math.round(max + vh)}px`;
          return { el, track, max, p: -1 };
        })
        .filter(Boolean) as Track[];

      const sections = Array.from(main!.querySelectorAll<HTMLElement>(":scope > section, :scope > div > section"));
      exits = [];
      sections.forEach((el) => {
        el.removeAttribute("data-exit");
        el.style.removeProperty("--x");
      });
      sections.forEach((el) => {
        const next = el.nextElementSibling as HTMLElement | null;
        if (!next || next.tagName !== "SECTION" || next.classList.contains("ops-norise")) return;
        const a = sectionTone(el);
        const b = sectionTone(next);
        if (a && b && a !== b) {
          el.setAttribute("data-exit", "1");
          exits.push({ el, next, x: 0 });
        }
      });

      kinetics = finePointer && !reduced
        ? Array.from(main!.querySelectorAll<HTMLElement>("[data-kinetic]")).map((el) => ({
            el,
            base: Number(el.dataset.base || 640),
            peak: Number(el.dataset.peak || 880),
            chars: Array.from(el.querySelectorAll<HTMLElement>(".kch")).map((c) => ({ el: c, t: 0, w: -1, y: 0 })),
          }))
        : [];

      spots = finePointer ? Array.from(document.body.querySelectorAll<HTMLElement>(SPOT_SELECTOR)) : [];
      parallax = reduced ? [] : Array.from(main!.querySelectorAll<HTMLElement>(".ops-media:not(.ops-media-still)"));

      const targets = Array.from(document.body.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
      if (reduced) {
        targets.forEach((el) => el.setAttribute("data-in", "1"));
        reveals = [];
      } else {
        reveals = targets.filter((el) => !el.hasAttribute("data-in"));
      }
      kick();
    }

    function frame(time: number) {
      raf = 0;
      if (!alive) return;
      window.__agocLenis?.raf(time);

      const y = window.scrollY;
      const doc = root.scrollHeight - vh;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${doc > 0 ? clamp(y / doc, 0, 1).toFixed(4) : 0})`;
      }

      const dy = y - lastY;
      if (y < 160) {
        if (navHidden) {
          navHidden = false;
          root.removeAttribute("data-nav-hide");
        }
      } else if (dy > 4 && !navHidden) {
        navHidden = true;
        root.setAttribute("data-nav-hide", "1");
      } else if (dy < -4 && navHidden) {
        navHidden = false;
        root.removeAttribute("data-nav-hide");
      }
      lastY = y;

      if (reveals.length) {
        reveals = reveals.filter((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < vh * 0.9 && r.bottom > 0) {
            el.setAttribute("data-in", "1");
            return false;
          }
          return true;
        });
      }

      scenes.forEach((sc) => {
        const r = sc.el.getBoundingClientRect();
        const raw = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        const p = reduced ? 0 : raw;
        if (Math.abs(p - sc.p) > 0.0002) {
          const wasPast = sc.p > 0.42;
          sc.p = p;
          sc.el.style.setProperty("--p", p.toFixed(4));
          if (wasPast !== p > 0.42) sc.el.toggleAttribute("data-past", p > 0.42);
        }
      });

      const rtl = root.dir === "rtl";
      tracks.forEach((t) => {
        const r = t.el.getBoundingClientRect();
        const p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1);
        if (Math.abs(p - t.p) > 0.0002) {
          t.p = p;
          t.el.style.setProperty("--p", p.toFixed(4));
          t.track.style.transform = `translate3d(${(rtl ? 1 : -1) * p * t.max}px,0,0)`;
        }
      });

      exits.forEach((e) => {
        const r = e.next.getBoundingClientRect();
        const x = reduced ? 0 : clamp((vh - r.top) / vh, 0, 1);
        if (Math.abs(x - e.x) > 0.001) {
          e.x = x;
          e.el.style.setProperty("--x", x.toFixed(3));
        }
      });

      parallax.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const mid = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.setProperty("--py", `${(mid * -26).toFixed(1)}px`);
      });

      kinetics.forEach((k) => {
        const hr = k.el.getBoundingClientRect();
        const near = pointerY > hr.top - 140 && pointerY < hr.bottom + 140 && hr.bottom > 0 && hr.top < vh;
        const sigma = Math.max(70, hr.height * 0.5);
        k.chars.forEach((c) => {
          let target = 0;
          if (near) {
            const cr = c.el.getBoundingClientRect();
            const dx = pointerX - (cr.left + cr.width / 2);
            const dyy = pointerY - (cr.top + cr.height / 2);
            target = Math.exp(-(dx * dx + dyy * dyy) / (2 * sigma * sigma));
          }
          c.t += (target - c.t) * 0.16;
          const w = Math.round(k.base + (k.peak - k.base) * c.t);
          const ly = -(c.t * 6);
          if (w !== c.w) {
            c.w = w;
            c.el.style.fontWeight = String(w);
          }
          if (Math.abs(ly - c.y) > 0.15) {
            c.y = ly;
            c.el.style.setProperty("--ly", `${ly.toFixed(1)}px`);
          }
        });
      });

      raf = window.requestAnimationFrame(frame);
    }

    function kick() {
      if (!raf && alive) raf = window.requestAnimationFrame(frame);
    }

    let magEl: HTMLElement | null = null;
    let tiltEl: HTMLElement | null = null;

    function resetMag() {
      if (!magEl) return;
      magEl.style.setProperty("--mgx", "0px");
      magEl.style.setProperty("--mgy", "0px");
      magEl = null;
    }
    function resetTilt() {
      if (!tiltEl) return;
      tiltEl.style.setProperty("--rx", "0deg");
      tiltEl.style.setProperty("--ry", "0deg");
      tiltEl = null;
    }

    function onPointer(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      pointerX = e.clientX;
      pointerY = e.clientY;
      const target = e.target as Element | null;

      const mag = target?.closest?.(MAG_SELECTOR) as HTMLElement | null;
      if (mag !== magEl) resetMag();
      if (mag) {
        magEl = mag;
        const b = mag.getBoundingClientRect();
        const pull = Number(mag.dataset.mag || 0.28);
        mag.style.setProperty("--mgx", `${clamp((e.clientX - (b.left + b.width / 2)) * pull, -14, 14).toFixed(1)}px`);
        mag.style.setProperty("--mgy", `${clamp((e.clientY - (b.top + b.height / 2)) * pull, -10, 10).toFixed(1)}px`);
        mag.style.setProperty("--bx", `${(e.clientX - b.left).toFixed(0)}px`);
        mag.style.setProperty("--by", `${(e.clientY - b.top).toFixed(0)}px`);
      }

      const tilt = target?.closest?.(TILT_SELECTOR) as HTMLElement | null;
      if (tilt !== tiltEl) resetTilt();
      if (tilt) {
        tiltEl = tilt;
        const b = tilt.getBoundingClientRect();
        const px = (e.clientX - b.left) / b.width;
        const py = (e.clientY - b.top) / b.height;
        const amt = Number(tilt.dataset.tilt || (b.width > 520 ? 3 : 6));
        tilt.style.setProperty("--gx", `${(px * 100).toFixed(1)}%`);
        tilt.style.setProperty("--gy", `${(py * 100).toFixed(1)}%`);
        tilt.style.setProperty("--rx", `${((0.5 - py) * amt).toFixed(2)}deg`);
        tilt.style.setProperty("--ry", `${((px - 0.5) * amt).toFixed(2)}deg`);
      }

      for (const el of spots) {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        el.style.setProperty("--sx", `${(e.clientX - r.left).toFixed(0)}px`);
        el.style.setProperty("--sy", `${(e.clientY - r.top).toFixed(0)}px`);
      }
    }

    function onLeave() {
      pointerX = -9999;
      pointerY = -9999;
      resetMag();
      resetTilt();
    }

    function onResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!finePointer && w === vw && Math.abs(h - vh) < 160) return;
      vw = w;
      vh = h;
      if (ready) collect();
    }

    let ready = false;
    let mutationTimer = 0;
    let settle = 0;
    let idle = 0;
    let fallback = 0;
    const mo = new MutationObserver(() => {
      if (!ready) return;
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(collect, 120);
    });
    mo.observe(main, { childList: true, subtree: true });

    // Server-rendered markup must not be touched until React has hydrated it.
    const start = () => {
      if (!alive || ready) return;
      ready = true;
      hydrated = true;
      collect();
      settle = window.setTimeout(collect, 700);
      document.fonts?.ready.then(() => alive && collect());
    };
    kick();
    if (hydrated) {
      start();
    } else {
      const poll = () => {
        if (!alive || ready) return;
        if (isHydrated(main)) start();
        else idle = window.setTimeout(poll, 60);
      };
      poll();
      fallback = window.setTimeout(start, 6000);
    }
    if (finePointer) {
      document.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
    }
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      alive = false;
      if (raf) window.cancelAnimationFrame(raf);
      window.clearTimeout(settle);
      window.clearTimeout(idle);
      window.clearTimeout(fallback);
      window.clearTimeout(mutationTimer);
      mo.disconnect();
      document.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
      root.removeAttribute("data-nav-hide");
    };
  }, [pathname]);

  return <div ref={progressRef} className="ops-progress" aria-hidden />;
}
