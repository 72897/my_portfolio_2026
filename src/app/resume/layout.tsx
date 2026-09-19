import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Resume of Kunal Singh, AI Engineer and Full Stack Developer: experience, projects, education, and skills.",
  path: "/resume",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
