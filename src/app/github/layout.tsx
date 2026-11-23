import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "GitHub",
  description:
    "Public GitHub repositories and languages for Kunal Singh (@72897), loaded from the GitHub API.",
  path: "/github",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
