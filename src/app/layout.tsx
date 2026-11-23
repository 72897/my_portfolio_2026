import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/layout/chatbot";
import { SmoothScroll } from "@/components/layout/smooth-scroll";
import { Toaster } from "sonner";
import { siteConfig } from "@/lib/constants";
import {
  defaultDescription,
  defaultOgImage,
  defaultTitle,
  jsonLdScript,
  personJsonLd,
  siteName,
  websiteJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: defaultTitle,
    template: `%s | ${siteConfig.name}`,
  },
  description: defaultDescription,
  keywords: [
    siteConfig.name,
    "Software Engineer",
    "AI automation",
    "Full-stack developer",
    "Python",
    "TypeScript",
    "Next.js",
    "Node.js",
    "LangChain",
    "Greater Noida",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  // "./" resolves to each route's own path, so every page self-canonicalizes.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    title: defaultTitle,
    description: defaultDescription,
    siteName,
    images: [defaultOgImage],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description: defaultDescription,
    images: [defaultOgImage.url],
  },
};

const siteJsonLd = jsonLdScript({ "@graph": [personJsonLd, websiteJsonLd] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary print:bg-white print:text-black">
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: siteJsonLd }}
          />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <SmoothScroll />
          <Navbar />
          <main id="main-content" className="relative z-10 min-h-[50vh] pt-20 print:pt-0">{children}</main>
          <Chatbot />
          <Footer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                color: "var(--color-foreground)",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
