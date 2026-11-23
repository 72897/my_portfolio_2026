"use client";

import { useMemo } from "react";
import { skillCategories } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { useRemoteList } from "@/components/shared/use-remote-list";
import type { ISkill } from "@/types";

const fallbackSkills: ISkill[] = skillCategories.flatMap((group) =>
  group.skills.map((skill, order) => ({
    name: skill.name,
    category: group.category,
    order,
  }))
);

export default function SkillsPage() {
  const skills = useRemoteList<ISkill>("/api/skills", fallbackSkills);

  const groups = useMemo(() => {
    const byCategory = new Map<string, ISkill[]>();
    for (const skill of skills) {
      const list = byCategory.get(skill.category) ?? [];
      list.push(skill);
      byCategory.set(skill.category, list);
    }
    return Array.from(byCategory, ([category, items]) => ({
      category,
      skills: items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
    }));
  }, [skills]);

  return (
    <>
      <PageHeader
        title="Skills"
        description="The languages, frameworks and tools I work with, grouped by area."
      />

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:px-6 md:grid-cols-2">
          {groups.map((group) => (
            <div key={group.category} className="anime-card rounded-xl p-6">
              <h2 className="text-lg font-bold font-[family-name:var(--font-heading)] text-foreground">
                {group.category}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-full border border-border bg-muted px-3 py-1 text-sm font-medium text-foreground"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
