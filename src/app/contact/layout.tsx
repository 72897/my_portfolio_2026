import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hire Kunal Singh",
  description:
    "Hire Kunal Singh for freelance AI and full-stack projects or a full-time engineering role. Send a project brief or job opportunity.",
  path: "/contact",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
