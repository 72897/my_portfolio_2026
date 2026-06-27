"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll } from "framer-motion";
import {
  GraduationCap,
  MapPin,
  Calendar,
  Target,
  Lightbulb,
  Users,
  TrendingUp,
  BookOpen,
} from "lucide-react";
import { siteConfig, education } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 1000;
          const steps = 40;
          const stepTime = duration / steps;
          let current = 0;
          const increment = target / steps;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, stepTime);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const stats = [
    { label: "Projects Built", value: 10, suffix: "+", icon: Target },
    { label: "Technologies", value: 20, suffix: "+", icon: Lightbulb },
    { label: "Internships", value: 3, suffix: "", icon: Users },
    { label: "Certifications", value: 6, suffix: "+", icon: TrendingUp },
  ];

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
              About <span className="gradient-text">Me</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Get to know the person behind the code
            </p>
          </motion.div>
        </div>
      </section>

      {/* Professional Summary */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                Professional{" "}
                <span className="gradient-text">Summary</span>
              </h2>
              <div className="mt-6 space-y-4 text-muted-foreground text-base md:text-lg leading-relaxed">
                <p>
                  I&apos;m <strong className="text-foreground">{siteConfig.name}</strong>, an AI
                  Engineer and Full Stack Developer. I recently graduated with a B.Tech
                  in Computer Science from Gautam Buddha University, Greater Noida.
                </p>
                <p>
                  My passion lies at the intersection of Artificial Intelligence
                  and modern web development. I specialize in building
                  intelligent systems powered by LLMs, RAG pipelines, and
                  conversational AI, while crafting performant, user-centric
                  full-stack applications with React, Node.js, and Next.js.
                </p>
                <p>
                  With hands-on experience at organizations like Thales Group,
                  Manipal Business Solutions, and MI Matdar, I&apos;ve delivered
                  production-ready AI platforms, automated business workflows,
                  and built scalable web applications that create real impact.
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="anime-card rounded-xl p-6 text-center group"
                >
                  <stat.icon className="w-5 h-5 mx-auto mb-3 text-primary" />
                  <p className="text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground font-medium">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Education */}
      <section className="py-20 border-t border-border bg-card/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Education"
            subtitle="My academic background and foundations"
          />

          <div ref={containerRef} className="relative pl-6 space-y-10 ml-2 mt-12">
            {/* Background timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border" />
            {/* Animated scroll progress timeline line */}
            <motion.div
              className="absolute left-0 top-0 w-[1px] bg-primary origin-top"
              style={{ scaleY: scrollYProgress }}
            />
            {education.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[30px] top-1.5 w-3 h-3 rounded-full bg-primary border-4 border-background" />

                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
                      {edu.degree}
                    </h3>
                    <span className="text-xs text-muted-foreground font-medium">
                      {edu.period}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-primary font-[family-name:var(--font-body)]">
                    {edu.institution} {edu.location && <><span className="text-muted-foreground/30"> • </span> {edu.location}</>}
                  </p>

                  {edu.coursework && edu.coursework.length > 0 && (
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-1.5">
                        {edu.coursework.map((course) => (
                          <span
                            key={course}
                            className="text-[10px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium border border-border"
                          >
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Goals */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Career Goals"
            subtitle="Where I'm headed and what drives me"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                title: "AI Innovation",
                desc: "Build production-grade AI systems that leverage LLMs, RAG, and agentic workflows to solve real-world problems at scale.",
                icon: Lightbulb,
              },
              {
                title: "Full Stack Mastery",
                desc: "Architect end-to-end web applications using modern frameworks, serverless infrastructure, and best DevOps practices.",
                icon: Target,
              },
              {
                title: "Community Impact",
                desc: "Contribute to open-source projects, mentor aspiring developers, and share knowledge through writing and talks.",
                icon: Users,
              },
            ].map((goal, i) => (
              <motion.div
                key={goal.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="anime-card rounded-xl p-8"
              >
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mb-4">
                  <goal.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] text-foreground">
                  {goal.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {goal.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
