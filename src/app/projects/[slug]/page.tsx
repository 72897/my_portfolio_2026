"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import { projects as fallbackProjects } from "@/lib/constants";
import type { IProject } from "@/types";

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<IProject | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProject(data.project || data);
        } else {
          const found = fallbackProjects.find((p) => p.slug === slug);
          setProject(found || null);
        }
      } catch {
        const found = fallbackProjects.find((p) => p.slug === slug);
        setProject(found || null);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-transparent border-t-primary animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Project Not Found</h2>
          <p className="mt-2 text-muted-foreground">
            The project you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/projects"
            className="mt-4 inline-flex items-center gap-2 text-primary cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium">
                  Featured
                </span>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-bold font-[family-name:var(--font-heading)]">
              {project.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground">
              {project.description}
            </p>

            {/* Action buttons */}
            <div className="mt-6 flex items-center gap-3">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium cursor-pointer hover:opacity-90 transition-opacity duration-200"
                >
                  <Github className="w-4 h-4" />
                  View Source
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border font-medium cursor-pointer hover:bg-muted transition-colors duration-200"
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </a>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Details */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          {/* Long description */}
          {project.longDescription && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">
                Overview
              </h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                {project.longDescription}
              </p>
            </motion.div>
          )}

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4">
              Key Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {project.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 glass-card rounded-xl p-4"
                >
                  <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-muted-foreground">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold font-[family-name:var(--font-heading)] mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-primary" />
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
