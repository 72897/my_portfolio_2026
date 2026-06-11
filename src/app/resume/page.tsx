"use client";

import { motion } from "framer-motion";
import {
  Download,
  FileText,
  Briefcase,
  Code2,
  GraduationCap,
  Award,
  Brain,
} from "lucide-react";
import { siteConfig } from "@/lib/constants";
import { SectionHeading } from "@/components/section-heading";

const ICON_COLORS = ["text-primary", "text-secondary", "text-accent"];

const highlights = [
  {
    title: "Experience",
    content: "3 internships at Thales Group, Manipal Business Solutions, MI Matdar",
    icon: Briefcase,
  },
  {
    title: "Skills",
    content: "Python, React, Node.js, LangChain, TensorFlow, PyTorch & 20+ technologies",
    icon: Code2,
  },
  {
    title: "Projects",
    content: "StudyMate, AlphaCare, StudyNotion — AI & full-stack applications",
    icon: Brain,
  },
  {
    title: "Education",
    content: "B.Tech CSE (GBU), 12th PCM (St. Aerjay), 10th (Nirmala Convent)",
    icon: GraduationCap,
  },
  {
    title: "Certifications",
    content: "Google Cloud GenAI, AWS, Walmart USA, Deloitte, HP Life, Postman",
    icon: Award,
  },
];

export default function ResumePage() {
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
              My <span className="gradient-text">Resume</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              View and download my latest resume
            </p>
            <div className="mt-6">
              <a
                href={siteConfig.links.resume}
                download
                className="anime-btn inline-flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Resume (PDF)
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PDF Viewer */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="anime-card rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Resume_Kunal_Singh.pdf</span>
            </div>
            <iframe
              src={siteConfig.links.resume}
              title="Kunal Singh Resume"
              className="w-full h-[600px] md:h-[800px] bg-white"
            />
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <SectionHeading
            title="Resume Highlights"
            subtitle="Key takeaways at a glance"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="anime-card rounded-2xl p-6"
              >
                <h.icon className={`w-7 h-7 mb-3 ${ICON_COLORS[i % ICON_COLORS.length]}`} />
                <h3 className="font-bold font-[family-name:var(--font-heading)]">
                  {h.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {h.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
