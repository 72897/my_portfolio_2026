"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Code2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const primaryLinks = [
  { name: "About", href: "/about" },
  { name: "Experience", href: "/experience" },
  { name: "Projects", href: "/projects" },
  { name: "Skills", href: "/skills" },
  { name: "Resume", href: "/resume" },
];

const moreLinks = [
  { name: "Certificates", href: "/certificates" },
  { name: "GitHub", href: "/github" },
  { name: "LeetCode", href: "/leetcode" },
  { name: "Blog", href: "/blog" },
];

const contactLink = { name: "Contact", href: "/contact" };

// The nav pill and the mobile panel are cream in both themes (globals.css),
// so the menus inside them use fixed dark-on-cream colours, not theme tokens.
const mobileLinks = [
  { name: "Home", href: "/" },
  ...primaryLinks,
  ...moreLinks,
  contactLink,
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const visible = currentScrollY < lastScrollY || currentScrollY < 96;
      setIsScrolled(currentScrollY > 24);
      setIsVisible(visible);
      if (!visible) setIsMoreOpen(false);
      lastScrollY = currentScrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (!isMoreOpen && !isMobileOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMoreOpen(false);
        setIsMobileOpen(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (!moreRef.current?.contains(event.target as Node)) setIsMoreOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [isMoreOpen, isMobileOpen]);

  if (pathname.startsWith("/admin")) return null;

  const moreActive = moreLinks.some((link) => isActive(pathname, link.href));

  return (
    <>
      <motion.header
        initial={false}
        animate={{ y: isVisible ? 0 : -96 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 print:hidden"
      >
        <nav
          aria-label="Primary"
          className={cn(
            "nav-shell pointer-events-auto mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-4",
            isScrolled && "nav-shell--scrolled"
          )}
        >
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Kunal Singh, home">
            <span className="brand-mark">
              <Code2 size={17} aria-hidden="true" />
            </span>
            <span className="hidden text-sm font-bold tracking-[-0.03em] sm:inline">
              Kunal<span className="text-primary">/</span>Singh
            </span>
          </Link>

          <div className="hidden items-center gap-1 lg:flex">
            {primaryLinks.map((link) => {
              const active = isActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "nav-link relative rounded-lg px-3 py-2 text-xs font-semibold",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-1 h-px rounded-full bg-primary" />
                  ) : null}
                </Link>
              );
            })}

            <div ref={moreRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((open) => !open)}
                aria-expanded={isMoreOpen}
                aria-controls="nav-more-menu"
                className={cn(
                  "nav-link relative inline-flex cursor-pointer items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold",
                  moreActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                More
                <ChevronDown
                  size={13}
                  aria-hidden="true"
                  className={cn("transition-transform", isMoreOpen && "rotate-180")}
                />
                {moreActive ? (
                  <span className="absolute inset-x-3 -bottom-1 h-px rounded-full bg-primary" />
                ) : null}
              </button>
              {isMoreOpen ? (
                <ul
                  id="nav-more-menu"
                  className="absolute right-0 top-full mt-3 w-44 rounded-2xl border border-black/10 bg-[#fffdf8] p-1.5 shadow-xl"
                >
                  {moreLinks.map((link) => {
                    const active = isActive(pathname, link.href);
                    return (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMoreOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "nav-link block rounded-lg px-3 py-2 text-xs font-semibold",
                            active && "bg-black/5 text-foreground"
                          )}
                        >
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />

            <Link href={contactLink.href} className="nav-cta hidden sm:inline-flex">
              {contactLink.name}
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className="grid size-11 cursor-pointer place-items-center rounded-xl transition-colors hover:bg-black/5 lg:hidden"
              aria-label={isMobileOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav"
            >
              {isMobileOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {isMobileOpen ? (
          <>
            <motion.div
              aria-hidden="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-md lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.nav
              id="mobile-nav"
              aria-label="Mobile"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              data-lenis-prevent
              className="mobile-nav-panel fixed inset-y-0 right-0 z-50 w-[min(88vw,360px)] overflow-y-auto p-6 lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-bold">Menu</span>
                <button
                  type="button"
                  onClick={() => setIsMobileOpen(false)}
                  className="grid size-11 cursor-pointer place-items-center rounded-xl hover:bg-black/5"
                  aria-label="Close navigation menu"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>
              <ul className="flex flex-col gap-1">
                {mobileLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setIsMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex min-h-12 items-center rounded-xl px-4 py-3 text-sm font-semibold",
                          active
                            ? "bg-black/10 text-[#181818]"
                            : "text-[#181818]/70 hover:bg-black/5 hover:text-[#181818]"
                        )}
                      >
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.nav>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
