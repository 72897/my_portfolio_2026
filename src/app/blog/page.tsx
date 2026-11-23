"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Linkedin } from "@/components/shared/brand-icons";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/lib/constants";
import type { IBlog } from "@/types";

type FeedFilter = "all" | "article" | "linkedin";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function PostCard({ post }: { post: IBlog }) {
  const isLinkedIn = post.source === "linkedin";
  const publishedAt = post.publishedAt ? dateFormatter.format(new Date(post.publishedAt)) : null;
  const meta = [
    isLinkedIn ? "LinkedIn post" : "Article",
    publishedAt,
    !isLinkedIn && post.readingTime ? `${post.readingTime} min read` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const titleClass = "hover:text-primary hover:underline";

  return (
    <article className="anime-card flex h-full flex-col rounded-2xl p-6">
      <p className="text-xs font-medium text-muted-foreground">{meta}</p>
      <h2 className="mt-2 text-xl font-bold font-[family-name:var(--font-heading)] leading-tight text-foreground">
        {isLinkedIn ? (
          <a
            href={post.externalUrl || siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={titleClass}
          >
            {post.title}
            <ArrowUpRight className="ml-1 inline size-4" aria-hidden="true" />
            <span className="sr-only"> (opens LinkedIn)</span>
          </a>
        ) : (
          <Link href={`/blog/${post.slug}`} className={titleClass}>
            {post.title}
          </Link>
        )}
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">{post.description}</p>
      {post.tags?.length ? (
        <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-1.5">
          {post.tags.slice(0, 4).map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState<IBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FeedFilter>("all");

  useEffect(() => {
    let cancelled = false;

    fetch("/api/blog")
      .then((res) => (res.ok ? res.json() : []))
      .then((data: unknown) => {
        if (!cancelled && Array.isArray(data)) setPosts(data as IBlog[]);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const linkedinCount = posts.filter((post) => post.source === "linkedin").length;
  const filters: { value: FeedFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: posts.length },
    { value: "article", label: "Articles", count: posts.length - linkedinCount },
    { value: "linkedin", label: "LinkedIn", count: linkedinCount },
  ];

  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts;
    return posts.filter((post) => (post.source === "linkedin") === (activeFilter === "linkedin"));
  }, [activeFilter, posts]);

  return (
    <>
      <PageHeader title="Blog" description="Articles and LinkedIn posts, newest first." />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {loading ? (
            <p role="status" className="py-16 text-center text-sm text-muted-foreground">
              Loading posts
            </p>
          ) : posts.length === 0 ? (
            <div className="anime-card mx-auto max-w-xl rounded-2xl p-8 text-center">
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)] text-foreground">
                No posts yet
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Nothing has been published here so far. Posts will show up on this
                page when there are some.
              </p>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="anime-btn-outline mt-6 inline-flex items-center gap-2"
              >
                <Linkedin size={16} aria-hidden="true" />
                LinkedIn profile
              </a>
            </div>
          ) : (
            <>
              <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Filter posts">
                {filters.map((filter) => (
                  <button
                    key={filter.value}
                    type="button"
                    aria-pressed={activeFilter === filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={`min-h-11 cursor-pointer rounded-xl border px-4 text-xs font-semibold transition-colors ${
                      activeFilter === filter.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                    }`}
                  >
                    {filter.label} <span className="ml-1 opacity-70">{filter.count}</span>
                  </button>
                ))}
              </div>

              {filteredPosts.length === 0 ? (
                <p className="py-10 text-center text-sm text-muted-foreground">
                  No posts in this category.
                </p>
              ) : (
                <ul className="grid items-stretch gap-7 md:grid-cols-2">
                  {filteredPosts.map((post) => (
                    <li key={post._id || post.slug}>
                      <PostCard post={post} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
