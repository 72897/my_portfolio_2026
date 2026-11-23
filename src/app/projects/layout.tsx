import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Projects",
  description:
    "Projects by Kunal Singh: the TIQ internal operations platform, StudyMate, AlphaCare, StudyNotion, Duli Interiors, Buddhimaan and Travel Planner, with stack and links.",
  path: "/projects",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
