"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ExternalLink,
  Star,
  Filter,
} from "lucide-react";
import { Github } from "@/components/shared/brand-icons";
import { projects as fallbackProjects } from "@/lib/constants";
import type { IProject } from "@/types";

const categories = ["All", "AI", "FullStack", "WebApp", "Backend", "Automation"];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data.projects || data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch {
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory =
        activeCategory === "All" || p.category === activeCategory;
      const matchesSearch =
        search === "" ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        p.techStack.some((t) =>
          t.toLowerCase().includes(search.toLowerCase())
        );
      return matchesCategory && matchesSearch;
    });
  }, [projects, activeCategory, search]);

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
              My <span className="gradient-text">Projects</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              A collection of AI, full-stack, and web development projects
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-card/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Category Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <Filter className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors duration-200 ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search projects..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="anime-input w-full pl-10 pr-4 py-1.5 text-xs"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="rounded-xl bg-card border border-border p-6 h-64 animate-shimmer"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No projects found matching your criteria.
              </p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((project, i) => (
                  <motion.div
                    key={project.slug}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block anime-card rounded-xl p-6 h-full cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="anime-badge">
                          {project.category}
                        </span>
                        {project.featured && (
                          <span className="anime-badge-violet flex items-center gap-1">
                            <Star size={10} fill="currentColor" />
                            Featured
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold font-[family-name:var(--font-heading)] group-hover:text-primary transition-colors duration-200 text-foreground">
                        {project.title}
                      </h3>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                        {project.description}
                      </p>

                      {/* Features preview */}
                      <ul className="mt-3 space-y-1 list-none pl-0">
                        {project.features.slice(0, 2).map((f, idx) => (
                          <li
                            key={idx}
                            className="text-xs text-muted-foreground truncate flex items-center gap-1"
                          >
                            <span className="text-primary">•</span> {f}
                          </li>
                        ))}
                      </ul>

                      {/* Tech */}
                      <div className="mt-4 flex flex-wrap gap-1">
                        {project.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium border border-border"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 4 && (
                          <span className="text-[10px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full font-medium border border-border">
                            +{project.techStack.length - 4}
                          </span>
                        )}
                      </div>

                      {/* Links */}
                      <div className="mt-4 pt-3 border-t border-border/40 flex items-center gap-3">
                        {project.githubUrl && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">
                            <Github className="w-3.5 h-3.5" />
                            Source
                          </span>
                        )}
                        {project.liveUrl && (
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground group-hover:text-primary transition-colors duration-200">
                            <ExternalLink className="w-3.5 h-3.5" />
                            Live
                          </span>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>
    </>
  );
}
