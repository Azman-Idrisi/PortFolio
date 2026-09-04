"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { fakeLoadEase } from "@/lib/fakeLoadEase";

gsap.registerPlugin(CustomEase);
CustomEase.create("cctpOut", "0.625, 0.05, 0, 1");

const CFG = {
  FILL_DUR: 4.5,
  SQUEEZE_DUR: 1.4,
  CARD_DOWN_DUR: 0.5,
  CARD_DOWN_STAGGER: 0.1,
  PATTERN_DOWN_DUR: 0.9,
  SETTLE_DUR: 0.4,
  RISE_DUR: 1.4,
  FAILSAFE_BUFFER: 4,
  DOT_INTERVAL_MS: 350,
  READY_LABEL: "READY",
};
const REAL_TOTAL =
  CFG.FILL_DUR +
  CFG.SQUEEZE_DUR +
  CFG.CARD_DOWN_DUR +
  CFG.CARD_DOWN_STAGGER +
  CFG.PATTERN_DOWN_DUR +
  CFG.SETTLE_DUR +
  CFG.RISE_DUR;
const FAILSAFE_MS = (REAL_TOTAL + CFG.FAILSAFE_BUFFER) * 1000;

const DOT_STATES = [".", "..", "...", ""];
const REVEAL_EVENT = "ma:loader:reveal";
const dispatchReveal = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(REVEAL_EVENT));
};

