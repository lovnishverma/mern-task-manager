import { useState, useEffect } from 'react';
import axios from 'axios';
import { Tag, CreateTagInput, UpdateTagInput } from '../types/task';

interface TagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: Tag[];
  onCreateTag: (tag: CreateTagInput) => Promise<void>;
  onUpdateTag: (id: string, tag: UpdateTagInput) => Promise<void>;
  onDeleteTag: (id: string) => Promise<void>;
}

const PRESET_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#64748B', // Slate
];

export default function TagManagerModal({
  isOpen,
  onClose,
  tags,
  onCreateTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagerModalProps) {
  const [newTagName, setNewTagName] = useState('');
  const [newTagColor, setNewTagColor] = useState(PRESET_COLORS[0]);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editColor, setEditColor] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setNewTagName('');
      setNewTagColor(PRESET_COLORS[0]);
      setEditingTagId(null);
      setError(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTagName.trim();
    if (!trimmed) {
      setError('Tag name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onCreateTag({ name: trimmed, color: newTagColor });
      setNewTagName('');
    } catch (err: unknown) {
      console.error('Failed to create tag:', err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('Failed to create tag. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (tag: Tag) => {
    setEditingTagId(tag.id);
    setEditName(tag.name);
    setEditColor(tag.color);
    setError(null);
  };

  const cancelEdit = () => {
    setEditingTagId(null);
    setEditName('');
    setEditColor('');
  };

  const handleUpdateSubmit = async (id: string) => {
    const trimmed = editName.trim();
    if (!trimmed) {
      setError('Tag name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await onUpdateTag(id, { name: trimmed, color: editColor });
      setEditingTagId(null);
    } catch (err: unknown) {
      console.error('Failed to update tag:', err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('Failed to update tag. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete tag "${name}"?`)) {
      return;
    }
    setError(null);
    try {
      await onDeleteTag(id);
    } catch (err: unknown) {
      console.error('Failed to delete tag:', err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('Failed to delete tag.');
      }
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tag-manager-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">🏷️</span>
            <h2 id="tag-manager-title" className="text-base font-semibold text-gray-900">
              Manage Tags & Labels
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-center justify-between gap-2">
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700 font-bold shrink-0 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Create Tag Form */}
        <form onSubmit={handleCreateSubmit} className="p-6 pb-4 border-b border-gray-100 space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Create New Tag
          </h3>
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
            <input
              type="text"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
              placeholder="Tag name (e.g. Bug, Feature, Urgent)..."
              className="flex-1 border border-gray-300 rounded-lg px-3 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Preset Color Swatches */}
              <div className="flex items-center gap-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setNewTagColor(c)}
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                    className={`w-5 h-5 rounded-full border transition-all cursor-pointer ${
                      newTagColor.toLowerCase() === c.toLowerCase()
                        ? 'ring-2 ring-offset-1 ring-blue-500 scale-110 border-white'
                        : 'border-transparent hover:scale-105'
                    }`}
                  />
                ))}
              </div>
              {/* Native color picker for custom color */}
              <input
                type="color"
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                aria-label="Custom color picker"
                title="Custom color"
                className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newTagName.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium px-3 py-1.5 text-xs rounded-lg transition-colors cursor-pointer shrink-0"
              >
                + Add
              </button>
            </div>
          </div>
        </form>

        {/* Existing Tags List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span className="font-semibold uppercase tracking-wider">
              Existing Tags ({tags.length})
            </span>
          </div>

          {tags.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-xs">
              No tags created yet. Create a tag above to categorize your tasks.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {tags.map((tag) => {
                const isEditing = editingTagId === tag.id;

                if (isEditing) {
                  return (
                    <div key={tag.id} className="py-2.5 flex items-center gap-2">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="flex-1 border border-blue-400 rounded-lg px-2.5 py-1 text-xs text-gray-900 focus:outline-none"
                        autoFocus
                      />
                      <input
                        type="color"
                        value={editColor}
                        onChange={(e) => setEditColor(e.target.value)}
                        className="w-6 h-6 p-0 border border-gray-300 rounded cursor-pointer"
                      />
                      <button
                        type="button"
                        onClick={() => handleUpdateSubmit(tag.id)}
                        disabled={isSubmitting || !editName.trim()}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs px-2.5 py-1 rounded-md cursor-pointer font-medium"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2 py-1 rounded-md cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  );
                }

                return (
                  <div
                    key={tag.id}
                    className="py-2.5 flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        style={{
                          backgroundColor: `${tag.color}15`,
                          borderColor: `${tag.color}40`,
                          color: tag.color,
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-md border"
                      >
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: tag.color }}
                        />
                        {tag.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {tag.color}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => startEdit(tag)}
                        title="Edit tag"
                        className="text-gray-400 hover:text-blue-600 p-1 text-xs rounded hover:bg-gray-100 cursor-pointer"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(tag.id, tag.name)}
                        title="Delete tag"
                        className="text-gray-400 hover:text-red-600 p-1 text-xs rounded hover:bg-gray-100 cursor-pointer"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
