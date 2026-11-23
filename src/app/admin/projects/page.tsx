'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, ExternalLink, Star, FolderKanban } from 'lucide-react';
import { Github } from '@/components/shared/brand-icons';
import type { IProject } from '@/types';
import { apiRequest, errorMessage, useAdminList } from '../_lib/api';
import { LoadError } from '../_components/load-error';

const PROJECT_CATEGORIES = ['AI', 'FullStack', 'WebApp', 'Backend', 'Automation', 'Resume'] as const;
const PROJECT_STATUSES = ['Live', 'Internal', 'Archived'] as const;

interface ProjectForm {
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  techStack: string;
  features: string;
  githubUrl: string;
  liveUrl: string;
  image: string;
  category: IProject['category'];
  featured: boolean;
  role: string;
  year: string;
  status: '' | (typeof PROJECT_STATUSES)[number];
  order: number;
}

const emptyForm: ProjectForm = {
  title: '',
  slug: '',
  description: '',
  longDescription: '',
  techStack: '',
  features: '',
  githubUrl: '',
  liveUrl: '',
  image: '',
  category: 'FullStack',
  featured: false,
  role: '',
  year: '',
  status: '',
  order: 0,
};

const toForm = (project: IProject): ProjectForm => ({
  title: project.title,
  slug: project.slug,
  description: project.description,
  longDescription: project.longDescription ?? '',
  techStack: (project.techStack ?? []).join(', '),
  features: (project.features ?? []).join('\n'),
  githubUrl: project.githubUrl ?? '',
  liveUrl: project.liveUrl ?? '',
  image: project.image ?? '',
  category: project.category,
  featured: Boolean(project.featured),
  role: project.role ?? '',
  year: project.year ?? '',
  status: project.status ?? '',
  order: project.order ?? 0,
});

