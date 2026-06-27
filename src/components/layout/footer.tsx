"use client";

import Link from "next/link";
import { ArrowUpRight, Code2, FileText, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { Github, Linkedin } from "@/components/shared/brand-icons";
import { navLinks, siteConfig } from "@/lib/constants";

const footerLinks = navLinks.filter((link) =>
  ["/about", "/skills", "/experience", "/projects", "/github", "/leetcode", "/certificates", "/blog", "/contact"].includes(link.href)
);

export function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const socialLinks = [
    { label: "GitHub", href: siteConfig.links.github, icon: Github },
    { label: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
    { label: "Email", href: `mailto:${siteConfig.email}`, icon: Mail },
    { label: "Resume", href: siteConfig.links.resume, icon: FileText },
  ];

  return (
    <footer className="site-footer relative">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="footer-cta mb-16">
          <div className="max-w-3xl">
            <span className="eyebrow">
              <Code2 size={14} aria-hidden="true" />
              Available for select opportunities
            </span>
            <h2 className="mt-5 text-4xl font-bold tracking-[-0.055em] sm:text-5xl md:text-6xl">
              Have an ambitious idea?
              <br />
              <span className="gradient-text">Let&apos;s make it real.</span>
            </h2>
          </div>
          <a
            href="/contact"
            className="anime-btn relative z-10 shrink-0 pointer-events-auto"
            aria-label="Start a conversation on the contact page"
          >
            Start a conversation <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>

        <div className="grid gap-10 border-t border-border/60 pt-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="text-lg font-bold tracking-[-0.03em]">
              Kunal<span className="text-primary">/</span>Singh
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              AI engineer and full-stack developer building intelligent, useful,
              and scalable digital products.
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Navigate
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Connect
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="grid size-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
                  aria-label={label}
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Kunal Singh. All rights reserved.</p>
          <p>Designed &amp; engineered in Greater Noida, India.</p>
        </div>
      </div>
    </footer>
  );
}
