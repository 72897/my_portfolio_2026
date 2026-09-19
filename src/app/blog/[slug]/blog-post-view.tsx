"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Tag,
  Clock,
} from "lucide-react";
import type { IBlog } from "@/types";

export function BlogPostView({ post }: { post: IBlog }) {
  // Estimate reading time
  const readingTime = Math.max(
    1,
    Math.ceil((post.content?.split(/\s+/).length || 0) / 200)
  );

  return (
    <>
      {/* Header */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer mb-6 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Link>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-heading)] leading-tight">
              {post.title}
            </h1>
            <p className="mt-4 text-muted-foreground text-lg">
              {post.description}
            </p>

            <div className="mt-6 flex items-center flex-wrap gap-4 text-sm text-muted-foreground">
              {post.publishedAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readingTime} min read
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                  >
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-[family-name:var(--font-heading)] prose-a:text-primary prose-code:font-[family-name:var(--font-mono)] prose-code:text-sm prose-pre:bg-card prose-pre:border prose-pre:border-border"
            dangerouslySetInnerHTML={{
              __html: post.content
                .replace(/^### (.*$)/gim, "<h3>$1</h3>")
                .replace(/^## (.*$)/gim, "<h2>$1</h2>")
                .replace(/^# (.*$)/gim, "<h2>$1</h2>")
                .replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>")
                .replace(/\*(.*?)\*/gim, "<em>$1</em>")
                .replace(/`([^`]+)`/gim, "<code>$1</code>")
                .replace(/\n/gim, "<br />"),
            }}
          />
        </div>
      </section>
    </>
  );
}
