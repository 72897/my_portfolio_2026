"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowDown, ArrowUp } from "lucide-react";

export function ScrollNavButton() {
  const [isBottom, setIsBottom] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      
      // Show button only after scrolling down 200px
      setIsVisible(scrolled > 200);

      // Check if user is near the bottom of the page
      const threshold = 120;
      const position = window.innerHeight + scrolled;
      const height = document.documentElement.scrollHeight;
      setIsBottom(position >= height - threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = () => {
    if (isBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const sections = Array.from(document.querySelectorAll("section"));
      if (sections.length === 0) {
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: "smooth" });
        return;
      }

      const currentScroll = window.scrollY;
      const viewportCenter = currentScroll + window.innerHeight * 0.35; // Target offset
      
      const nextSection = sections.find((section) => {
        const rect = section.getBoundingClientRect();
        const absoluteTop = rect.top + currentScroll;
        return absoluteTop > viewportCenter + 15;
      });

      if (nextSection) {
        nextSection.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
      }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={handleClick}
          initial={{ opacity: 0, scale: 0.8, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 15 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full bg-card hover:bg-card/90 text-foreground border border-border shadow-lg flex items-center justify-center cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
          aria-label={isBottom ? "Scroll to top" : "Scroll to next section"}
        >
          {isBottom ? (
            <ArrowUp className="w-5 h-5 text-primary" />
          ) : (
            <ArrowDown className="w-5 h-5 text-primary" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
