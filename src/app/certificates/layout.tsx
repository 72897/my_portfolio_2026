import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Certifications",
  description:
    "Certifications completed by Kunal Singh, from Google Cloud, AWS, Postman, HP LIFE and Forage job simulations with Walmart and Deloitte.",
  path: "/certificates",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
