"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import {
  Download,
  Mail,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Rocket,
  Code2,
  Award,
} from "lucide-react";
import { siteConfig, skillCategories, projects as staticProjects, experiences as fallbackExperiences } from "@/lib/constants";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { SectionHeader } from "@/components/shared/section-header";
import { ProjectCard } from "@/components/shared/project-card";
import { SkillCard } from "@/components/shared/skill-card";
import { AnimatedCounter } from "@/components/shared/animated-counter";

const Hero3DLogo = dynamic(
  () => import("@/components/effects/hero-3d-logo").then((mod) => mod.Hero3DLogo),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full border border-dashed border-primary/30 border-t-primary animate-spin" />
      </div>
    ),
  }
);

const stats = [
  { icon: Briefcase, label: "Internships", value: 3, suffix: "" },
  { icon: Rocket, label: "Projects", value: 4, suffix: "+" },
  { icon: Code2, label: "Problems Solved", value: 150, suffix: "+" },
  { icon: Award, label: "Certificates", value: 6, suffix: "+" },
];

export default function HomePage() {
  const featuredProjects = staticProjects.filter((p) => p.featured);
  const [exps, setExps] = useState<any[]>([]);
  const [loadingExps, setLoadingExps] = useState(true);
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
          const sorted = [...array].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setExps(sorted);
        } else {
          setExps(fallbackExperiences);
        }
      } catch {
        setExps(fallbackExperiences);
      } finally {
        setLoadingExps(false);
      }
    }
    fetchExps();
  }, []);

  return (
    <div className="relative min-h-screen">
      {/* ── Hero Section ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center py-16 md:py-20 px-4 sm:px-6 grid-pattern">
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left — Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <span className="anime-badge w-fit">
                AI Engineer & Developer
              </span>

              {/* Name */}
              <h1 className="gradient-text font-[family-name:var(--font-heading)] text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight">
                Kunal
                <br />
                Singh
              </h1>

              {/* Type animation */}
              <div className="text-lg sm:text-xl md:text-2xl text-muted-foreground h-10 flex items-center gap-2">
                <span className="text-primary font-mono">▸</span>
                <TypeAnimation
                  sequence={[
                    "AI Engineer",
                    2000,
                    "Full Stack Developer",
                    2000,
                    "Problem Solver",
                    2000,
                    "Tech Innovator",
                    2000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  className="font-semibold text-foreground"
                />
              </div>

              {/* Bio */}
              <p className="text-muted-foreground text-sm sm:text-base max-w-lg leading-relaxed">
                Specializing in Generative AI workflows, LangChain prompt
                orchestration, and robust full-stack web platforms.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href={siteConfig.links.resume}
                  download
                  className="anime-btn cursor-pointer inline-flex items-center gap-2"
                >
                  <Download size={16} />
                  Download Resume
                </a>
                <Link
                  href="/contact"
                  className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
                >
                  <Mail size={16} />
                  Contact Me
                </Link>
              </div>
            </motion.div>

            {/* Right — 3D Character */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="flex items-center justify-center min-h-[350px] lg:min-h-[450px] relative"
            >
              <Hero3DLogo />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="py-16 relative z-10 border-t border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.05}>
                <div className="anime-card rounded-xl p-6 text-center flex flex-col items-center gap-2 hover:border-primary/45 transition-colors duration-300">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-xs sm:text-sm text-muted-foreground font-medium tracking-wide">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Experience Section ── */}
      <section className="py-20 border-t border-border relative z-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <SectionHeader
              title="Work Experience"
              subtitle="Internships and professional roles in software development and AI engineering."
            />
          </ScrollReveal>

          <div ref={containerRef} className="mt-12">
            {loadingExps ? (
              <div className="space-y-6">
                {[1, 2].map((n) => (
                  <div key={n} className="h-24 rounded-xl bg-card animate-shimmer border border-border" />
                ))}
              </div>
            ) : (
              <div className="relative pl-6 space-y-10 ml-2">
                {/* Background timeline line */}
                <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-border" />
                {/* Animated scroll progress timeline line */}
                <motion.div
                  className="absolute left-0 top-0 w-[1px] bg-primary origin-top"
                  style={{ scaleY: scrollYProgress }}
                />
                {exps.map((exp, i) => {
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
                          <h4 className="text-lg font-bold text-foreground font-[family-name:var(--font-heading)]">
                            {exp.role}
                          </h4>
                          <span className="text-xs text-muted-foreground font-medium">
                            {startStr || exp.startDate} – {endStr || exp.endDate}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-primary">
                          {exp.company} <span className="text-muted-foreground/30">•</span> {exp.location}
                        </p>
                        
                        <ul className="mt-2 text-xs sm:text-sm text-muted-foreground space-y-1.5 list-disc pl-4">
                          {exp.bullets?.slice(0, 2).map((b: string, idx: number) => (
                            <li key={idx}>
                              <span>{b}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {exp.technologies?.map((tech: string) => (
                            <span key={tech} className="text-[10px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium border border-border">
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

          <div className="mt-12 text-center">
            <ScrollReveal>
              <Link
                href="/experience"
                className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
              >
                View Full Timeline
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Featured Projects ── */}
      <section className="py-20 relative z-10 border-t border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <SectionHeader
              title="Featured Projects"
              subtitle="Selected builds showcasing AI pipelines, vector search retrieval, and full-stack architectures."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {featuredProjects.map((project, i) => (
              <ScrollReveal key={project.slug} delay={i * 0.05}>
                <ProjectCard
                  title={project.title}
                  slug={project.slug}
                  description={project.description}
                  techStack={project.techStack}
                  category={project.category}
                  githubUrl={project.githubUrl}
                  liveUrl={project.liveUrl}
                  featured={project.featured}
                />
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ScrollReveal>
              <Link
                href="/projects"
                className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
              >
                View All Projects
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Tech Stack Preview ── */}
      <section className="py-20 border-t border-border relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <SectionHeader
              title="Core Technologies"
              subtitle="Frameworks, languages, and tools powering every build."
            />
          </ScrollReveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-12">
            {Array.from(
              new Map(
                skillCategories
                  .flatMap((cat) => cat.skills)
                  .map((s) => [s.name, s])
              ).values()
            )
              .slice(0, 15)
              .map((skill, i) => (
                <ScrollReveal key={skill.name} delay={i * 0.02}>
                  <SkillCard name={skill.name} icon={skill.icon} />
                </ScrollReveal>
              ))}
          </div>

          <div className="mt-12 text-center">
            <ScrollReveal>
              <Link
                href="/skills"
                className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
              >
                Explore All Skills
                <ArrowRight size={16} />
              </Link>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 border-t border-border relative z-10 bg-card/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <ScrollReveal>
            <div className="anime-card rounded-2xl p-8 md:p-14 text-center relative overflow-hidden">
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight text-foreground">
                  Let&apos;s Build Something
                  <br />
                  Amazing
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base mt-4 max-w-xl mx-auto">
                  Open to collaborations, engineering discussions, and
                  opportunities. Let&apos;s connect and create something
                  impactful together.
                </p>
                <div className="flex flex-wrap gap-4 justify-center mt-8">
                  <Link
                    href="/contact"
                    className="anime-btn cursor-pointer inline-flex items-center gap-2"
                  >
                    <Mail size={16} />
                    Contact Me
                  </Link>
                  <a
                    href={siteConfig.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
                  >
                    <ExternalLink size={16} />
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
