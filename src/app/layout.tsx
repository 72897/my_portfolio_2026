import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AnimeBackground } from "@/components/effects/anime-background";
import { Chatbot } from "@/components/layout/chatbot";
import { Toaster } from "sonner";
import { ScrollNavButton } from "@/components/effects/scroll-nav-button";

export const metadata: Metadata = {
  title: {
    default: "Kunal Singh | AI Engineer & Full Stack Developer",
    template: "%s | Kunal Singh",
  },
  description:
    "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications. Explore my portfolio, projects, and experience.",
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
  authors: [{ name: "Kunal Singh" }],
  creator: "Kunal Singh",
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Kunal Singh | AI Engineer & Full Stack Developer",
    description:
      "AI Engineer and Full Stack Developer specializing in Generative AI, LLM integration, and scalable web applications.",
    siteName: "Kunal Singh Portfolio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <AnimeBackground />
          <Navbar />
          <main className="min-h-screen pt-16 relative z-10">{children}</main>
          <ScrollNavButton />
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
