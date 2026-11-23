import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "LeetCode",
  description:
    "LeetCode problems solved by Kunal Singh (@kunal26_7), broken down by difficulty.",
  path: "/leetcode",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
