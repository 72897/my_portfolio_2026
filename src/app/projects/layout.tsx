import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "AI and full-stack projects by Kunal Singh, including StudyMate, AlphaCare, Duli Interiors, and a course-selling platform, with live demos and source code.",
  path: "/projects",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
