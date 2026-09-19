import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Kunal Singh, an AI Engineer and Full Stack Developer from Greater Noida with a B.Tech in Computer Science from Gautam Buddha University, building RAG systems and agentic workflows.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
