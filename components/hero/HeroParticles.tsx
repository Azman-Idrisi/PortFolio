"use client";

import { useEffect, useRef } from "react";
import { useMedia } from "@/hooks/useMedia";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const REVEAL_EVENT = "ma:loader:reveal";

const CFG = {
  DESKTOP_COUNT: 110,
  MOBILE_COUNT: 45,
  LINK_DIST: 110,
  LINK_ALPHA: 0.14,
  DOT_ALPHA_MIN: 0.12,
  DOT_ALPHA_MAX: 0.35,
  DOT_SIZE_MIN: 1,
  DOT_SIZE_MAX: 2.5,
  ACCENT_RATIO: 0.06,
  RING_PARTICLES: 90,
  RING_DUR_MS: 1200,
  RING_MAX_MULT: 1.5,
  DISPERSE_DUR_MS: 900,
  REPEL_RADIUS: 120,
  REPEL_FORCE: 0.35,
  SPRING: 0.04,
  SCROLL_DRIFT: 0.18,
  DPR_CAP: 2,
  RESIZE_DEBOUNCE_MS: 180,
  MASK_FADE_PX: 90,
};

const TOKENS = {
  paper: { r: 244, g: 241, b: 236 },
  accent: { r: 232, g: 255, b: 139 },
};

