import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Notes, build logs, and LinkedIn insights from Kunal Singh on AI engineering, agentic workflows, and working as a developer.",
  path: "/blog",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
