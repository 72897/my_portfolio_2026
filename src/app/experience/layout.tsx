import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Experience",
  description:
    "Work history of Kunal Singh: software engineer at Technocratiq Digital, with earlier internships at Manipal Business Solution, Thales Group and MI Matdar.",
  path: "/experience",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
