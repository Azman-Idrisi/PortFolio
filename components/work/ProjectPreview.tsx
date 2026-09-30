"use client";

import { useCallback, useImperativeHandle, useRef, useState, type Ref } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import type { Project } from "@/data/projects";

export type ProjectPreviewHandle = {
  /** Show the thumbnail for `id` (crossfades if another is showing). */
  show: (id: string) => void;
  hide: () => void;
  /** Pointer position, viewport px. */
  move: (x: number, y: number) => void;
  /** Fly the visible preview into that project's drawer thumbnail. */
  flyTo: (id: string) => void;
};

/**
 * Preview box width, CSS px. Height follows the active image's natural aspect
 * ratio (thumbnails are mixed 3:2 / 4:3 / ~2:1), exactly like ProjectThumbnail —
 * so nothing is cropped and the landing is a uniform scale.
 */
const W = 300;
const DEFAULT_H = W / 1.5;
const GAP = 32;
const HIDDEN_CLIP = "inset(100% 0% 0% 0%)";

/**
 * Floating thumbnail that trails the cursor over the project archive. On open
 * it flies into the drawer's thumbnail slot (`[data-drawer-thumb="<id>"]`),
 * tracking the slot every frame — the slot sits inside a drawer whose height
 * is still animating, and a neighbouring drawer may be closing above it.
 */
