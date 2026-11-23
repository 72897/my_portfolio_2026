import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { IBlog } from "@/types";

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Minimal Markdown: headings, bold, italic, inline code and paragraphs. */
function renderContent(content: string) {
  return escapeHtml(content)
    .split(/\n{2,}/)
    .map((block) => {
      const heading = block.match(/^(#{1,3}) (.*)$/);
      const inline = (text: string) =>
        text
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>")
          .replace(/`([^`]+)`/g, "<code>$1</code>");
      if (heading) {
        const tag = heading[1].length === 3 ? "h3" : "h2";
        return `<${tag}>${inline(heading[2])}</${tag}>`;
      }
      return `<p>${inline(block).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

export function BlogPostView({ post }: { post: IBlog }) {
  const readingTime = Math.max(1, Math.ceil((post.content?.split(/\s+/).length || 0) / 200));
  const publishedAt = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <>
      <section className="py-20 grid-pattern">
        <div className="mx-auto max-w-3xl px-4">
          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All posts
          </Link>

          <h1 className="text-3xl font-bold font-[family-name:var(--font-heading)] leading-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{post.description}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            {[publishedAt, `${readingTime} min read`].filter(Boolean).join(" · ")}
          </p>

          {post.tags?.length ? (
            <ul aria-label="Tags" className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                >
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </section>

      <section className="py-16">
        <article
          className="mx-auto max-w-3xl space-y-5 px-4 text-base leading-relaxed text-muted-foreground [&_code]:rounded [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_h2]:pt-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:pt-2 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_strong]:text-foreground"
          dangerouslySetInnerHTML={{ __html: renderContent(post.content ?? "") }}
        />
      </section>
    </>
  );
}
