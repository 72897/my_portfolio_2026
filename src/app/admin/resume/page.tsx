'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { FileText, Save, Download, Award } from 'lucide-react';

interface IResumeHighlights {
  experience: string;
  skills: string;
  projects: string;
  education: string;
  certifications: string;
}

interface IResumeData {
  summary: string;
  pdfUrl: string;
  highlights: IResumeHighlights;
  downloadCount: number;
}

export default function AdminResumePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState<Partial<IResumeData>>({
    summary: '',
    pdfUrl: 'https://drive.google.com/file/d/1t7Ws-Be5RBMl-QMIKngor6LCMr2gpBQ-/view?usp=sharing',
    highlights: {
      experience: '',
      skills: '',
      projects: '',
      education: '',
      certifications: '',
    },
    downloadCount: 0,
  });

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch('/api/resume');
        if (res.ok) {
          const data = await res.json();
          setResume(data);
        }
      } catch (error) {
        console.error('Failed to fetch resume settings:', error);
      } finally {
        setLoading(false);
      }
    }
    if (session) fetchResume();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(resume),
      });

      if (res.ok) {
        const data = await res.json();
        setResume(data);
        toast.success('Resume metadata updated successfully!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to update resume details');
      }
    } catch {
      toast.error('Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  if (!session) return null;

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-48" />
        <div className="anime-card rounded-2xl p-6 h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary" />
            Resume Settings
          </h1>
          <p className="text-muted-foreground mt-1">
            Review resume download metrics and adjust highlights
          </p>
        </div>

        {/* Stats card */}
        <div className="anime-card p-4 rounded-xl flex items-center gap-3.5 border border-border/80 min-w-[180px]">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">
              {resume.downloadCount || 0}
            </div>
            <div className="text-xs text-muted-foreground font-medium">
              Total Downloads
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Document Settings */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <FileText className="w-5 h-5 text-primary" />
            Resume Document Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-medium text-foreground">Resume PDF URL / Path</label>
              <input
                type="text"
                value={resume.pdfUrl || ''}
                onChange={(e) => setResume({ ...resume, pdfUrl: e.target.value })}
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. /resume/Resume_Kunal_Singh.pdf"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Professional Summary</label>
            <textarea
              value={resume.summary || ''}
              onChange={(e) => setResume({ ...resume, summary: e.target.value })}
              rows={4}
              required
              className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground resize-none leading-relaxed"
              placeholder="Brief summary matching your resume..."
            />
          </div>
        </div>

        {/* Highlight Cards */}
        <div className="anime-card rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] flex items-center gap-2 text-foreground pb-2 border-b border-border/50">
            <Award className="w-5 h-5 text-primary" />
            Resume Section Highlights
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Write short, bullet-point summaries or key takeaways for each resume section to display on the resume highlights page.
          </p>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Experience Highlights</label>
              <input
                type="text"
                value={resume.highlights?.experience || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, experience: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. 3 internships at Manipal, Thales, and MI Matdar"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Skills Highlights</label>
              <input
                type="text"
                value={resume.highlights?.skills || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, skills: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. Python, React.js, Node.js, TensorFlow, LangChain"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Projects Highlights</label>
              <input
                type="text"
                value={resume.highlights?.projects || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, projects: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. AI-powered StudyMate assistant & AlphaCare Voice AI chatbot"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Education Highlights</label>
              <input
                type="text"
                value={resume.highlights?.education || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, education: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. B.Tech in CSE at Gautam Buddha University (2022-2026)"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Certifications Highlights</label>
              <input
                type="text"
                value={resume.highlights?.certifications || ''}
                onChange={(e) =>
                  setResume({
                    ...resume,
                    highlights: { ...resume.highlights!, certifications: e.target.value },
                  })
                }
                required
                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                placeholder="e.g. Google Cloud GenAI, AWS Cloud, Walmart SWE, Postman API"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            <Save className="w-4.5 h-4.5" />
            {saving ? 'Saving...' : 'Save Highlights'}
          </button>
        </div>
      </form>
    </div>
  );
}
