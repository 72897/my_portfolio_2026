"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  ExternalLink,
  Building2,
  Calendar,
} from "lucide-react";
import { certificates as fallbackCerts } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";

interface Certificate {
  title: string;
  organization: string;
  date?: string;
  issueDate?: string;
  credentialUrl?: string;
}

export default function CertificatesPage() {
  const [certs, setCerts] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await fetch("/api/certificates");
        if (res.ok) {
          const data = await res.json();
          setCerts(data.certificates || data);
        } else {
          setCerts(fallbackCerts);
        }
      } catch {
        setCerts(fallbackCerts);
      } finally {
        setLoading(false);
      }
    }
    fetchCerts();
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="py-20 bg-muted/30 grid-pattern">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-[family-name:var(--font-heading)]">
              <span className="gradient-text">Certifications</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional certifications and credentials I&apos;ve earned
            </p>
          </motion.div>
        </div>
      </section>

      {/* Certificates Grid */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="anime-card rounded-2xl p-6 h-40 animate-shimmer"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {certs.map((cert, i) => (
                <motion.div
                  key={cert.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="anime-card rounded-2xl p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold font-[family-name:var(--font-heading)] text-base">
                        {cert.title}
                      </h3>
                      <p className="mt-1 text-sm text-primary flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5" />
                        {cert.organization}
                      </p>
                      {(cert.date || cert.issueDate) && (
                        <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {cert.date || cert.issueDate}
                        </p>
                      )}
                      {cert.credentialUrl && (
                        <a
                          href={cert.credentialUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-1 text-xs text-primary cursor-pointer hover:underline"
                        >
                          <ExternalLink className="w-3 h-3" />
                          View Credential
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
