"use client";

import { Award, ExternalLink } from "lucide-react";
import { certificates as fallbackCertificates } from "@/lib/constants";
import { PageHeader } from "@/components/shared/page-header";
import { useRemoteList } from "@/components/shared/use-remote-list";
import type { ICertificate } from "@/types";

export default function CertificatesPage() {
  const certificates = useRemoteList<ICertificate>("/api/certificates", fallbackCertificates);

  return (
    <>
      <PageHeader
        title="Certifications"
        description="Courses and job simulations I have completed."
      />

      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((certificate) => (
              <li
                key={certificate._id || `${certificate.title}-${certificate.organization}`}
                className="anime-card flex items-start gap-4 rounded-2xl p-6"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10">
                  <Award className="size-5 text-primary" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold font-[family-name:var(--font-heading)]">
                    {certificate.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{certificate.organization}</p>
                  {certificate.credentialUrl ? (
                    <a
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <ExternalLink className="size-3" aria-hidden="true" />
                      View credential
                    </a>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
