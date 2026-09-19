import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "GitHub Stats",
  description:
    "Kunal Singh's GitHub activity: repositories, languages, and contribution history across AI and full-stack projects.",
  path: "/github",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
