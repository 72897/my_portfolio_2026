"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Code2, Loader2, Mail, MapPin, Phone, Send } from "lucide-react";
import { Github, Linkedin } from "@/components/shared/brand-icons";
import { PageHeader } from "@/components/shared/page-header";
import { siteConfig } from "@/lib/constants";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

type SubmitState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string };

const profileLinks = [
  { name: "GitHub", href: siteConfig.links.github, icon: Github },
  { name: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
  { name: "LeetCode", href: siteConfig.links.leetcode, icon: Code2 },
];

const fallbackError = `Your message could not be sent. Please email ${siteConfig.email} instead.`;

export default function ContactPage() {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setSubmitState({ status: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        reset();
        setSubmitState({ status: "sent" });
        return;
      }
      const body: { error?: string } | null = await res.json().catch(() => null);
      // 4xx errors describe what to fix; 5xx errors are not useful to a visitor.
      setSubmitState({
        status: "error",
        message: res.status < 500 && body?.error ? body.error : fallbackError,
      });
    } catch {
      setSubmitState({ status: "error", message: fallbackError });
    }
  };

  const fields = [
    {
      id: "name" as const,
      label: "Name",
      type: "text",
      autoComplete: "name",
      rules: {
        required: "Enter your name",
        minLength: { value: 2, message: "Name must be at least 2 characters" },
      },
    },
    {
      id: "email" as const,
      label: "Email",
      type: "email",
      autoComplete: "email",
      rules: {
        required: "Enter your email address",
        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid email address" },
      },
    },
    {
      id: "subject" as const,
      label: "Subject",
      type: "text",
      autoComplete: "off",
      rules: {
        required: "Enter a subject",
        minLength: { value: 3, message: "Subject must be at least 3 characters" },
      },
    },
  ];

  return (
    <>
      <PageHeader
        title="Contact"
        description="Send a message with the form, or email me directly."
      />

      <section className="py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <h2 className="sr-only">Send a message</h2>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="anime-card space-y-6 rounded-2xl p-6 sm:p-8"
            >
              {fields.map((field) => {
                const error = errors[field.id]?.message;
                return (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="mb-2 block text-sm font-medium">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `${field.id}-error` : undefined}
                      {...register(field.id, field.rules)}
                      className="anime-input w-full"
                    />
                    {error ? (
                      <p id={`${field.id}-error`} className="mt-1 text-xs text-red-500">
                        {error}
                      </p>
                    ) : null}
                  </div>
                );
              })}

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? "message-error" : undefined}
                  {...register("message", {
                    required: "Enter a message",
                    minLength: { value: 10, message: "Message must be at least 10 characters" },
                  })}
                  className="anime-input w-full resize-y"
                />
                {errors.message ? (
                  <p id="message-error" className="mt-1 text-xs text-red-500">
                    {errors.message.message}
                  </p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="anime-btn flex w-full cursor-pointer items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="size-4" aria-hidden="true" />
                    Send message
                  </>
                )}
              </button>

              <div aria-live="polite">
                {submitState.status === "sent" ? (
                  <p className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-foreground">
                    Message sent. Thanks for getting in touch.
                  </p>
                ) : null}
                {submitState.status === "error" ? (
                  <p className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-foreground">
                    {submitState.message}
                  </p>
                ) : null}
              </div>
            </form>
          </div>

          <div className="space-y-8">
            <div className="anime-card rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">
                Contact details
              </h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a href={`mailto:${siteConfig.email}`} className="font-medium hover:text-primary hover:underline">
                    {siteConfig.email}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s+/g, "")}`}
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="font-medium">{siteConfig.location}</span>
                </li>
              </ul>
            </div>

            <div className="anime-card rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-bold font-[family-name:var(--font-heading)]">Profiles</h2>
              <ul className="mt-4 space-y-1">
                {profileLinks.map((profile) => (
                  <li key={profile.name}>
                    <a
                      href={profile.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <profile.icon className="size-5" aria-hidden="true" />
                      {profile.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