type P = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  accent: boolean;
  targetX: number;
  targetY: number;
  depth: number;
  settled: boolean;
  ring: boolean;
  ringAngle: number;
  ringRadius: number;
};

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDesktop = useMedia("(min-width: 768px)");
  const isFine = useMedia("(pointer: fine)");
  const reduced = useReducedMotion();
  const reducedRef = useRef(false);
  const isDesktopRef = useRef(false);
  const isFineRef = useRef(false);
  const revealedRef = useRef(false);
  const ringActiveRef = useRef(false);
  const ringStartRef = useRef(0);
  const ringPartRef = useRef<P[] | null>(null);
  const ambientRef = useRef<P[] | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollOffsetRef = useRef(0);
  const cursorRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  useEffect(() => {
    reducedRef.current = reduced;
    isDesktopRef.current = isDesktop;
    isFineRef.current = isFine;
  }, [reduced, isDesktop, isFine]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: P[] = [];
    let dpr = 1;
    let w = 0;
    let h = 0;
    let resizeTimer: number | null = null;

    const seed = (count: number) => {
      const list: P[] = [];
      for (let i = 0; i < count; i++) {
        const accent = Math.random() < CFG.ACCENT_RATIO;
        const x = Math.random() * w;
        const y = Math.random() * h;
        list.push({
          x,
          y,
          vx: 0,
          vy: 0,
          size:
            CFG.DOT_SIZE_MIN +
            Math.random() * (CFG.DOT_SIZE_MAX - CFG.DOT_SIZE_MIN),
          alpha:
            CFG.DOT_ALPHA_MIN +
            Math.random() * (CFG.DOT_ALPHA_MAX - CFG.DOT_ALPHA_MIN),
          accent,
          targetX: x,
          targetY: y,
          depth: 0.6 + Math.random() * 0.8,
          settled: true,
          ring: false,
          ringAngle: 0,
          ringRadius: 0,
        });
      }
      return list;
    };

    const buildRing = (count: number): P[] => {
      const list: P[] = [];
      for (let i = 0; i < count; i++) {
        const accent = Math.random() < CFG.ACCENT_RATIO * 1.6;
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.05;
        const target =
          particles[Math.floor(Math.random() * particles.length)] ??
          ({
            x: w * 0.5,
            y: h * 0.5,
            targetX: w * 0.5,
            targetY: h * 0.5,
          } as P);
        list.push({
          x: w * 0.5,
          y: h * 0.5,
          vx: 0,
          vy: 0,
          size:
            CFG.DOT_SIZE_MIN +
            Math.random() * (CFG.DOT_SIZE_MAX - CFG.DOT_SIZE_MIN) * 0.9,
          alpha:
            CFG.DOT_ALPHA_MIN +
            Math.random() * (CFG.DOT_ALPHA_MAX - CFG.DOT_ALPHA_MIN),
          accent,
          targetX: target.targetX,
          targetY: target.targetY,
          depth: target.depth ?? 1,
          settled: false,
          ring: true,
          ringAngle: angle,
          ringRadius: 0,
        });
      }
      return list;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, CFG.DPR_CAP);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = isDesktopRef.current
        ? CFG.DESKTOP_COUNT
        : CFG.MOBILE_COUNT;
      particles = seed(count);
      ambientRef.current = particles;
      if (!ringActiveRef.current) {
        lastScrollYRef.current = window.scrollY;
      }
    };

    const onResize = () => {
      if (resizeTimer) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, CFG.RESIZE_DEBOUNCE_MS);
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursorRef.current.x = e.clientX - rect.left;
      cursorRef.current.y = e.clientY - rect.top;
      cursorRef.current.active = true;
    };
    const onPointerLeave = () => {
      cursorRef.current.active = false;
      cursorRef.current.x = -9999;
      cursorRef.current.y = -9999;
    };
    const onScroll = () => {
      const next = window.scrollY;
      const delta = next - lastScrollYRef.current;
      lastScrollYRef.current = next;
      scrollOffsetRef.current += delta;
    };

    const drawLink = (a: P, b: P) => {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.hypot(dx, dy);
      if (d > CFG.LINK_DIST) return;
      const t = 1 - d / CFG.LINK_DIST;
      const c = a.accent || b.accent ? TOKENS.accent : TOKENS.paper;
      ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${(t * CFG.LINK_ALPHA).toFixed(3)})`;
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(b.x, b.y);
      ctx.stroke();
    };

    const drawDot = (p: P) => {
      const c = p.accent ? TOKENS.accent : TOKENS.paper;
      ctx.fillStyle = `rgba(${c.r},${c.g},${c.b},${p.alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    };

    const easeOutCctp = (t: number) => {
      const inv = 1 - t;
      return 1 - inv * inv * inv * inv * inv;
    };

    const tick = (now: number) => {
      rafRef.current = requestAnimationFrame(tick);
      if (!w || !h) return;

      ctx.clearRect(0, 0, w, h);

      const ambient = ambientRef.current ?? particles;
      const ring = ringPartRef.current;
      const combined: P[] = ring ? ambient.concat(ring) : ambient;

      if (ring && ringActiveRef.current) {
        const elapsed = now - ringStartRef.current;
        const raw = Math.min(1, elapsed / CFG.RING_DUR_MS);
        const e = easeOutCctp(raw);
        const maxR =
          Math.hypot(w, h) * CFG.RING_MAX_MULT;
        const r = e * maxR;
        const disperseT = Math.max(
          0,
          Math.min(1, (elapsed - CFG.RING_DUR_MS * 0.4) / CFG.DISPERSE_DUR_MS)
        );
        for (const p of ring) {
          if (disperseT > 0) {
            p.x = p.x + (p.targetX - p.x) * disperseT * 0.08;
            p.y = p.y + (p.targetY - p.y) * disperseT * 0.08;
          }
          p.ringRadius = r;
          p.x = w * 0.5 + Math.cos(p.ringAngle) * r;
          p.y = h * 0.5 + Math.sin(p.ringAngle) * r;
        }
        if (raw >= 1 && disperseT >= 1) {
          ringActiveRef.current = false;
          for (const p of ring) {
            p.x = p.targetX;
            p.y = p.targetY;
            p.settled = true;
          }
          ringPartRef.current = null;
        }
      }

      if (!reducedRef.current) {
        const cursor = cursorRef.current;
        const cx = cursor.x;
        const cy = cursor.y;
        const repelling = isFineRef.current && cursor.active;

        for (const p of combined) {
          if (p.ring && ringActiveRef.current) continue;
          if (!p.ring) {
            const drift =
              (Math.sin((p.x + p.y) * 0.013 + now * 0.0005) +
                Math.cos((p.x - p.y) * 0.011 + now * 0.0004)) *
              0.08;
            p.vx += drift * 0.02;
            p.vy += drift * 0.02;
            p.vx += (p.targetX - p.x) * CFG.SPRING * 0.12;
            p.vy += (p.targetY - p.y) * CFG.SPRING * 0.12;
            p.vx *= 0.94;
            p.vy *= 0.94;
            p.x += p.vx;
            p.y += p.vy;
          }
          if (repelling) {
            const dx = p.x - cx;
            const dy = p.y - cy;
            const d = Math.hypot(dx, dy);
            if (d < CFG.REPEL_RADIUS && d > 0.001) {
              const f = (1 - d / CFG.REPEL_RADIUS) * CFG.REPEL_FORCE;
              p.x += (dx / d) * f * 6;
              p.y += (dy / d) * f * 6;
            }
          }
        }
      }

      const linkActive = combined.length <= 160;
      if (linkActive) {
        for (let i = 0; i < combined.length; i++) {
          for (let j = i + 1; j < combined.length; j++) {
            const a = combined[i];
            const b = combined[j];
            if (a.ring || b.ring) continue;
            drawLink(a, b);
          }
        }
      }

      for (const p of combined) {
        drawDot(p);
      }
    };

    const onReveal = () => {
      if (revealedRef.current) return;
      revealedRef.current = true;
      if (reducedRef.current) return;
      const ring = buildRing(CFG.RING_PARTICLES);
      ringPartRef.current = ring;
      ringActiveRef.current = true;
      ringStartRef.current = performance.now();
    };

    const onStaticDraw = () => {
      ctx.clearRect(0, 0, w, h);
      const list = ambientRef.current ?? particles;
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          drawLink(list[i], list[j]);
        }
      }
      for (const p of list) drawDot(p);
    };

    resize();

    if (reducedRef.current) {
      onStaticDraw();
      window.addEventListener("resize", onResize);
      return () => {
        window.removeEventListener("resize", onResize);
        if (resizeTimer) window.clearTimeout(resizeTimer);
      };
    }

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    if (isFineRef.current) {
      window.addEventListener("pointermove", onPointerMove, {
        passive: true,
      });
      window.addEventListener("pointerleave", onPointerLeave);
    }
    window.addEventListener(REVEAL_EVENT, onReveal);

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener(REVEAL_EVENT, onReveal);
      if (resizeTimer) window.clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="hero-canvas pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}
