"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Download,
  Mail,
  ExternalLink,
  Code2,
  Copy,
  Check,
  Phone,
  MapPin,
  GraduationCap,
  Award,
  Briefcase,
  Sliders,
  Rocket,
  ArrowRight,
  Database,
  Cpu,
  Globe,
  Terminal,
  Server
} from "lucide-react";
import { usePortfolio } from "@/hooks/usePortfolio";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { TiltCard } from "@/components/effects/tilt-card";
import { AiPlayground } from "@/components/effects/ai-playground";
import { RagVisualizer } from "@/components/effects/rag-visualizer";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { TypeAnimation } from "react-type-animation";
import { siteConfig } from "@/lib/constants";

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

export default function HomePage() {
  const { data, loading } = usePortfolio();
  const { profile, experience, projects, education } = data;
  
  const [copied, setCopied] = useState(false);
  const aboutSectionRef = useRef<HTMLDivElement>(null);

  // Copy email helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.social.email || "kunalsingh203001@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sort projects: Pinned (highlight: true) first, then by year desc
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.highlight && !b.highlight) return -1;
    if (!a.highlight && b.highlight) return 1;
    return b.year.localeCompare(a.year);
  });

  // Stats bar definitions
  const stats = [
    { icon: Briefcase, label: "Internships", value: 3, suffix: "" },
    { icon: Rocket, label: "Projects", value: 4, suffix: "+" },
    { icon: Code2, label: "Problems Solved", value: 150, suffix: "+" },
    { icon: Award, label: "Certificates", value: 6, suffix: "+" },
  ];

  // Services definitions (Bento)
  const services = [
    {
      title: "AI & LLM Integration",
      description: "Orchestrating smart agentic workflows using LangChain, RAG pipelines, prompt engineering, vector databases (ChromaDB), and state-of-the-art LLMs like Google Gemini.",
      icon: Cpu,
      gradient: "from-emerald-500/20 to-teal-500/5",
      className: "md:col-span-2"
    },
    {
      title: "Backend Development",
      description: "Designing and developing robust, scalable REST APIs using Node.js, Express.js, and MongoDB. Focusing on clean schema design, authentication, and database query optimization.",
      icon: Server,
      gradient: "from-blue-500/20 to-indigo-500/5",
      className: "md:col-span-1"
    },
    {
      title: "Frontend Engineering",
      description: "Building responsive, modern, high-fidelity user interfaces with React.js, Next.js, and Tailwind CSS. Implementing intuitive micro-animations and cohesive design systems.",
      icon: Globe,
      gradient: "from-purple-500/20 to-pink-500/5",
      className: "md:col-span-1"
    },
    {
      title: "Cloud & Automation",
      description: "Managing application deployment, hosting environments (Vercel, Netlify), server authentication flows (JWT), and automated cloud integrations.",
      icon: Database,
      gradient: "from-amber-500/20 to-orange-500/5",
      className: "md:col-span-2"
    }
  ];

  // Professional testimonials based on internships & coursework
  const mockTestimonials = [
    {
      quote: "Kunal is an exceptional AI Intern. He automated our business workflows, reducing manual reporting efforts by 90% and displaying deep knowledge in prompt engineering and Python.",
      name: "Workplace Supervisor",
      role: "Manipal Business Solution",
      initials: "WS"
    },
    {
      quote: "During his coursework, Kunal demonstrated outstanding proficiency in Data Structures and Machine Learning. His ability to build and deploy generative AI solutions is highly impressive.",
      name: "Academic Supervisor",
      role: "Gautam Buddha University",
      initials: "AS"
    }
  ];

  const marqueeItems = [...mockTestimonials, ...mockTestimonials, ...mockTestimonials, ...mockTestimonials];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-4" />
        <span className="text-sm text-muted-foreground font-mono">Loading Kunal&apos;s Portfolio…</span>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden font-sans">
      
      {/* ── 1. Hero Section (Asymmetric Split Layout) ── */}
      <section id="hero" className="home-hero min-h-[92vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 relative">
        <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
        <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 relative">
          
          {/* Headline and CTAs - Left 7 columns */}
          <div className="lg:col-span-7 flex flex-col items-start text-left gap-6 z-10">
            <div className="eyebrow">
              <span className="status-dot" />
              <span>AI engineer · Full-stack creator</span>
            </div>
            
            <h1 className="hero-title font-[family-name:var(--font-heading)] text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tighter leading-[0.88] select-none text-foreground">
              Building<br /><span className="gradient-text">intelligence</span><br />into products.
            </h1>

            <div className="hero-role text-base sm:text-lg md:text-xl font-mono text-muted-foreground min-h-[40px] flex items-center">
              <span className="mr-2 text-primary font-bold">↳</span>
              <TypeAnimation
                sequence={[
                  "AI Engineer",
                  1500,
                  "Full Stack Developer",
                  1500,
                  "GenAI Specialist",
                  1500,
                  "MERN Developer",
                  1500
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="text-foreground font-semibold"
              />
            </div>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-xl">
              I&apos;m {profile.shortName}—{profile.tagline}. I turn generative AI, RAG systems, and modern web technology into useful, scalable experiences.
            </p>
            
            {/* Social pills */}
            <div className="flex flex-wrap gap-2">
              {profile.social.github && (
                <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="anime-badge hover:bg-primary/20 transition cursor-pointer">
                  GitHub
                </a>
              )}
              {profile.social.linkedin && (
                <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="anime-badge hover:bg-primary/20 transition cursor-pointer">
                  LinkedIn
                </a>
              )}
              {profile.social.email && (
                <button onClick={handleCopyEmail} className="anime-badge hover:bg-primary/20 transition cursor-pointer flex items-center gap-1.5">
                  {copied ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                  <span>{copied ? "Copied Email" : "Email"}</span>
                </button>
              )}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mt-2">
              {profile.social.resume && (
                <a 
                  href={profile.social.resume} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="anime-btn flex items-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                >
                  <Download size={16} /> Download Resume
                </a>
              )}
              <a 
                href="#contact" 
                className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
              >
                <Mail size={16} /> Get In Touch
              </a>
            </div>
          </div>

          {/* Centered 3D Avatar - Right 5 columns */}
          <div className="hero-stage lg:col-span-5 w-full h-[350px] md:h-[450px] lg:h-[540px] z-20 relative flex justify-center items-center">
            <div className="hero-stage__halo" aria-hidden="true" />
            <div className="floating-chip floating-chip--top"><span>GenAI</span> LLM systems</div>
            <div className="floating-chip floating-chip--bottom"><span>MERN</span> Product engineering</div>
            <Hero3DLogo />
            <div className="hero-stage__base" aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* ── 2. Stats Bar Section ── */}
      <section className="py-12 border-y border-border/40 relative z-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <ScrollReveal key={stat.label} delay={i * 0.05}>
                <div className="anime-card rounded-2xl p-6 text-center flex flex-col items-center gap-2 hover:border-primary/45 transition-colors duration-300">
                  <div className="p-3 rounded-xl bg-primary/5 text-primary mb-1">
                    <stat.icon size={20} />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold font-[family-name:var(--font-heading)] text-foreground tracking-tight">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </span>
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                    {stat.label}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. About Section (Asymmetric Two-Column) ── */}
      <section id="about" className="py-24 relative z-10 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left: Bio info - 7 cols */}
            <div className="lg:col-span-7 space-y-6">
              <ScrollReveal>
                <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider">
                  <Terminal size={14} />
                  <span>whoami</span>
                </div>
                <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight mt-2">
                  Passionate AI Engineer & Full-Stack Builder
                </h2>
              </ScrollReveal>
              
              <ScrollReveal delay={0.05}>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {profile.bio}
                </p>
              </ScrollReveal>
              
              <ScrollReveal delay={0.1}>
                <div className="flex flex-col sm:flex-row gap-4 pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2.5">
                    <MapPin size={16} className="text-primary" />
                    <span>{profile.location}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <GraduationCap size={16} className="text-primary" />
                    <span>B.Tech CSE @ GBU (2022 – 2026)</span>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: Education detail card - 5 cols */}
            <div className="lg:col-span-5">
              <ScrollReveal delay={0.15}>
                <div className="anime-card rounded-2xl p-6 md:p-8 space-y-6">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-3 flex items-center gap-2">
                    <Award size={14} className="text-primary" />
                    <span>Education Pathway</span>
                  </h3>
                  <div className="space-y-6">
                    {education.map((edu, idx) => (
                      <div key={idx} className="relative pl-5 border-l border-border/60 last:border-l-0 pb-1">
                        <div className="absolute left-0 top-1 w-2.5 h-2.5 rounded-full bg-primary -translate-x-[5px]" />
                        <h4 className="font-bold text-sm text-foreground">{edu.institution}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{edu.degree}</p>
                        <span className="text-[10px] font-mono text-primary font-semibold mt-1 inline-block">{edu.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            </div>

          </div>
        </div>
      </section>

      {/* ── 4. Experience Section (Vertical Timeline Layout) ── */}
      <section id="experience" className="py-24 border-t border-border/40 relative z-10 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <Briefcase size={14} />
              <span>journey</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight text-center mt-2">
              Work Experience
            </h2>
          </ScrollReveal>

          {/* Timeline Wrapper */}
          <div className="mt-16 relative pl-6 sm:pl-8 border-l border-border/60 space-y-12">
            {experience.map((exp, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05}>
                <div className="relative">
                  {/* Outer emerald node */}
                  <div className="absolute -left-[31px] sm:-left-[39px] top-1.5 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                  
                  <div className="anime-card rounded-2xl p-6 md:p-8 space-y-4">
                    <div className="flex flex-wrap justify-between items-start gap-x-4 gap-y-2">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground font-[family-name:var(--font-heading)] leading-snug">
                          {exp.role}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          at <span className="text-foreground font-semibold">{exp.company}</span> • <span className="text-[11px] font-mono text-primary font-medium">{exp.type}</span>
                        </p>
                      </div>
                      <span className="mono-pill">{exp.period}</span>
                    </div>
                    
                    <p className="text-xs font-semibold text-primary/80 flex items-center gap-1">
                      <MapPin size={12} /> {exp.location}
                    </p>
                    
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mt-2">{exp.summary}</p>
                    
                    <ul className="text-xs sm:text-sm text-muted-foreground space-y-2 list-disc pl-4 leading-relaxed pt-2 border-t border-border/30">
                      {exp.highlights.slice(0, 4).map((highlight, hIdx) => (
                        <li key={hIdx} className="pl-1">
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Services & Capabilities Section (Bento Grid Layout) ── */}
      <section id="services" className="py-24 border-t border-border/40 relative z-10 px-4 sm:px-6 scroll-mt-20 bg-card/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <Cpu size={14} />
              <span>capabilities</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight text-center mt-2">
              My Core Specialties
            </h2>
          </ScrollReveal>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {services.map((svc, idx) => (
              <ScrollReveal key={idx} delay={idx * 0.05} className={svc.className}>
                <TiltCard>
                  <div className={`anime-card h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-primary/40 transition-colors duration-300 relative group overflow-hidden`}>
                    
                    {/* Gradient Glow */}
                    <div className={`absolute -right-16 -top-16 w-36 h-36 rounded-full bg-gradient-to-br ${svc.gradient} filter blur-2xl opacity-40 group-hover:scale-125 transition-transform duration-500`} />
                    
                    <div className="space-y-4 relative z-10">
                      <div className="p-3 rounded-xl bg-primary/5 text-primary w-fit">
                        <svc.icon size={22} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground font-[family-name:var(--font-heading)]">{svc.title}</h3>
                      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">{svc.description}</p>
                    </div>
                    
                    <div className="mt-8 flex items-center text-primary text-xs font-mono font-semibold group-hover:gap-2 gap-1.5 transition-all duration-300 relative z-10">
                      <span>Active stack integration</span>
                      <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </div>

                  </div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5.5 AI Twin Playground Sandbox Section ── */}
      <section id="playground" className="py-24 border-t border-border/40 relative z-10 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <Sliders size={14} />
              <span>inference sandbox</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight text-center mt-2">
              AI Twin Model Playground
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base text-center mt-4 max-w-xl mx-auto mb-16 leading-relaxed">
              Interact with my LLM twin directly! Tweak the system parameters, temperature, and tokens to evaluate response behaviors and token usage in real-time.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <AiPlayground />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 5.6 RAG Engine Simulator Section ── */}
      <section id="rag-simulator" className="py-24 border-t border-border/40 relative z-10 px-4 sm:px-6 scroll-mt-20 bg-card/5">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <Database size={14} />
              <span>pipeline simulation</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight text-center mt-2">
              RAG Retrieval Simulator
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base text-center mt-4 max-w-xl mx-auto mb-16 leading-relaxed">
              Step through the mechanics of Retrieval-Augmented Generation (RAG) in real-time. Ingest, tokenize, embed, query, and augment prompts dynamically.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <RagVisualizer />
          </ScrollReveal>
        </div>
      </section>

      {/* ── 6. Projects Section (Sticky Stack Cards Layout) ── */}
      <section id="projects" className="py-24 border-t border-border/40 relative z-10 px-4 sm:px-6 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <Code2 size={14} />
              <span>portfolio</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight text-center mt-2">
              Featured Work
            </h2>
          </ScrollReveal>

          {/* Sticky Stack Layout */}
          <div className="relative space-y-12 mt-16">
            {sortedProjects.slice(0, 4).map((proj, idx) => (
              <ScrollReveal key={proj.id} delay={0.05}>
                <div 
                  className="sticky bg-card border border-border/80 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 shadow-2xl min-h-[320px] transition-all hover:border-primary/30"
                  style={{ top: `${80 + idx * 24}px` }}
                >
                  {/* Left: Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-muted-foreground/60">
                          Project #{String(idx + 1).padStart(2, "0")} {proj.highlight && "★ Pinned"}
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full font-semibold">{proj.year}</span>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-foreground font-[family-name:var(--font-heading)] leading-tight">{proj.title}</h3>
                      <p className="text-xs text-primary font-semibold tracking-wide uppercase">{proj.subtitle}</p>
                      <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">{proj.description}</p>
                      {proj.metrics && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/20">
                          {Object.entries(proj.metrics).slice(0, 3).map(([key, val]) => (
                            <div key={key} className="bg-muted/40 border border-border/20 rounded-xl px-3 py-1 flex flex-col justify-center min-w-[90px] text-center">
                              <span className="text-[9px] font-mono text-muted-foreground uppercase tracking-wider">{key}</span>
                              <span className="text-xs font-mono font-bold text-primary mt-0.5">{val}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex flex-wrap gap-1.5">
                        {proj.stack.map((tech) => (
                          <span key={tech} className="text-[10px] bg-muted text-muted-foreground px-2.5 py-0.5 rounded-full font-medium border border-border/30">
                            {tech}
                          </span>
                        ))}
                      </div>
                      
                      {proj.link && (
                        <a 
                          href={proj.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="anime-badge bg-primary text-primary-foreground font-semibold hover:opacity-90 inline-flex items-center gap-1.5 w-fit cursor-pointer"
                        >
                          Live Project <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Right: Visual representation */}
                  <div className="w-full md:w-80 h-48 md:h-auto rounded-2xl bg-muted border border-border/30 overflow-hidden relative flex items-center justify-center shrink-0">
                    {proj.image ? (
                      <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-br from-card to-muted">
                        <Code2 className="w-10 h-10 text-primary/30 mb-2" />
                        <span className="text-xs font-mono text-muted-foreground/50 uppercase tracking-widest font-semibold">{proj.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link 
              href="/projects" 
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-foreground transition-colors group cursor-pointer"
            >
              <span>View All Projects</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. Testimonials Section (Infinite Marquee) ── */}
      <section id="testimonials" className="py-24 border-t border-border/40 relative z-10 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <span>reviews</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight mt-2">
              What People Say
            </h2>
          </ScrollReveal>
        </div>

        {/* Infinite Marquee container */}
        <div className="marquee-container mt-16 overflow-hidden">
          <div className="marquee-content flex gap-6 w-max animate-marquee">
            {marqueeItems.map((item, idx) => (
              <div 
                key={idx} 
                className="marquee-card bg-card border border-border/80 p-6 rounded-2xl w-80 shrink-0 whitespace-normal flex flex-col justify-between shadow-lg hover:border-primary/20 transition-colors"
              >
                <div>
                  <p className="italic text-muted-foreground text-sm leading-relaxed">&ldquo;{item.quote}&rdquo;</p>
                </div>
                <div className="mt-4 border-t border-border/20 pt-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-teal-500 flex items-center justify-center text-primary-foreground font-bold text-xs uppercase shadow-sm">
                    {item.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-xs uppercase tracking-wider">{item.name}</h4>
                    <p className="text-[10px] text-primary">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. Contact / CTA Section ── */}
      <section id="contact" className="py-24 border-t border-border/40 relative z-10 px-4 sm:px-6 scroll-mt-20 bg-card/10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <ScrollReveal>
            <div className="flex items-center gap-2 text-primary font-mono text-sm uppercase tracking-wider justify-center">
              <Mail size={14} />
              <span>connect</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold font-[family-name:var(--font-heading)] text-foreground tracking-tight mt-2">
              Let&apos;s Build Something Great
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-4 max-w-xl mx-auto leading-relaxed">
              Open to collaborations, internship opportunities, and technical discussions. Drop me a line and let&apos;s build something impactful together.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <div className="flex flex-wrap gap-4 justify-center mt-6">
              <Link
                href="/contact"
                className="anime-btn px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Mail size={16} /> Write A Message
              </Link>
              <a
                href={profile.social.linkedin || siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn-outline cursor-pointer inline-flex items-center gap-2"
              >
                <ExternalLink size={16} /> Connect LinkedIn
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}
