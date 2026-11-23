"use client";

import Link from "next/link";
import { Code2, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { Github, Linkedin } from "@/components/shared/brand-icons";
import { navLinks, siteConfig } from "@/lib/constants";

const footerLinks = [
  ...navLinks.filter((link) => link.href !== "/"),
  { name: "Resume", href: "/resume" },
];

const socialLinks = [
  { label: "GitHub", href: siteConfig.links.github, icon: Github },
  { label: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
  { label: "LeetCode", href: siteConfig.links.leetcode, icon: Code2 },
  { label: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
];

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="site-footer relative print:hidden">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-bold tracking-[-0.03em]">
              Kunal<span className="text-primary">/</span>Singh
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              Software engineer working on AI automation and full-stack web.
              Based in {siteConfig.location}.
            </p>
            <a
              href={`mailto:${siteConfig.email}`}
              className="mt-4 inline-block text-sm font-medium text-foreground underline-offset-4 hover:text-primary hover:underline"
            >
              {siteConfig.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Pages
            </h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Profiles
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => {
                const external = href.startsWith("http");
                return (
                  <li key={label}>
                    <a
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      className="grid size-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                      aria-label={label}
                    >
                      <Icon size={17} aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <p className="mt-10 border-t border-border/60 pt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
