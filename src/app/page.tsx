import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Code2,
  Download,
  ExternalLink,
  GraduationCap,
  Languages,
  Layers3,
  Mail,
  MapPin,
  Trophy,
} from "lucide-react";
import { ScrollRail } from "@/components/effects/scroll-rail";
import { ScrollReveal } from "@/components/effects/scroll-reveal";
import { Github, Linkedin } from "@/components/shared/brand-icons";
import { ProjectPreviewVisual } from "@/components/shared/project-preview-visual";
import {
  achievements,
  certificates,
  education,
  experiences,
  languages,
  projects,
  siteConfig,
  skillCategories,
} from "@/lib/constants";

const RAIL_SECTIONS = [
  { id: "hero", label: "Top" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "credentials", label: "Credentials" },
  { id: "contact", label: "Contact" },
];

const FEATURED_LIMIT = 4;
const HOME_BULLET_LIMIT = 3;

const SECTION_HEADING =
  "mt-6 text-5xl font-black leading-[0.96] tracking-[-0.07em] md:text-7xl";

const currentRole = experiences.find((exp) => exp.current);

/* TIQ Platform leads the list; the rest keep their order in the data file. */
const featuredProjects = projects
  .filter((project) => project.featured)
  .sort(
    (a, b) =>
      Number(b.slug === "tiq-platform") - Number(a.slug === "tiq-platform")
  )
  .slice(0, FEATURED_LIMIT);

const glanceFacts = [
  {
    icon: Layers3,
    value: "47+",
    label: "Automations shipped",
    note: "Marketing, CRM, analytics, lead generation and internal operations at Technocratiq Digital.",
  },
  {
    icon: Code2,
    value: "150+",
    label: "Problems solved",
    note: "On LeetCode and GeeksforGeeks.",
  },
  {
    icon: Trophy,
    value: "3+",
    label: "Hackathon finals",
    note: "Reached as team lead.",
  },
  {
    icon: Award,
    value: String(certificates.length),
    label: "Certifications",
    note: "Cloud, generative AI and API testing.",
  },
];

const OVERLAP_TONES = [
  "overlap-tone-a",
  "overlap-tone-b",
  "overlap-tone-c",
  "overlap-tone-d",
];

/**
 * Props for one panel in the overlapping scroll stack. `index` drives both the
 * paint order (higher index rides over lower) and the surface tint rotation.
 */
const overlapPanel = (index: number, ...extraClasses: string[]) => ({
  className: [
    "overlap-scroll-section",
    OVERLAP_TONES[(index - 1) % OVERLAP_TONES.length],
    index === 1 ? "is-lead" : "",
    ...extraClasses,
  ]
    .filter(Boolean)
    .join(" "),
  style: { "--overlap-index": index } as CSSProperties,
});

function Eyebrow({
  icon,
  children,
  className = "",
}: {
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`editorial-eyebrow ${className}`}>
      {icon}
      {children}
    </span>
  );
}

