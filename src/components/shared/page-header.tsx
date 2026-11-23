import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  children?: ReactNode;
}

/** First section of an inner page. Holds the page's only h1. */
export function PageHeader({
  title,
  description,
  align = "center",
  className,
  children,
}: PageHeaderProps) {
  return (
    <section className={cn("py-20 grid-pattern", className)}>
      <div
        className={cn(
          "mx-auto max-w-6xl px-4 sm:px-6",
          align === "center" && "text-center"
        )}
      >
        <h1 className="text-4xl font-bold font-[family-name:var(--font-heading)] text-foreground md:text-5xl lg:text-6xl">
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-2xl text-base text-muted-foreground md:text-lg",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-6">{children}</div> : null}
      </div>
    </section>
  );
}
