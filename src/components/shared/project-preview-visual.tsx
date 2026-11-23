/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProjectPreviewVisualProps {
  image?: string;
  title: string;
  className?: string;
}

/** Project screenshot. Renders nothing when there is no image or it fails to load. */
export function ProjectPreviewVisual({
  image,
  title,
  className,
}: ProjectPreviewVisualProps) {
  const [failed, setFailed] = useState(false);

  if (!image || failed) return null;

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl border border-border bg-muted",
        className
      )}
    >
      <img
        src={image}
        alt={`Screenshot of ${title}`}
        className="absolute inset-0 h-full w-full object-cover object-top"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