export function ProjectPreview({
  projects,
  enabled,
  ref,
}: {
  projects: Project[];
  enabled: boolean;
  ref: Ref<ProjectPreviewHandle>;
}) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  // Images mount on first hover, not on page load; that first project starts visible.
  const [firstId, setFirstId] = useState<string | null>(null);
  const armed = firstId !== null;
  const s = useRef({
    active: null as string | null,
    visible: false,
    flying: false,
    lastX: 0,
    h: DEFAULT_H,
    settle: 0 as number | ReturnType<typeof setTimeout>,
    xTo: null as gsap.QuickToFunc | null,
    yTo: null as gsap.QuickToFunc | null,
    rTo: null as gsap.QuickToFunc | null,
  });

  // Resize the box to the image's shape (once it has loaded).
  const fit = useCallback((id: string) => {
    const el = boxRef.current;
    const st = s.current;
    const img = el?.querySelector<HTMLImageElement>(`[data-preview-id="${id}"] img`);
    if (!el || !img?.naturalWidth || st.active !== id) return;
    st.h = (W * img.naturalHeight) / img.naturalWidth;
    if (st.visible) gsap.to(el, { height: st.h, duration: 0.35, ease: "power3.out", overwrite: "auto" });
    else gsap.set(el, { height: st.h });
  }, []);

  useImperativeHandle(
    ref,
    () => {
      const box = () => boxRef.current;

      const follow = (box: HTMLDivElement) => {
        const st = s.current;
        if (!st.xTo) {
          st.xTo = gsap.quickTo(box, "x", { duration: 0.6, ease: "power3" });
          st.yTo = gsap.quickTo(box, "y", { duration: 0.6, ease: "power3" });
          st.rTo = gsap.quickTo(box, "rotation", { duration: 0.5, ease: "power3" });
        }
        return st;
      };

      const crossfade = (el: HTMLDivElement, id: string) => {
        el.querySelectorAll<HTMLElement>("[data-preview-id]").forEach((img) => {
          gsap.to(img, { opacity: img.dataset.previewId === id ? 1 : 0, duration: 0.35, overwrite: true });
        });
      };

      const hide = () => {
        const el = box();
        const st = s.current;
        if (!el || st.flying || !st.visible) return;
        st.visible = false;
        gsap.to(el, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.45,
          ease: "expo.out",
          overwrite: "auto",
          onComplete: () => {
            if (!s.current.visible) gsap.set(el, { autoAlpha: 0 });
          },
        });
      };

      return {
        hide,
        show(id) {
          const el = box();
          const st = s.current;
          if (!enabled || st.flying) return;
          if (!armed) setFirstId(id);
          st.active = id;
          if (!el) return;
          crossfade(el, id);
          fit(id);
          if (st.visible) return;
          st.visible = true;
          gsap.fromTo(
            el,
            { clipPath: HIDDEN_CLIP, autoAlpha: 1 },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.6, ease: "expo.out", overwrite: "auto" }
          );
        },

        move(x, y) {
          const el = box();
          if (!el || !enabled || s.current.flying) return;
          // Sit beside the cursor; flip to its left near the right edge.
          const px = x + GAP + W > window.innerWidth - 16 ? x - GAP - W : x + GAP;
          const py = y - s.current.h / 2;
          const st = follow(el);
          if (!st.visible) {
            gsap.set(el, { x: px, y: py });
          } else {
            st.xTo!(px);
            st.yTo!(py);
          }
          // Lean into horizontal motion, settle when the pointer rests.
          st.rTo!(gsap.utils.clamp(-7, 7, (x - st.lastX) * 0.35));
          st.lastX = x;
          clearTimeout(st.settle);
          st.settle = setTimeout(() => s.current.rTo?.(0), 90);
        },

        flyTo(id) {
          const el = box();
          const st = s.current;
          const target = document.querySelector<HTMLElement>(`[data-drawer-thumb="${id}"]`);
          if (!el || !target || !st.visible || st.active !== id || st.flying) {
            hide();
            return;
          }
          st.flying = true;
          clearTimeout(st.settle);
          // The drawer fades its thumbnail in on its own schedule (faster than the
          // flight). Keep it hidden so there's only ever one image, and swap on landing.
          target.style.visibility = "hidden";
          gsap.killTweensOf(el, "x,y,rotation");
          st.xTo = st.yTo = st.rTo = null; // quickTo tweens are dead now; rebuilt on next follow

          const from = {
            x: Number(gsap.getProperty(el, "x")),
            y: Number(gsap.getProperty(el, "y")),
            r: Number(gsap.getProperty(el, "rotation")),
          };
          const lerp = gsap.utils.interpolate;
          const p = { t: 0 };
          gsap.to(p, {
            t: 1,
            duration: 0.9,
            ease: "expo.inOut",
            onUpdate: () => {
              const r = target.getBoundingClientRect();
              gsap.set(el, {
                x: lerp(from.x, r.left, p.t),
                y: lerp(from.y, r.top, p.t),
                scale: lerp(1, r.width / W, p.t),
                rotation: lerp(from.r, 0, p.t),
              });
            },
            onComplete: () => {
              // Landed exactly on the real thumbnail (same image, same shape): reveal
              // it underneath, then drop the ghost.
              target.style.visibility = "";
              gsap.to(el, {
                autoAlpha: 0,
                duration: 0.15,
                delay: 0.05,
                onComplete: () => {
                  gsap.set(el, { scale: 1, clipPath: HIDDEN_CLIP });
                  st.visible = false;
                  st.flying = false;
                },
              });
            },
          });
        },
      };
    },
    [enabled, armed, fit]
  );

  if (!enabled) return null;
  return (
    <div
      ref={boxRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[120] origin-top-left overflow-hidden border border-line bg-ink-2 invisible"
      style={{ width: W, height: DEFAULT_H, clipPath: HIDDEN_CLIP }}
    >
      {armed &&
        projects.map((p) => (
          <div
            key={p.id}
            data-preview-id={p.id}
            className={`absolute inset-0 ${p.id === firstId ? "" : "opacity-0"}`}
          >
            <Image
              src={p.thumbnail}
              alt=""
              fill
              // Same sizes as ProjectThumbnail: the drawer reuses the cached file
              // and the landing handoff is pixel-identical.
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              onLoad={() => fit(p.id)}
            />
          </div>
        ))}
    </div>
  );
}
