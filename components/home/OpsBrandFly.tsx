"use client";

import { useEffect, useRef } from "react";

function clamp(v: number, a = 0, b = 1) {
  return v < a ? a : v > b ? b : v;
}
const smooth = (t: number) => t * t * (3 - 2 * t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Offset of `el` inside `container`, ignoring CSS transforms. */
function offsetWithin(el: HTMLElement, container: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== container) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

/**
 * Finds the ink of the glyph's first vertical stroke on its mid-height row.
 * Returns positions in CSS px relative to the glyph's pen origin and baseline.
 */
function measureStroke(glyph: string, style: CSSStyleDeclaration) {
  const size = parseFloat(style.fontSize) || 40;
  const k = 8;
  const font = `${style.fontStyle} ${style.fontWeight} ${size * k}px ${style.fontFamily}`;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  ctx.font = font;
  const m = ctx.measureText(glyph);
  const ascent = Math.ceil(m.actualBoundingBoxAscent);
  canvas.width = Math.ceil(m.width + size * k * 0.2);
  canvas.height = Math.ceil(ascent + m.actualBoundingBoxDescent + 4);
  ctx.font = font;
  ctx.fillStyle = "#000";
  ctx.textBaseline = "alphabetic";
  ctx.fillText(glyph, 0, ascent + 2);

  const row = Math.round(2 + ascent / 2);
  const data = ctx.getImageData(0, row, canvas.width, 1).data;
  let start = -1;
  let end = -1;
  for (let x = 0; x < canvas.width; x++) {
    const ink = data[x * 4 + 3] > 127;
    if (ink && start < 0) start = x;
    if (!ink && start >= 0) {
      end = x;
      break;
    }
  }
  if (start < 0 || end < 0) return null;
  return {
    x: (start + end) / 2 / k,
    thickness: (end - start) / k,
    y: -ascent / 2 / k,
    fontAscent: m.fontBoundingBoxAscent / k,
    fontDescent: m.fontBoundingBoxDescent / k,
  };
}

export default function OpsBrandFly({ text, focus = "O" }: { text: string; focus?: string }) {
  const flyRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const focusRef = useRef<HTMLSpanElement>(null);

  const at = Math.max(0, text.indexOf(focus));
  const before = text.slice(0, at);
  const glyph = text.slice(at, at + focus.length);
  const after = text.slice(at + focus.length);

  useEffect(() => {
    const fly = flyRef.current;
    const fill = fillRef.current;
    const focusEl = focusRef.current;
    if (!fly || !fill || !focusEl) return;
    const stageEl = fly.closest<HTMLElement>(".ops-hero-stage");
    const sceneEl = fly.closest<HTMLElement>("[data-scene]");
    const slotEl = stageEl?.querySelector<HTMLElement>("[data-brand-slot]");
    if (!stageEl || !sceneEl || !slotEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const stage: HTMLElement = stageEl;
    const scene: HTMLElement = sceneEl;
    const slot: HTMLElement = slotEl;
    const target: HTMLSpanElement = focusEl;

    let w = 1;
    let h = 1;
    let fx = 0;
    let fy = 0;
    let maxScale = 1;

    function layout() {
      w = stage.clientWidth;
      h = stage.clientHeight;
      const off = offsetWithin(slot, stage);
      fly!.style.left = `${off.x}px`;
      fly!.style.top = `${off.y}px`;
      fly!.style.width = `${slot.offsetWidth}px`;
      fly!.style.height = `${slot.offsetHeight}px`;

      const stroke = measureStroke(glyph, getComputedStyle(target));
      let lx: number;
      let ly: number;
      let thickness: number;
      if (stroke) {
        const content = stroke.fontAscent + stroke.fontDescent;
        const baseline = target.offsetTop + (target.offsetHeight - content) / 2 + stroke.fontAscent;
        lx = target.offsetLeft + stroke.x;
        ly = baseline + stroke.y;
        thickness = stroke.thickness;
      } else {
        lx = target.offsetLeft + target.offsetWidth * 0.12;
        ly = target.offsetTop + target.offsetHeight * 0.55;
        thickness = target.offsetWidth * 0.18;
      }
      fx = off.x + lx;
      fy = off.y + ly;
      fly!.style.transformOrigin = `${lx.toFixed(2)}px ${ly.toFixed(2)}px`;
      maxScale = Math.max(4, (Math.max(w, h) * 1.3) / Math.max(1, thickness));
    }

    let raf = 0;
    let visible = true;

    function render() {
      raf = 0;
      const p = clamp(parseFloat(scene.style.getPropertyValue("--p")) || 0);

      const move = easeOut(clamp(p / 0.4));
      const zoom = clamp((p - 0.05) / 0.75);
      const scale = Math.pow(maxScale, smooth(zoom) * 0.4 + zoom * 0.6);

      const tx = (w / 2 - fx) * move;
      const ty = (h / 2 - fy) * move;
      fly!.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
      const out = 1 - clamp((p - 0.84) / 0.12);
      fly!.style.opacity = out.toFixed(3);
      fill!.style.opacity = (smooth(clamp((zoom - 0.62) / 0.22)) * out).toFixed(3);

      if (visible && !document.hidden) raf = window.requestAnimationFrame(render);
    }

    const relayout = () => {
      layout();
      if (!raf) raf = window.requestAnimationFrame(render);
    };

    layout();
    scene.setAttribute("data-brand-live", "1");

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = window.requestAnimationFrame(render);
    });
    io.observe(scene);
    const ro = new ResizeObserver(relayout);
    ro.observe(stage);
    const settleTimer = window.setTimeout(relayout, 700);
    document.fonts?.ready.then(relayout);
    const onVisibility = () => {
      if (!document.hidden && visible && !raf) raf = window.requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);
    raf = window.requestAnimationFrame(render);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      window.clearTimeout(settleTimer);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      scene.removeAttribute("data-brand-live");
    };
  }, [glyph]);

  return (
    <>
      <div ref={flyRef} className="ops-brand-fly" aria-hidden>
        <p className="ops-hero-brand-name">
          {before}
          <span ref={focusRef}>{glyph}</span>
          {after}
        </p>
      </div>
      <div ref={fillRef} className="ops-brand-fly-fill" aria-hidden />
    </>
  );
}
