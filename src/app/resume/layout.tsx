import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Resume",
  description:
    "Resume of Kunal Singh, software engineer: experience, projects, skills, education and certifications. Download the PDF or print the page.",
  path: "/resume",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
