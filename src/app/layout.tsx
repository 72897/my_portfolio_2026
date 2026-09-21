import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Chatbot } from "@/components/layout/chatbot";
import { Toaster } from "sonner";
import { CommandPalette } from "@/components/effects/command-palette";
import { TerminalModal } from "@/components/effects/terminal-modal";
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
    template: "%s | Kunal Singh",
  },
  description: defaultDescription,
  keywords: [
    "Kunal Singh",
    "AI Engineer",
    "Full Stack Developer",
    "Portfolio",
    "React",
    "Next.js",
    "Python",
    "Machine Learning",
    "LangChain",
    "GenAI",
  ],
  authors: [{ name: "Kunal Singh", url: siteConfig.url }],
  creator: "Kunal Singh",
  // "./" resolves to each route's own path, so every page self-canonicalizes.
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "./",
    title: defaultTitle,
    description:
      "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications.",
    siteName,
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description:
      "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications.",
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
      <body className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20 selection:text-primary">
        <ThemeProvider>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: siteJsonLd }}
          />
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Navbar />
          <main id="main-content" className="min-h-[50vh] pt-20 relative z-10">{children}</main>
          <CommandPalette />
          <TerminalModal />
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
