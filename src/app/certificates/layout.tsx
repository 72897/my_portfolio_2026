import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Certifications",
  description:
    "Certifications earned by Kunal Singh in cloud computing, generative AI, and APIs.",
  path: "/certificates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