function HeroSection() {
  return (
    <section id="hero" className="editorial-hero scroll-mt-24">
      <div className="editorial-container hero-layout">
        <ScrollReveal>
          <div className="hero-copy-card flex max-w-4xl flex-col items-start text-left">
            {currentRole ? (
              <span className="editorial-eyebrow">
                <span className="status-dot" aria-hidden="true" />
                Currently: {currentRole.role} at {currentRole.company}
              </span>
            ) : null}

            <p className="mt-8 font-mono text-sm font-bold uppercase tracking-[0.18em]">
              {siteConfig.name}
            </p>
            <h1 className="editorial-display mt-3 text-[length:clamp(2.4rem,4.6vw,4.25rem)]!">
              {siteConfig.title}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
              {siteConfig.description}
            </p>

            <div className="mt-8 flex flex-wrap justify-start gap-3">
              <Link href="/projects" className="anime-btn">
                View projects
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn-outline"
              >
                <Download size={16} aria-hidden="true" />
                Resume
              </a>
              <Link href="/contact" className="anime-btn-outline">
                <Mail size={16} aria-hidden="true" />
                Contact
              </Link>
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn-outline"
              >
                <Github className="size-4" aria-hidden="true" />
                GitHub
              </a>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="hero-art-card" aria-hidden="true">
            <div className="hero-art-card__caption">
              <span>Based in</span>
              <strong>{siteConfig.location}</strong>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

/* Decorative marquee of the current role's stack; the Skills panel carries the
   same information for assistive tech. */
function StackTicker() {
  const items = currentRole?.technologies ?? [];
  if (items.length === 0) return null;

  return (
    <div className="agent-ticker-section" aria-hidden="true">
      <div className="agent-ticker">
        <div className="agent-ticker__track">
          {[...items, ...items].map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function GlanceSection() {
  return (
    <section
      aria-labelledby="glance-heading"
      {...overlapPanel(1, "editorial-section")}
    >
      <div className="editorial-container">
        <div className="proof-header">
          <Eyebrow icon={<Award size={14} aria-hidden="true" />}>
            At a glance
          </Eyebrow>
          <h2 id="glance-heading">The short version.</h2>
        </div>
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {glanceFacts.map((fact, index) => (
            <li key={fact.label}>
              <ScrollReveal delay={index * 0.04} className="h-full">
                <div className="editorial-stat-card h-full">
                  <fact.icon
                    size={19}
                    className="mb-8 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <p className="text-5xl font-black tracking-[-0.07em]">
                    {fact.value}
                  </p>
                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.14em]">
                    {fact.label}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {fact.note}
                  </p>
                </div>
              </ScrollReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      {...overlapPanel(2, "editorial-section", "scroll-mt-24")}
    >
      <div className="editorial-container">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-20">
          <ScrollReveal>
            <div className="editorial-portrait-card">
              <div className="editorial-orbit-mark" aria-hidden="true">
                <Code2 size={72} strokeWidth={1.3} />
              </div>
              <div className="editorial-floating-note editorial-floating-note--one">
                <span>Location</span>
                <strong>{siteConfig.location}</strong>
              </div>
              <div className="editorial-floating-note editorial-floating-note--two">
                <span>Working in</span>
                <strong>Python and TypeScript</strong>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.05}>
            <Eyebrow icon={<MapPin size={14} aria-hidden="true" />}>
              About
            </Eyebrow>
            <h2 id="about-heading" className={SECTION_HEADING}>
              What I do.
            </h2>
            <p className="mt-7 text-base leading-8 text-muted-foreground">
              {siteConfig.description}
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {education.map((edu) => (
                <li key={edu.institution} className="editorial-mini-card">
                  <GraduationCap size={18} aria-hidden="true" />
                  <h3>{edu.institution}</h3>
                  <p>
                    {edu.degree}
                    {edu.grade ? `, ${edu.grade}` : ""}
                  </p>
                  <span>{edu.period}</span>
                </li>
              ))}
            </ul>
            <Link href="/about" className="anime-btn-outline mt-8 w-fit">
              More about me
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ExperienceSection() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      {...overlapPanel(3, "editorial-section", "scroll-mt-24")}
    >
      <div className="editorial-container">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <Eyebrow
            icon={<Briefcase size={14} aria-hidden="true" />}
            className="mx-auto"
          >
            Experience
          </Eyebrow>
          <h2 id="experience-heading" className={SECTION_HEADING}>
            Where I have worked.
          </h2>
        </div>

        <div className="editorial-timeline">
          {experiences.map((exp, index) => (
            <ScrollReveal
              key={`${exp.company}-${exp.role}`}
              delay={index * 0.04}
              direction={index % 2 === 0 ? "left" : "right"}
              className="editorial-timeline-item"
            >
              <article className="editorial-timeline-card">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {exp.startDate} to {exp.endDate} · {exp.type}
                </p>
                <h3 className="mt-3 text-3xl font-black tracking-[-0.055em]">
                  {exp.role}
                </h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {exp.company}, {exp.location}
                </p>
                <ul className="mt-6 grid gap-3 border-t border-border/70 pt-6">
                  {exp.bullets.slice(0, HOME_BULLET_LIMIT).map((bullet) => (
                    <li
                      key={bullet}
                      className="flex gap-3 text-sm leading-6 text-muted-foreground"
                    >
                      <span
                        className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/experience" className="anime-btn-outline">
            Full experience
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SkillsSection() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      {...overlapPanel(4, "editorial-section", "scroll-mt-24")}
    >
      <div className="editorial-container">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow icon={<Layers3 size={14} aria-hidden="true" />}>
              Skills
            </Eyebrow>
            <h2
              id="skills-heading"
              className={`${SECTION_HEADING} max-w-3xl`}
            >
              What I work with.
            </h2>
          </div>
          <Link href="/skills" className="anime-btn-outline w-fit">
            All skills
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {skillCategories.map((group, index) => (
            <ScrollReveal key={group.category} delay={index * 0.04}>
              <article className="editorial-capability-card h-full">
                <h3 className="text-2xl font-black tracking-[-0.055em]">
                  {group.category}
                </h3>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <li key={skill.name} className="mono-pill">
                      {skill.name}
                    </li>
                  ))}
                </ul>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectsSection() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      {...overlapPanel(5, "editorial-section", "scroll-mt-24")}
    >
      <div className="editorial-container">
        <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <Eyebrow icon={<Code2 size={14} aria-hidden="true" />}>
              Featured work
            </Eyebrow>
            <h2
              id="projects-heading"
              className={`${SECTION_HEADING} max-w-3xl`}
            >
              Things I have built.
            </h2>
          </div>
          <Link href="/projects" className="anime-btn-outline w-fit">
            All projects
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <div className="space-y-7">
          {featuredProjects.map((project, index) => {
            const isInternal = project.status === "Internal";
            const meta = [project.year, project.role].filter(Boolean).join(" · ");

            return (
              <ScrollReveal key={project.slug} delay={index * 0.04}>
                <article className="editorial-project-card">
                  <div
                    className={
                      project.image
                        ? "grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center"
                        : undefined
                    }
                  >
                    <div className="order-2 lg:order-1">
                      {meta ? (
                        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                          {meta}
                        </p>
                      ) : null}
                      <h3 className="mt-4 text-4xl font-black leading-none tracking-[-0.065em] md:text-6xl">
                        {project.title}
                      </h3>
                      {isInternal ? (
                        <p className="mono-pill mt-4 w-fit">
                          Internal project at Technocratiq Digital
                        </p>
                      ) : null}
                      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
                        {project.description}
                      </p>

                      <ul className="mt-7 flex flex-wrap gap-2">
                        {project.techStack.slice(0, 8).map((tech) => (
                          <li key={tech} className="mono-pill">
                            {tech}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="anime-btn-outline"
                          aria-label={`${project.title} details`}
                        >
                          Details
                          <ArrowRight size={15} aria-hidden="true" />
                        </Link>
                        {!isInternal && project.liveUrl ? (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="anime-btn"
                            aria-label={`${project.title} live site`}
                          >
                            Live site
                            <ExternalLink size={15} aria-hidden="true" />
                          </a>
                        ) : null}
                        {!isInternal && project.githubUrl ? (
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="anime-btn-outline"
                            aria-label={`${project.title} source code on GitHub`}
                          >
                            <Github className="size-4" aria-hidden="true" />
                            Code
                          </a>
                        ) : null}
                      </div>
                    </div>

                    {project.image ? (
                      <div className="order-1 lg:order-2">
                        <ProjectPreviewVisual
                          image={project.image}
                          title={project.title}
                        />
                      </div>
                    ) : null}
                  </div>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CredentialsSection() {
  return (
    <section
      id="credentials"
      aria-labelledby="credentials-heading"
      {...overlapPanel(6, "editorial-section", "scroll-mt-24")}
    >
      <div className="editorial-container">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <Eyebrow
            icon={<Award size={14} aria-hidden="true" />}
            className="mx-auto"
          >
            Credentials
          </Eyebrow>
          <h2 id="credentials-heading" className={SECTION_HEADING}>
            Certifications and other notes.
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <ScrollReveal>
            <article className="editorial-signal-card h-full">
              <div className="editorial-icon mb-9">
                <Award size={20} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black tracking-[-0.055em]">
                Certifications
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {certificates.map((cert) => (
                  <li key={cert.title}>
                    <span className="font-semibold text-foreground">
                      {cert.title}
                    </span>
                    , {cert.organization}
                  </li>
                ))}
              </ul>
              <Link href="/certificates" className="anime-btn-outline mt-7 w-fit">
                All certificates
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.04}>
            <article className="editorial-signal-card h-full">
              <div className="editorial-icon mb-9">
                <Trophy size={20} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black tracking-[-0.055em]">
                Achievements
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {achievements.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </ScrollReveal>

          <ScrollReveal delay={0.08}>
            <article className="editorial-signal-card h-full">
              <div className="editorial-icon mb-9">
                <Languages size={20} aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-black tracking-[-0.055em]">
                Languages
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-muted-foreground">
                {languages.map((language) => (
                  <li key={language.name}>
                    <span className="font-semibold text-foreground">
                      {language.name}
                    </span>
                    , {language.level}
                  </li>
                ))}
              </ul>
            </article>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      {...overlapPanel(7, "editorial-final-cta", "scroll-mt-24")}
    >
      <div className="editorial-container">
        <div className="editorial-final-panel">
          <div className="max-w-3xl">
            <span className="editorial-eyebrow editorial-eyebrow--dark">
              <Mail size={14} aria-hidden="true" />
              Contact
            </span>
            <h2
              id="contact-heading"
              className="mt-8 text-5xl font-black leading-[0.95] tracking-[-0.075em] text-white md:text-7xl"
            >
              Get in touch.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/62">
              For roles, projects or questions about my work, use the contact
              form or email me at {siteConfig.email}.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className="anime-btn anime-btn--light">
                Contact form
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${siteConfig.email}`}
                className="anime-btn-outline anime-btn-outline--dark"
              >
                <Mail size={15} aria-hidden="true" />
                Email
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn-outline anime-btn-outline--dark"
              >
                <Linkedin className="size-4" aria-hidden="true" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <ScrollRail sections={RAIL_SECTIONS} />
      <HeroSection />
      <StackTicker />
      <GlanceSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <CredentialsSection />
      <ContactSection />
    </div>
  );
}
