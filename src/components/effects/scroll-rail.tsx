"use client";

import { useEffect, useState } from "react";
import { soundManager } from "@/lib/sounds";

interface SectionItem {
  id: string;
  label: string;
}

const SECTIONS: SectionItem[] = [
  { id: "hero", label: "Top" },
  { id: "story", label: "Build Path" },
  { id: "about", label: "About" },
  { id: "experience", label: "Journey" },
  { id: "services", label: "Capabilities" },
  { id: "playground", label: "AI Twin" },
  { id: "rag-simulator", label: "RAG Demo" },
  { id: "projects", label: "Projects" },
  { id: "signal", label: "Signal" },
  { id: "contact", label: "Contact" },
];

export function ScrollRail() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = totalHeight > 0 ? (currentScroll / totalHeight) * 100 : 0;
      setScrollProgress(progress);

      // Determine active section
      const scrollPos = window.scrollY + 300;
      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPos >= top) {
            setActiveSection(SECTIONS[i].id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    soundManager.playClick();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <aside
      aria-label="Section Navigation Rail"
      className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-3 p-2 rounded-full bg-card/40 border border-border/40 backdrop-blur-md shadow-lg"
    >
      {/* Scroll track fill bar */}
      <div className="absolute left-1/2 -translate-x-1/2 top-3 bottom-3 w-[1.5px] bg-border/40 -z-10">
        <div
          className="w-full bg-primary transition-all duration-150 rounded-full"
          style={{ height: `${scrollProgress}%` }}
        />
      </div>

      {SECTIONS.map((sec) => {
        const isActive = activeSection === sec.id;
        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            aria-label={`Scroll to ${sec.label}`}
            className="group relative flex items-center justify-center p-1.5 focus:outline-none"
          >
            {/* Indicator Dot / Pill */}
            <span
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "w-2.5 h-6 bg-primary shadow-sm shadow-primary/50"
                  : "w-2 h-2 bg-muted-foreground/40 hover:bg-foreground hover:scale-125"
              }`}
            />

            {/* Hover Tooltip */}
            <span className="pointer-events-none absolute right-7 rounded-md bg-popover/90 px-2 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-popover-foreground border border-border/60 shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 whitespace-nowrap">
              {sec.label}
            </span>
          </button>
        );
      })}
    </aside>
  );
}