export function LandingIntro() {
  const rootRef = useRef<HTMLElement | null>(null);
  const doneRef = useRef(false);
  const revealDispatchedRef = useRef(false);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (reduced) {
      setVisible(false);
      return;
    }
    const el = rootRef.current;
    if (!el) return;
    doneRef.current = false;
    revealDispatchedRef.current = false;

    const patternCell = el.querySelector<HTMLElement>("[data-preloader-pattern]");
    const percentEl = el.querySelector<HTMLElement>("[data-preloader-percent]");
    const overlayEl = el.querySelector<HTMLElement>("[data-preloader-overlay]");
    const cardLeft = el.querySelector<HTMLElement>('[data-preloader-card="left"]');
    const cardRight = el.querySelector<HTMLElement>('[data-preloader-card="right"]');
    const cardLeftHead = cardLeft?.querySelector<HTMLElement>(".card-head") ?? null;
    const cardLeftIllu = cardLeft?.querySelector<HTMLElement>(".card-illu") ?? null;
    const cardRightHead = cardRight?.querySelector<HTMLElement>(".card-head") ?? null;
    const cardRightIllu = cardRight?.querySelector<HTMLElement>(".card-illu") ?? null;

    if (
      !patternCell ||
      !percentEl ||
      !overlayEl ||
      !cardLeftHead ||
      !cardLeftIllu ||
      !cardRightHead ||
      !cardRightIllu
    ) {
      return;
    }

    const parentRect = el.getBoundingClientRect();
    const patternRect = patternCell.getBoundingClientRect();

    gsap.set(overlayEl, {
      top: patternRect.top - parentRect.top,
      left: patternRect.left - parentRect.left,
      width: patternRect.width,
      height: patternRect.height,
    });

    const dots = Array.from(
      el.querySelectorAll<HTMLElement>("[data-preloader-dots]")
    );
    let dotsI = 0;
    const dotsTimer = setInterval(() => {
      dotsI = (dotsI + 1) % DOT_STATES.length;
      dots.forEach((d) => {
        d.textContent = DOT_STATES[dotsI];
      });
    }, CFG.DOT_INTERVAL_MS);

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      requestAnimationFrame(() => setVisible(false));
    };

    const fireReveal = () => {
      if (revealDispatchedRef.current) return;
      revealDispatchedRef.current = true;
      dispatchReveal();
    };

    const fillState = { v: 0 };
    const masterTl = gsap.timeline({ onComplete: finish });

    masterTl.to(
      fillState,
      {
        v: 100,
        duration: CFG.FILL_DUR,
        ease: fakeLoadEase,
        onUpdate: () => {
          const v = fillState.v;
          patternCell.style.setProperty("--preloader-load", (v / 100).toFixed(4));
          percentEl.textContent = Math.round(v) + "%";
        },
      },
      0
    );

    masterTl.addLabel("revealStart", CFG.FILL_DUR);

    masterTl.set(overlayEl, { display: "flex" }, "revealStart");
    masterTl.set(patternCell, { autoAlpha: 0 }, "revealStart");
    masterTl.call(
      () => {
        clearInterval(dotsTimer);
      },
      undefined,
      "revealStart"
    );

    masterTl.to(
      overlayEl,
      {
        left: 0,
        width: parentRect.width,
        duration: CFG.SQUEEZE_DUR,
        ease: "cctpOut",
      },
      "revealStart"
    );

    masterTl.to(
      [cardLeftHead, cardLeftIllu, cardRightHead, cardRightIllu],
      {
        y: "80%",
        autoAlpha: 0,
        duration: CFG.CARD_DOWN_DUR,
        stagger: CFG.CARD_DOWN_STAGGER,
        ease: "cctpOut",
      },
      "revealStart+=0.1"
    );

    masterTl.to(
      overlayEl,
      {
        top: 0,
        height: parentRect.height,
        duration: CFG.PATTERN_DOWN_DUR,
        ease: "cctpOut",
      },
      ">-0.1"
    );

    masterTl.to({}, { duration: CFG.SETTLE_DUR });

    masterTl.addLabel("riseStart");

    masterTl.call(fireReveal, undefined, "riseStart");

    masterTl.to(
      el,
      {
        yPercent: -100,
        duration: CFG.RISE_DUR,
        ease: "cctpOut",
      },
      "riseStart"
    );

    const failsafeTimer = setTimeout(() => {
      if (doneRef.current) return;
      fireReveal();
      masterTl.kill();
      finish();
    }, FAILSAFE_MS);

    return () => {
      masterTl.kill();
      clearInterval(dotsTimer);
      clearTimeout(failsafeTimer);
      gsap.set(el, { clearProps: "all" });
      gsap.set(
        [
          patternCell,
          overlayEl,
          cardLeftHead,
          cardLeftIllu,
          cardRightHead,
          cardRightIllu,
        ],
        { clearProps: "all" }
      );
    };
  }, [mounted, reduced]);

  if (!mounted || !visible) return null;

  return (
    <section
      ref={rootRef}
      className="landing-hero"
      aria-label="Loading — Mohammad Azman"
    >
      <div className="preloader__grid">
        <div className="preloader__cell preloader__brand">
          <div className="preloader__head">
            <div className="preloader__logo">// MA</div>
            <div className="preloader__status">
              <span>// PLEASE WAIT</span>
              <span>
                // LOADING<span data-preloader-dots>.</span>
              </span>
            </div>
          </div>
        </div>

        <div className="preloader__cell preloader__pattern" data-preloader-pattern>
          <div className="preloader__fill" />
          <div className="preloader__progress">
            <span className="preloader__square" />
            <span data-preloader-percent className="preloader__percent">
              0%
            </span>
          </div>
        </div>

        <div className="preloader__cell preloader__card" data-preloader-card="left">
          <div className="card-head">
            <div className="annotation">
              <span className="annotation__dot" />
              <span className="annotation__text">
                // INITIALIZING<span data-preloader-dots>.</span>
              </span>
            </div>
          </div>
          <div className="card-illu" data-preloader-illu="left">
            <div className="shape-mark shape-mark--left" />
          </div>
        </div>

        <div className="preloader__cell preloader__card" data-preloader-card="right">
          <div className="card-head">
            <div className="annotation">
              <span className="annotation__dot" />
              <span className="annotation__text">
                // CALIBRATING<span data-preloader-dots>.</span>
              </span>
            </div>
          </div>
          <div className="card-illu" data-preloader-illu="right">
            <div className="shape-mark shape-mark--right" />
          </div>
        </div>
      </div>

      <div
        className="preloader__overlay"
        data-preloader-overlay
        aria-hidden="true"
      >
        <div className="preloader__overlay-fill" />
        <div className="preloader__progress">
          <span className="preloader__square" />
          <span
            data-preloader-overlay-percent
            className="preloader__percent"
          >
            {CFG.READY_LABEL}
          </span>
        </div>
      </div>
    </section>
  );
}
