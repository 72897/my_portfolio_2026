"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Award,
  Briefcase,
  Check,
  Code2,
  Copy,
  Cpu,
  Database,
  Download,
  ExternalLink,
  GitBranch,
  Globe,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  Rocket,
  Server,
  Sliders,
  Terminal,
} from "lucide-react";
import { AiPlayground } from "@/components/effects/ai-playground";
import { Magnetic } from "@/components/effects/magnetic";
import { RagVisualizer } from "@/components/effects/rag-visualizer";
import { ScrollRail } from "@/components/effects/scroll-rail";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { Github, Linkedin } from "@/components/shared/brand-icons";
import { ProjectPreviewVisual } from "@/components/shared/project-preview-visual";
import { usePortfolio } from "@/hooks/usePortfolio";
import { education as fallbackEducation, siteConfig } from "@/lib/constants";

const stats = [
  { icon: Briefcase, label: "Work roles", value: 4, suffix: "", note: "AI + full-stack delivery" },
  { icon: Rocket, label: "Projects shipped", value: 6, suffix: "+", note: "case-study ready builds" },
  { icon: Code2, label: "DSA problems", value: 200, suffix: "+", note: "algorithmic fundamentals" },
  { icon: Award, label: "Certificates", value: 6, suffix: "+", note: "cloud, GenAI, APIs" },
];

const hiringTickerItems = [
  "Available for freelance projects",
  "Open to AI & full-stack roles",
  "RAG systems",
  "Agentic workflows",
  "MERN + Next.js",
  "Admin panels",
  "Automation systems",
  "Remote-ready from India",
];

const workflow = [
  {
    eyebrow: "01 / Discovery",
    title: "Turn messy product ideas into an executable system map.",
    body: "I start by making the data, users, failure states, and measurable constraints visible before writing code.",
    icon: Layers3,
  },
  {
    eyebrow: "02 / Build",
    title: "Ship the backend, AI pipeline, and interface as one connected product.",
    body: "RAG, agents, APIs, auth, databases, and UI states are designed together so the experience feels stable end-to-end.",
    icon: GitBranch,
  },
  {
    eyebrow: "03 / Harden",
    title: "Instrument the details that separate demos from production.",
    body: "Latency budgets, fallback flows, prompt boundaries, loading states, and deployment checks make the product easier to trust.",
    icon: Server,
  },
];

const capabilities = [
  {
    title: "AI product MVPs",
    description:
      "Turn an AI idea into a usable product with scoped flows, model integration, auth, admin controls, and polished UX.",
    icon: Cpu,
    points: ["RAG systems", "LLM apps", "MVP delivery"],
  },
  {
    title: "Full-time engineering",
    description:
      "Join product teams as an AI/full-stack engineer who can ship frontend, backend, database models, and production UI.",
    icon: Globe,
    points: ["Next.js", "Node APIs", "MongoDB"],
  },
  {
    title: "Automation systems",
    description:
      "Build workflow tools for lead ops, reporting, reminders, notifications, CRM updates, and repetitive business tasks.",
    icon: Database,
    points: ["Internal tools", "Integrations", "Dashboards"],
  },
  {
    title: "Production handoff",
    description:
      "Package projects with clean deployment, environment setup, docs, performance checks, and maintainable ownership.",
    icon: Terminal,
    points: ["Vercel", "Docs", "Handoff"],
  },
];

const engineeringSignals = [
  {
    title: "Readable systems",
    body: "Every featured project is structured around the problem, architecture, constraints, and measurable outcome.",
    meta: "Case studies",
    icon: Code2,
  },
  {
    title: "AI with boundaries",
    body: "LLM features are treated like production surfaces: context windows, fallback paths, retrieval quality, and cost all matter.",
    meta: "GenAI / RAG",
    icon: Cpu,
  },
  {
    title: "Interface craft",
    body: "The UI is now editorial, restrained, and content-first while keeping the interactive demos that make the portfolio memorable.",
    meta: "UX system",
    icon: Sliders,
  },
];

