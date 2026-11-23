'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, X, Zap } from 'lucide-react';
import type { ISkill } from '@/types';
import { apiRequest, errorMessage, useAdminList } from '../_lib/api';
import { LoadError } from '../_components/load-error';

// Suggestions only: a skill can use any category name.
const SUGGESTED_CATEGORIES = [
  'Languages',
  'Frontend',
  'Backend',
  'Data',
  'AI/ML',
  'Automation and integrations',
  'Tools',
];

const emptySkill: Partial<ISkill> = {
  name: '',
  category: 'Languages',
  icon: '',
  order: 1,
};

export default function AdminSkillsPage() {
  const { data: session } = useSession();
  const { items: skills, loading, error, reload } = useAdminList<ISkill>(
    '/api/skills',
    Boolean(session)
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ISkill>>(emptySkill);
  const [saving, setSaving] = useState(false);

  const resetForm = () => {
    setFormData(emptySkill);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (skill: ISkill) => {
    setFormData(skill);
    setEditingId(skill._id || null);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiRequest(editingId ? `/api/skills/${editingId}` : '/api/skills', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify(formData),
      });
      toast.success(editingId ? 'Skill updated' : 'Skill created');
      resetForm();
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to save'));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;

    try {
      await apiRequest(`/api/skills/${id}`, { method: 'DELETE' });
      toast.success('Skill deleted');
      reload();
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete'));
    }
  };

  if (!session) return null;

  // Every category present in the data is listed, in first-seen order.
  const categories = Array.from(new Set(skills.map((skill) => skill.category)));
  const categoryOptions = Array.from(new Set([...categories, ...SUGGESTED_CATEGORIES]));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold font-[family-name:var(--font-heading)] text-foreground">
            Skills
          </h1>
          <p className="text-muted-foreground mt-1">
            Skills shown on the site, grouped by category
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="anime-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)]">
              {editingId ? 'Edit Skill' : 'New Skill'}
            </h2>
            <button
              onClick={resetForm}
              className="text-muted-foreground hover:text-foreground transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Skill Name</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. React.js, Python"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Category</label>
                <input
                  type="text"
                  list="skill-categories"
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  maxLength={80}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="Pick or type a category"
                />
                <datalist id="skill-categories">
                  {categoryOptions.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Icon name <span className="text-muted-foreground font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.icon || ''}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  placeholder="e.g. terminal, atom, server"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={formData.order ?? 0}
                  onChange={(e) =>
                    setFormData({ ...formData, order: Math.max(0, parseInt(e.target.value, 10) || 0) })
                  }
                  required
                  className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-50"
              >
                {saving ? 'Saving...' : editingId ? 'Update Skill' : 'Create Skill'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-muted text-foreground rounded-xl hover:opacity-80 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {error && <LoadError message={error} onRetry={reload} />}

      {/* Skills Grouped Grid */}
      {loading ? (
        <div className="space-y-8">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="space-y-3">
              <div className="h-6 bg-muted rounded w-48 animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="anime-card rounded-xl p-4 h-16 animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : error && skills.length === 0 ? null : skills.length === 0 ? (
        <div className="anime-card rounded-2xl p-12 text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No skills in the database. The site shows its built-in list until you add one.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map((category) => {
            const catSkills = skills.filter((skill) => skill.category === category);

            return (
              <div key={category} className="space-y-3">
                <h2 className="text-lg font-semibold font-[family-name:var(--font-heading)] text-foreground border-l-3 border-primary pl-2.5">
                  {category}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[...catSkills]
                    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                    .map((skill) => (
                      <div
                        key={skill._id}
                        className="anime-card rounded-xl p-4 flex items-center justify-between group"
                      >
                        <span className="flex-1 min-w-0 mr-3 font-medium text-foreground truncate text-sm">
                          {skill.name}
                        </span>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleEdit(skill)}
                            className="p-1 text-muted-foreground hover:text-primary transition cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => skill._id && handleDelete(skill._id)}
                            className="p-1 text-muted-foreground hover:text-destructive transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
