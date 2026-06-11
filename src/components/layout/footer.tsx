"use client";

import Link from "next/link";
import { Mail, FileText, Heart } from "lucide-react";
import { Github, Linkedin } from "@/components/shared/brand-icons";
import { siteConfig, navLinks } from "@/lib/constants";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative border-t border-border">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-xl font-bold font-[family-name:var(--font-heading)] gradient-text cursor-pointer">
              Kunal Singh
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              AI Engineer & Full Stack Developer crafting intelligent applications
              and scalable solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold font-[family-name:var(--font-heading)] uppercase tracking-wider text-muted-foreground">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {navLinks.slice(0, 8).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold font-[family-name:var(--font-heading)] uppercase tracking-wider text-muted-foreground">
              Connect
            </h3>
            <div className="flex gap-3">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
              <a
                href={siteConfig.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href={`mailto:${siteConfig.email}`}
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
              <a
                href={siteConfig.links.resume}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all duration-300 cursor-pointer"
                aria-label="Resume"
              >
                <FileText size={18} />
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              {siteConfig.email}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Kunal Singh. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            Built with <Heart className="w-3.5 h-3.5 text-primary fill-primary" /> by Kunal Singh
          </p>
        </div>
      </div>
    </footer>
  );
}
