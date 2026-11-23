"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Matches `scroll-padding-top` on <html>, so anchors land below the fixed navbar.
const NAV_OFFSET = -104;

let lenis: Lenis | null = null;

/** Scrolls to an element through the smooth scroller when it is running. */
export function scrollToElement(element: HTMLElement) {
  if (lenis) {
    lenis.scrollTo(element, { offset: NAV_OFFSET });
    return;
  }
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  element.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

/**
 * Eases wheel and keyboard scrolling on public pages. Touch scrolling stays
 * native, and the page position is still the real scroll offset, so the
 * scroll-driven section animations keep working.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const start = () => {
      if (lenis || reduceMotion.matches) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        anchors: { offset: NAV_OFFSET },
        stopInertiaOnNavigate: true,
      });
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
    };
    const onPreferenceChange = () => (reduceMotion.matches ? stop() : start());

    start();
    reduceMotion.addEventListener("change", onPreferenceChange);
    return () => {
      reduceMotion.removeEventListener("change", onPreferenceChange);
      stop();
    };
  }, [isAdmin]);

  // A new page has a new height; without this the scroll limit stays stale.
  useEffect(() => {
    lenis?.resize();
  }, [pathname]);

  return null;
}
