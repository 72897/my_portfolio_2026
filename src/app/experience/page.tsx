"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll } from "framer-motion";
import {
  Briefcase,
  MapPin,
  Calendar,
} from "lucide-react";
import { experiences as fallbackExp } from "@/lib/constants";
import type { IExperience } from "@/types";

export default function ExperiencePage() {
  const [exps, setExps] = useState<IExperience[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  useEffect(() => {
    async function fetchExps() {
      try {
        const res = await fetch("/api/experience");
        if (res.ok) {
          const data = await res.json();
          const array = Array.isArray(data) ? data : (data.experiences || data);
          
          // Sort by order ascending if provided
          const sorted = [...array].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setExps(sorted);
        } else {
          setExps(fallbackExp as IExperience[]);
        }
      } catch {
        setExps(fallbackExp as IExperience[]);
      } finally {
        setLoading(false);
      }
    }
    fetchExps();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-card/5 grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)] text-foreground">
              Work <span className="gradient-text">Experience</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              My professional journey and contributions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 border-t border-border">
        <div ref={containerRef} className="max-w-3xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="space-y-8">
              {[1, 2].map((n) => (
                <div key={n} className="h-40 rounded-xl bg-card border border-border animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="relative pl-6 space-y-12 ml-2">
              {/* Background timeline line */}
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border" />
              {/* Animated scroll progress timeline line */}
              <motion.div
                className="absolute left-0 top-0 w-[1px] bg-primary origin-top"
                style={{ scaleY: scrollYProgress }}
              />
              {exps.map((exp, i) => {
                // Format display dates
                const startStr = exp.startDate ? new Date(exp.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) : '';
                const endStr = exp.current 
                  ? 'Present' 
                  : exp.endDate 
                    ? new Date(exp.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }) 
                    : '';

                return (
                  <motion.div
                    key={exp._id || `${exp.company}-${exp.role}`}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-background" />

                    <div className="flex flex-col gap-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                        <h3 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground flex items-center gap-2">
                          {exp.role}
                        </h3>
                        <span className="text-xs text-muted-foreground font-medium">
                          {startStr || exp.startDate} – {endStr || exp.endDate}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-primary font-[family-name:var(--font-body)]">
                        {exp.company} <span className="text-muted-foreground/30">•</span> {exp.location}
                      </p>

                      {/* Bullets */}
                      <ul className="mt-3 space-y-2 list-disc pl-4 text-sm text-muted-foreground leading-relaxed">
                        {exp.bullets?.map((bullet, idx) => (
                          <li key={idx}>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      {/* Tech badges */}
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {exp.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
