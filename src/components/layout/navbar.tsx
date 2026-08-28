"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Code2, Menu, X, Terminal, Volume2, VolumeX, Search } from "lucide-react";
import { navLinks } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";
import { soundManager } from "@/lib/sounds";
import { Magnetic } from "@/components/effects/magnetic";

const primaryLinks = navLinks.filter((link) =>
  ["/about", "/skills", "/experience", "/projects", "/github", "/leetcode", "/certificates", "/blog"].includes(link.href)
);

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setSoundEnabled(soundManager.isEnabled());
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 24);
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 96);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  const openCommandPalette = () => {
    window.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  const openTerminal = () => {
    window.dispatchEvent(new CustomEvent("open-terminal-modal"));
  };

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -96 }}
        animate={{ y: isVisible ? 0 : -96 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 pointer-events-none"
      >
        <nav
          aria-label="Primary navigation"
          className={cn(
            "nav-shell mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4 pointer-events-auto",
            isScrolled && "nav-shell--scrolled"
          )}
        >
          <Link 
            href="/" 
            onClick={() => soundManager.playClick()}
            className="group flex items-center gap-2.5" 
            aria-label="Kunal Singh home"
          >
            <span className="brand-mark">
              <Code2 size={17} aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-bold tracking-[-0.03em] sm:inline">
              Kunal<span className="text-primary">/</span>Singh
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => soundManager.playClick()}
                  onMouseEnter={() => soundManager.playPop()}
                  className={cn(
                    "nav-link relative rounded-lg px-3 py-2 text-xs font-semibold",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                  {active ? (
                    <motion.span
                      layoutId="navbar-indicator"
                      className="absolute inset-x-3 -bottom-1 h-px rounded-full bg-primary shadow-[0_0_10px_var(--color-primary)]"
                    />
                  ) : null}
                </Link>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Search Command Palette Trigger */}
            <button
              type="button"
              onClick={openCommandPalette}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-muted/40 hover:bg-muted/70 border border-border/40 text-xs text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="Search & Commands (⌘K)"
              aria-label="Search & Commands (⌘K)"
            >
              <Search size={13} className="text-primary" />
              <span className="text-[11px] font-medium">Search</span>
              <kbd className="text-[9px] font-mono bg-background px-1.5 py-0.2 rounded border border-border/60">⌘K</kbd>
            </button>

            {/* Interactive Terminal Trigger */}
            <button
              type="button"
              onClick={openTerminal}
              className="grid size-9 place-items-center rounded-xl border border-border/30 bg-card/40 hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              title="Developer Terminal (~)"
              aria-label="Developer Terminal (~)"
            >
              <Terminal size={15} className="text-emerald-400" />
            </button>

            {/* Sound Toggle */}
            <button
              type="button"
              onClick={toggleSound}
              className="grid size-9 place-items-center rounded-xl border border-border/30 bg-card/40 hover:bg-muted text-muted-foreground hover:text-foreground transition cursor-pointer"
              title={soundEnabled ? "Mute audio" : "Enable audio"}
              aria-label="Toggle UI sound effects"
            >
              {soundEnabled ? (
                <Volume2 size={15} className="text-primary" />
              ) : (
                <VolumeX size={15} className="text-muted-foreground" />
              )}
            </button>

            <ThemeToggle />

            <Magnetic strength={0.2}>
              <Link
                href="/contact"
                onClick={() => soundManager.playClick()}
                className="nav-cta hidden sm:inline-flex"
              >
                Let&apos;s talk <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </Magnetic>

            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setIsMobileOpen((open) => !open);
              }}
              className="grid size-9 sm:size-11 place-items-center rounded-xl transition-colors hover:bg-muted lg:hidden"
              aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen ? (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="mobile-nav-panel fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] overflow-y-auto p-6 lg:hidden"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="eyebrow">Explore portfolio</span>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="grid size-11 place-items-center rounded-xl hover:bg-muted"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.025 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "flex min-h-12 items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold",
                        pathname === link.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      {link.name}
                      <ArrowUpRight size={14} aria-hidden="true" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
