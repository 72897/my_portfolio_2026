"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { skillCategories as fallbackCategories } from "@/lib/constants";
import type { ISkill } from "@/types";

// Dynamically resolve lucide icons from string name
function getIcon(name: string) {
  const pascalName = name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const IconComponent = (LucideIcons as any)[pascalName];
  return IconComponent || LucideIcons.Code2;
}

interface SkillGroup {
  category: string;
  skills: ISkill[];
}

export default function SkillsPage() {
  const [skillGroups, setSkillGroups] = useState<SkillGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSkills() {
      try {
        const res = await fetch("/api/skills");
        if (res.ok) {
          const data = await res.json();
          const skillsList: ISkill[] = Array.isArray(data) ? data : (data.skills || data);
          
          if (skillsList.length > 0) {
            // Group skills by category
            const categories = Array.from(new Set(skillsList.map((s) => s.category)));
            const grouped = categories.map((cat) => ({
              category: cat,
              skills: skillsList
                .filter((s) => s.category === cat)
                .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
            }));
            setSkillGroups(grouped);
          } else {
            setSkillGroups(fallbackCategories as unknown as SkillGroup[]);
          }
        } else {
          setSkillGroups(fallbackCategories as unknown as SkillGroup[]);
        }
      } catch {
        setSkillGroups(fallbackCategories as unknown as SkillGroup[]);
      } finally {
        setLoading(false);
      }
    }
    fetchSkills();
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
              Skills & <span className="gradient-text">Technologies</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              A comprehensive overview of my technical toolkit
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skills Grid */}
      <section className="py-20 border-t border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-16">
          {loading ? (
            <div className="space-y-12">
              {[1, 2].map((n) => (
                <div key={n} className="space-y-4">
                  <div className="h-6 bg-muted rounded w-1/4 animate-shimmer" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((m) => (
                      <div key={m} className="h-24 rounded-xl bg-card border border-border animate-shimmer" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            skillGroups.map((group, catIdx) => {
              return (
                <motion.div
                  key={group.category}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: catIdx * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 h-6 rounded-full bg-primary" />
                    <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                      {group.category}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.skills.map((skill, skillIdx) => {
                      const Icon = getIcon(skill.icon || "code-2");
                      return (
                        <motion.div
                          key={skill.name}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: skillIdx * 0.03 }}
                          className="group anime-card rounded-xl p-5 flex items-center gap-4 cursor-default"
                        >
                          <div className="w-10 h-10 rounded-lg bg-muted text-primary flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate text-foreground">
                              {skill.name}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>
    </>
  );
}