export default function HomePage() {
  const { data } = usePortfolio();
  const { profile, experience, projects, education } = data;
  const [copied, setCopied] = useState(false);
  const [briefCopied, setBriefCopied] = useState(false);

  const sortedProjects = useMemo(
    () =>
      [...projects].sort((a, b) => {
        if (a.highlight && !b.highlight) return -1;
        if (!a.highlight && b.highlight) return 1;
        return b.year.localeCompare(a.year);
      }),
    [projects]
  );

  const featuredProjects = sortedProjects.slice(0, 4);
  const hiringBrief = useMemo(
    () =>
      `# HIRE_KUNAL.md

Candidate: ${profile.name || "Kunal Singh"}
Role fit: AI Engineer - Full Stack Developer
Location: ${profile.location || "India"} - remote-ready

Hire for:
- Freelance AI product MVPs
- RAG systems and LLM workflows
- MERN / Next.js web apps
- Admin panels, APIs, dashboards, and automations
- Full-time AI/full-stack engineering roles

Proof points:
- 6+ shipped projects
- 200+ DSA problems solved
- 6+ certificates
- Experience across GenAI, automation, and full-stack delivery

Contact:
- Email: ${profile.social.email || siteConfig.email}
- LinkedIn: ${profile.social.linkedin || siteConfig.links.linkedin}`,
    [
      profile.location,
      profile.name,
      profile.social.email,
      profile.social.linkedin,
    ]
  );
  const displayedEducation = [
    ...education,
    ...fallbackEducation.filter(
      (fallback) =>
        !education.some(
          (item) =>
            item.institution.toLowerCase() === fallback.institution.toLowerCase()
        )
    ),
  ].slice(0, 3);

  const handleCopyEmail = () => {
    const email = profile.social.email || siteConfig.email;
    void navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyHiringBrief = () => {
    void navigator.clipboard.writeText(hiringBrief);
    setBriefCopied(true);
    setTimeout(() => setBriefCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <ScrollRail />

      <section id="hero" className="editorial-hero scroll-mt-24">
        <div className="editorial-container hero-layout">
          <ScrollReveal>
            <div className="hero-copy-card flex max-w-4xl flex-col items-start text-left">
              <span className="editorial-eyebrow">
                <span className="status-dot" />
                Available for freelance projects - AI & full-stack roles
              </span>

              <h1 className="editorial-display mt-8">
                Hire me to build AI products.
              </h1>

              <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
                I&apos;m {profile.shortName || "Kunal"} - {profile.tagline}. I help freelance
                clients and hiring teams turn AI ideas into reliable products: RAG systems,
                automation workflows, admin panels, APIs, and polished web apps.
              </p>

              <div className="mt-8 flex flex-wrap justify-start gap-3">
                {profile.social.resume ? (
                  <Magnetic strength={0.18}>
                    <a
                      href={profile.social.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="anime-btn"
                    >
                      <Download size={16} />
                      Download resume
                    </a>
                  </Magnetic>
                ) : null}
                <Magnetic strength={0.18}>
                  <Link href="/contact" className="anime-btn-outline">
                    <Mail size={16} />
                    Hire me for freelance
                  </Link>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <Link href="/contact?type=company" className="anime-btn-outline">
                    <Briefcase size={16} />
                    Hire me full-time
                  </Link>
                </Magnetic>
                <Magnetic strength={0.18}>
                  <Link href="/blog" className="anime-btn-outline">
                    <Code2 size={16} />
                    Read blog
                  </Link>
                </Magnetic>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <motion.div
              className="hero-art-card"
              aria-label="Anime-inspired AI product engineering visual"
              role="img"
              initial={{ y: 18, rotate: 1.2 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="hero-art-card__label">
                <Code2 size={14} />
                AI product systems
              </div>
              <div className="hero-art-card__caption">
                <span>Portfolio mode</span>
                <strong>Anime energy, professional delivery.</strong>
              </div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      <section className="agent-ticker-section" aria-label="Hiring availability highlights">
        <div className="agent-ticker">
          <div className="agent-ticker__track">
            {[...hiringTickerItems, ...hiringTickerItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-section border-y border-border/70">
        <div className="editorial-container">
          <div className="proof-header">
            <span className="editorial-eyebrow">
              <Award size={14} />
              Proof in numbers
            </span>
            <h2>Signals clients and hiring teams can scan fast.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label} delay={index * 0.04}>
                <motion.div
                  className="editorial-stat-card"
                  whileHover={{ y: -6, rotateX: 2 }}
                  transition={{ type: "spring", stiffness: 260, damping: 24 }}
                >
                  <div className="mb-8 flex items-center justify-between">
                    <stat.icon size={19} className="text-muted-foreground" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="text-5xl font-black tracking-[-0.07em]">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em]">{stat.label}</p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{stat.note}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="story" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <div className="lg:sticky lg:top-28 lg:h-fit">
              <span className="editorial-eyebrow">
                <Terminal size={14} />
                Scroll-based build path
              </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                From brief to shipped product.
              </h2>
              <p className="mt-6 text-base leading-8 text-muted-foreground">
                For clients, I can scope and build a useful MVP. For companies, I bring
                AI engineering plus full-stack execution into one practical workflow.
              </p>
            </div>

            <div className="space-y-5">
              {workflow.map((item, index) => (
                <ScrollReveal key={item.title} delay={index * 0.05}>
                  <motion.article
                    className="editorial-feature-card"
                    whileHover={{ x: -6 }}
                    transition={{ type: "spring", stiffness: 250, damping: 25 }}
                  >
                    <div className="grid gap-8 md:grid-cols-[160px_1fr]">
                      <div>
                        <div className="editorial-icon">
                          <item.icon size={20} />
                        </div>
                        <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {item.eyebrow}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-3xl font-black leading-tight tracking-[-0.055em] md:text-4xl">
                          {item.title}
                        </h3>
                        <p className="mt-4 text-base leading-8 text-muted-foreground">{item.body}</p>
                      </div>
                    </div>
                  </motion.article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-20">
            <ScrollReveal>
              <motion.div
                className="editorial-portrait-card"
                whileInView={{ rotate: 0, scale: 1 }}
                initial={{ rotate: -1.5, scale: 0.97 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="editorial-orbit-mark">
                <Code2 size={72} strokeWidth={1.3} />
                </div>
                <div className="editorial-floating-note editorial-floating-note--one">
                  <span>Location</span>
                  <strong>{profile.location}</strong>
                </div>
                <div className="editorial-floating-note editorial-floating-note--two">
                  <span>Primary stack</span>
                  <strong>AI - Next.js - MERN</strong>
                </div>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.05}>
              <span className="editorial-eyebrow">
                <MapPin size={14} />
                About the engineer
              </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.95] tracking-[-0.07em] md:text-7xl">
                Available for freelance projects and product teams.
              </h2>
              <p className="mt-7 text-base leading-8 text-muted-foreground">{profile.bio}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {displayedEducation.map((edu) => (
                  <div key={edu.institution} className="editorial-mini-card">
                    <GraduationCap size={18} />
                    <h3>{edu.institution}</h3>
                    <p>{edu.degree}</p>
                    <span>{edu.period}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="experience" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="editorial-eyebrow mx-auto">
              <Briefcase size={14} />
              Work journey
            </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Practical delivery for real teams.
            </h2>
          </div>

          <div className="editorial-timeline">
            {experience.map((exp, index) => (
              <ScrollReveal key={`${exp.company}-${exp.role}`} delay={index * 0.04}>
                <article className="editorial-timeline-card">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        {exp.period} - {exp.type}
                      </p>
                      <h3 className="mt-3 text-3xl font-black tracking-[-0.055em]">{exp.role}</h3>
                      <p className="mt-1 text-sm font-semibold text-muted-foreground">
                        {exp.company} - {exp.location}
                      </p>
                    </div>
                    <span className="mono-pill">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="mt-6 text-base leading-8 text-muted-foreground">{exp.summary}</p>
                  <ul className="mt-6 grid gap-3 border-t border-border/70 pt-6 md:grid-cols-2">
                    {exp.highlights.slice(0, 4).map((highlight) => (
                      <li key={highlight} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="services" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="editorial-eyebrow">
                <Cpu size={14} />
                Hire me for
              </span>
              <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Clear ways I can help you ship.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                Pick the path that matches your need: freelance delivery, company role,
                automation buildout, or a clean production handoff.
              </p>
            </div>
            <Link href="/skills" className="anime-btn-outline w-fit">
              View skill architecture
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {capabilities.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.04}>
                <motion.article
                  className="editorial-capability-card"
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <div className="mb-10 flex items-center justify-between">
                    <div className="editorial-icon">
                      <item.icon size={20} />
                    </div>
                    <span className="font-mono text-xs text-muted-foreground">
                      /{String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black tracking-[-0.055em]">{item.title}</h3>
                  <p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p>
                  <div className="mt-7 flex flex-wrap gap-2">
                    {item.points.map((point) => (
                      <span key={point} className="mono-pill">{point}</span>
                    ))}
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="playground" className="editorial-section portfolio-demo-section scroll-mt-24">
        <div className="editorial-container">
          <div className="portfolio-demo-stage">
            <div className="portfolio-demo-header">
              <ScrollReveal>
                <span className="editorial-eyebrow">
                  <Sliders size={14} />
                  Interactive AI sandbox
                </span>
                <h2 className="mt-5 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                  Inspect the AI behavior before you hire.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p className="portfolio-demo-lede">
                  Clients can test the AI twin live, adjust model controls, and see
                  how I reason about LLM behavior beyond a polished homepage.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.08}>
              <div className="portfolio-demo-console">
                <AiPlayground />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="rag-simulator" className="editorial-section portfolio-demo-section scroll-mt-24">
        <div className="editorial-container">
          <div className="portfolio-demo-stage portfolio-demo-stage--inverse">
            <div className="portfolio-demo-header">
              <ScrollReveal>
                <span className="editorial-eyebrow">
                  <Database size={14} />
                  Retrieval walkthrough
                </span>
                <h2 className="mt-5 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                  Show the pipeline behind the answer.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <p className="portfolio-demo-lede">
                  The RAG walkthrough turns invisible infrastructure into proof:
                  ingestion, chunking, embeddings, retrieval, context injection, and verified output.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.08}>
              <div className="portfolio-demo-console">
                <RagVisualizer />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section id="projects" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="editorial-eyebrow">
                <Code2 size={14} />
                Featured work
              </span>
              <h2 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Work samples that support hiring decisions.
              </h2>
            </div>
            <Link href="/projects" className="anime-btn-outline w-fit">
              All projects
              <ArrowRight size={15} />
            </Link>
          </div>

          <div className="space-y-7">
            {featuredProjects.map((project, index) => (
              <ScrollReveal key={project.id} delay={index * 0.04}>
                <motion.article
                  className="editorial-project-card"
                  whileHover={{ scale: 0.992 }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                >
                  <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                    <div className="order-2 lg:order-1">
                      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                        Project {String(index + 1).padStart(2, "0")} - {project.year}
                      </p>
                      <h3 className="mt-4 text-4xl font-black leading-none tracking-[-0.065em] md:text-6xl">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm font-bold uppercase tracking-[0.14em] text-muted-foreground">
                        {project.subtitle}
                      </p>
                      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                        {project.description}
                      </p>

                      {project.metrics ? (
                        <div className="mt-7 grid gap-3 sm:grid-cols-3">
                          {Object.entries(project.metrics).slice(0, 3).map(([key, value]) => (
                            <div key={key} className="editorial-metric">
                              <span>{key}</span>
                              <strong>{value}</strong>
                            </div>
                          ))}
                        </div>
                      ) : null}

                      <div className="mt-7 flex flex-wrap gap-2">
                        {project.stack.slice(0, 6).map((tech) => (
                          <span key={tech} className="mono-pill">{tech}</span>
                        ))}
                      </div>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link href={`/projects/${project.id}`} className="anime-btn-outline">
                          Case study
                          <ArrowRight size={15} />
                        </Link>
                        {project.liveUrl || project.link ? (
                          <a
                            href={project.liveUrl || project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="anime-btn"
                          >
                            Live demo
                            <ExternalLink size={15} />
                          </a>
                        ) : null}
                        {project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="anime-btn-outline"
                          >
                            <Github className="size-4" />
                            Code
                          </a>
                        ) : null}
                      </div>
                    </div>

                    <div className="order-1 lg:order-2">
                      <ProjectPreviewVisual
                        image={project.image}
                        title={project.title}
                        label={project.subtitle}
                        className="min-h-[280px] md:min-h-[390px]"
                      />
                    </div>
                  </div>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="signal" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="editorial-eyebrow mx-auto">
              <Server size={14} />
              Professional signal
            </span>
            <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
              Clear reasons to hire.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {engineeringSignals.map((item, index) => (
              <ScrollReveal key={item.title} delay={index * 0.04}>
                <motion.article
                  className="editorial-signal-card"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 260, damping: 25 }}
                >
                  <div className="mb-9 flex items-center justify-between">
                    <div className="editorial-icon">
                      <item.icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      {item.meta}
                    </span>
                  </div>
                  <h3 className="text-2xl font-black tracking-[-0.055em]">{item.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground">{item.body}</p>
                </motion.article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="agent-brief" className="editorial-section scroll-mt-24">
        <div className="editorial-container">
          <div className="agent-brief-panel">
            <div className="agent-brief-copy">
              <span className="editorial-eyebrow">
                <Terminal size={14} />
                Agent-ready brief
              </span>
              <h2 className="mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl">
                Send this to a recruiter, founder, or hiring bot.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-muted-foreground">
                A professional portfolio should work for humans and screening systems.
                This brief summarizes what I build, where I fit, and how to contact me.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button type="button" onClick={handleCopyHiringBrief} className="anime-btn">
                  {briefCopied ? <Check size={15} /> : <Copy size={15} />}
                  {briefCopied ? "Brief copied" : "Copy hiring brief"}
                </button>
                <Link href="/contact" className="anime-btn-outline">
                  Start conversation
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            <div className="agent-brief-terminal" aria-label="Hiring brief preview">
              <div className="agent-brief-terminal__top">
                <span />
                <span />
                <span />
                <small>HIRE_KUNAL.md</small>
              </div>
              <pre>{hiringBrief}</pre>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="editorial-final-cta scroll-mt-24">
        <div className="editorial-container">
          <div className="editorial-final-panel">
            <div className="max-w-3xl">
              <span className="editorial-eyebrow editorial-eyebrow--dark">
                <Mail size={14} />
                Available for select opportunities
              </span>
              <h2 className="mt-8 text-5xl font-black leading-[0.95] tracking-[-0.075em] text-white md:text-7xl">
                Bring me a real problem.
              </h2>
              <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
                Hire me for freelance MVPs, AI integrations, automation systems, admin
                dashboards, or full-time AI/full-stack engineering roles.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="anime-btn anime-btn--light">
                  Start hiring conversation
                  <ArrowRight size={15} />
                </Link>
                <a
                  href={profile.social.linkedin || siteConfig.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="anime-btn-outline anime-btn-outline--dark"
                >
                  <Linkedin className="size-4" />
                  LinkedIn
                </a>
                <button type="button" onClick={handleCopyEmail} className="anime-btn-outline anime-btn-outline--dark">
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Email copied" : "Copy email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