const toPayload = (form: ProjectForm) => ({
  ...form,
  techStack: form.techStack.split(',').map((s) => s.trim()).filter(Boolean),
  features: form.features.split('\n').map((s) => s.trim()).filter(Boolean),
});

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function AdminProjectsPage() {
  const { data: session } = useSession();
  const { items: projects, loading, error, reload } = useAdminList<IProject>('/api/projects', Boolean(session));
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof ProjectForm>(key: K, value: ProjectForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (project: IProject) => {
    setForm(toForm(project));
    setEditingId(project._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiRequest(editingId ? `/api/projects/${editingId}` : '/api/projects', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(toPayload(form)),
      });
      toast.success(editingId ? 'Project updated' : 'Project created');
      resetForm();
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to save project'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project? This cannot be undone.')) return;
    try {
      await apiRequest(`/api/projects/${id}`, { method: 'DELETE' });
      toast.success('Project deleted');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete project'));
    }
  };

  if (!session) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Projects
          </h1>
          <p className="text-muted-foreground mt-1">Projects shown on the site</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="anime-btn flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Project' : 'New Project'}
            </h2>
            <button
              onClick={resetForm}
              aria-label="Close form"
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="project-title" className="block text-sm font-medium text-foreground">Title</label>
                <input
                  id="project-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => {
                    const title = e.target.value;
                    setForm((prev) => ({
                      ...prev,
                      title,
                      // Keep the slug in step with the title until the project exists.
                      slug: editingId || prev.slug !== slugify(prev.title) ? prev.slug : slugify(title),
                    }));
                  }}
                  required
                  maxLength={200}
                  className="anime-input"
                  placeholder="Project title"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-slug" className="block text-sm font-medium text-foreground">
                  Slug <span className="text-muted-foreground font-normal">(used in the page URL)</span>
                </label>
                <input
                  id="project-slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => set('slug', e.target.value.toLowerCase())}
                  required
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  title="Lowercase letters, numbers and hyphens"
                  className="anime-input"
                  placeholder="project-slug"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="project-description" className="block text-sm font-medium text-foreground">
                Short description
              </label>
              <textarea
                id="project-description"
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                required
                maxLength={1000}
                rows={2}
                className="anime-input resize-none"
                placeholder="One or two sentences for project cards"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project-long-description" className="block text-sm font-medium text-foreground">
                Full description <span className="text-muted-foreground font-normal">(project page)</span>
              </label>
              <textarea
                id="project-long-description"
                value={form.longDescription}
                onChange={(e) => set('longDescription', e.target.value)}
                maxLength={5000}
                rows={4}
                className="anime-input resize-y"
                placeholder="What was built, with what, and what happened"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="project-role" className="block text-sm font-medium text-foreground">Role</label>
                <input
                  id="project-role"
                  type="text"
                  value={form.role}
                  onChange={(e) => set('role', e.target.value)}
                  maxLength={100}
                  className="anime-input"
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-year" className="block text-sm font-medium text-foreground">Year</label>
                <input
                  id="project-year"
                  type="text"
                  value={form.year}
                  onChange={(e) => set('year', e.target.value)}
                  maxLength={20}
                  className="anime-input"
                  placeholder="2026"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-status" className="block text-sm font-medium text-foreground">Status</label>
                <select
                  id="project-status"
                  value={form.status}
                  onChange={(e) => set('status', e.target.value as ProjectForm['status'])}
                  className="anime-input cursor-pointer"
                >
                  <option value="">Not set</option>
                  {PROJECT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="project-stack" className="block text-sm font-medium text-foreground">
                Tech stack <span className="text-muted-foreground font-normal">(comma-separated)</span>
              </label>
              <input
                id="project-stack"
                type="text"
                value={form.techStack}
                onChange={(e) => set('techStack', e.target.value)}
                className="anime-input"
                placeholder="React, Node.js, MongoDB"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="project-features" className="block text-sm font-medium text-foreground">
                Features <span className="text-muted-foreground font-normal">(one per line)</span>
              </label>
              <textarea
                id="project-features"
                value={form.features}
                onChange={(e) => set('features', e.target.value)}
                rows={4}
                className="anime-input resize-y"
                placeholder={'Feature one\nFeature two'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="project-github" className="block text-sm font-medium text-foreground">
                  GitHub URL <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  id="project-github"
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => set('githubUrl', e.target.value)}
                  className="anime-input"
                  placeholder="https://github.com/..."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-live" className="block text-sm font-medium text-foreground">
                  Live URL <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  id="project-live"
                  type="url"
                  value={form.liveUrl}
                  onChange={(e) => set('liveUrl', e.target.value)}
                  className="anime-input"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label htmlFor="project-image" className="block text-sm font-medium text-foreground">
                  Image <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  id="project-image"
                  type="text"
                  value={form.image}
                  onChange={(e) => set('image', e.target.value)}
                  className="anime-input"
                  placeholder="/project_preview.png"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="project-category" className="block text-sm font-medium text-foreground">Category</label>
                <select
                  id="project-category"
                  value={form.category}
                  onChange={(e) => set('category', e.target.value as IProject['category'])}
                  className="anime-input cursor-pointer"
                >
                  {PROJECT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label htmlFor="project-order" className="block text-sm font-medium text-foreground">Display order</label>
                <input
                  id="project-order"
                  type="number"
                  min={0}
                  value={form.order}
                  onChange={(e) => set('order', Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="anime-input"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="project-featured"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 cursor-pointer"
              />
              <label htmlFor="project-featured" className="text-sm font-medium text-foreground cursor-pointer">
                Featured on the home page
              </label>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button type="submit" disabled={saving} className="anime-btn disabled:opacity-50">
                {saving ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
              </button>
              <button type="button" onClick={resetForm} className="anime-btn-outline">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <LoadError message={error} onRetry={reload} />}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="anime-card rounded-2xl p-5 animate-pulse">
              <div className="h-5 bg-muted rounded w-3/4 mb-3" />
              <div className="h-4 bg-muted rounded w-1/2 mb-4" />
              <div className="h-3 bg-muted rounded w-full" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        !error && (
          <div className="anime-card rounded-2xl p-12 text-center">
            <FolderKanban className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No projects in the database. The site shows its built-in list until you add one.
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="anime-card rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold font-[family-name:var(--font-heading)] text-foreground truncate">
                      {project.title}
                    </h3>
                    {project.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 shrink-0" aria-label="Featured" />
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1 text-xs">
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary">{project.category}</span>
                    {project.status && (
                      <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{project.status}</span>
                    )}
                    {project.year && <span className="text-muted-foreground">{project.year}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open GitHub repository"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Open live site"
                      className="p-1.5 text-muted-foreground hover:text-foreground transition cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(project)}
                    aria-label={`Edit ${project.title}`}
                    className="p-1.5 text-muted-foreground hover:text-primary transition cursor-pointer"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => project._id && handleDelete(project._id)}
                    aria-label={`Delete ${project.title}`}
                    className="p-1.5 text-muted-foreground hover:text-destructive transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {(project.techStack ?? []).slice(0, 5).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground">
                    {tech}
                  </span>
                ))}
                {(project.techStack ?? []).length > 5 && (
                  <span className="px-2 py-0.5 text-xs bg-muted rounded-md text-muted-foreground">
                    +{project.techStack.length - 5}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
