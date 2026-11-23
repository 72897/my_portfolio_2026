import type { Metadata } from "next";
import { languages, siteConfig } from "@/lib/constants";

export const siteName = "Kunal Singh Portfolio";
export const defaultTitle = `${siteConfig.name} | ${siteConfig.title}`;
export const defaultDescription =
  "Software engineer at Technocratiq Digital. I build the company's internal operations platform and its automations in Python and TypeScript.";

// Explicit because a route that sets its own `openGraph` drops the
// file-based image from app/opengraph-image.tsx.
export const defaultOgImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Kunal Singh, Software Engineer: AI automation and full-stack web",
};

export function absoluteUrl(path = "") {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteConfig.url}${path}`;
}

/**
 * Metadata for a single route. Child `openGraph`/`twitter` objects replace the
 * parent's rather than merging, so the shared fields are repeated here.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article" | "profile";
}): Metadata {
  const fullTitle = `${title} | ${siteConfig.name}`;
  return {
    // `absolute` because a nested layout's plain-string title stops the root
    // template from reaching its children (e.g. /blog -> /blog/[slug]).
    title: { absolute: fullTitle },
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: "en_US",
      siteName,
      url: path,
      title: fullTitle,
      description,
      images: [defaultOgImage],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [defaultOgImage.url],
    },
  };
}

export const personJsonLd = {
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: "Software Engineer",
  description: siteConfig.description,
  worksFor: {
    "@type": "Organization",
    name: "Technocratiq Digital Pvt. Ltd.",
  },
  email: `mailto:${siteConfig.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Greater Noida",
    addressRegion: "Uttar Pradesh",
    addressCountry: "IN",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Gautam Buddha University",
  },
  knowsAbout: [
    "Python",
    "TypeScript",
    "Next.js",
    "React",
    "Node.js",
    "REST APIs",
    "Workflow automation",
    "n8n",
    "Model Context Protocol",
    "Large Language Models",
    "Retrieval-Augmented Generation",
    "LangChain",
    "MongoDB",
  ],
  knowsLanguage: languages.map((language) => language.name),
  sameAs: [
    siteConfig.links.github,
    siteConfig.links.linkedin,
    siteConfig.links.leetcode,
  ],
};

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteName,
  inLanguage: "en",
  publisher: { "@id": `${siteConfig.url}/#person` },
};

/** Serialize JSON-LD for a <script> tag, escaping `<` so content can't close it. */
export function jsonLdScript(data: object) {
  return JSON.stringify({ "@context": "https://schema.org", ...data }).replace(
    /</g,
    "\u003c"
  );
}
