import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Skills",
  description:
    "The languages, frameworks and tools Kunal Singh works with: Python, TypeScript, React, Next.js, Node.js, LangChain, n8n, Dify and MCP servers.",
  path: "/skills",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
