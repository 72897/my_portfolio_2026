import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Work experience of Kunal Singh across software engineering and AI internships, covering full-stack development, GenAI pipelines, and production delivery.",
  path: "/experience",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
