"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Galaxy from "./galaxy";

export function AnimeBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Quiet Background Orb — Satoshi Cobalt Blue */}
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.02] dark:opacity-[0.03]"
        style={{
          background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)",
          top: "-10%",
          left: "50%",
          transform: "translateX(-50%)",
          filter: "blur(100px)",
        }}
      />

      {/* Dot grid pattern */}
      <div className="anime-grid" />

      {/* Interactive Galaxy Starfield in Dark Mode */}
      {mounted && isDark && (
        <div className="absolute inset-0 opacity-[0.3] mix-blend-screen">
          <Galaxy 
            mouseRepulsion={true}
            mouseInteraction={true}
            density={0.8}
            glowIntensity={0.4}
            saturation={0.6}
            hueShift={220}
            twinkleIntensity={0.4}
            rotationSpeed={0.03}
          />
        </div>
      )}
    </div>
  );
}
