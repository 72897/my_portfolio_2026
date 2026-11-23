import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "About Kunal Singh: software engineer at Technocratiq Digital in Delhi, B.Tech in Computer Science from Gautam Buddha University. Summary, education, languages and achievements.",
  path: "/about",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
