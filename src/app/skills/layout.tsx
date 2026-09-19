import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills",
  description:
    "Kunal Singh's technical skills: Python, LangChain, LLM integration and RAG, React, Next.js, Node.js, MongoDB, and the cloud and tooling used to ship AI products.",
  path: "/skills",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
