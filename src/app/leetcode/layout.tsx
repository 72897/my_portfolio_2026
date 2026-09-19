import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "LeetCode Stats",
  description:
    "Kunal Singh's LeetCode progress: problems solved by difficulty, contest rating, and data structures and algorithms practice.",
  path: "/leetcode",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
