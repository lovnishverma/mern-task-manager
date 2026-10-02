import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Task,
  TaskPriority,
  TaskStatus,
  CreateTaskInput,
  UpdateTaskInput,
  Tag,
  CreateTagInput,
} from '../types/task';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  availableTags: Tag[];
  onQuickCreateTag?: (tag: CreateTagInput) => Promise<Tag>;
  onSubmit: (data: CreateTaskInput | UpdateTaskInput) => Promise<void>;
}

export default function TaskModal({
  isOpen,
  onClose,
  task,
  availableTags,
  onQuickCreateTag,
  onSubmit,
}: TaskModalProps) {
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [newQuickTagName, setNewQuickTagName] = useState('');
  const [isCreatingQuickTag, setIsCreatingQuickTag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync state when opening or when task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate ? task.dueDate.slice(0, 10) : '');
        setSelectedTagIds(task.tags ? task.tags.map((t) => t.id) : []);
      } else {
        setTitle('');
        setStatus('TODO');
        setPriority('MEDIUM');
        setDueDate('');
        setSelectedTagIds([]);
      }
      setNewQuickTagName('');
      setError(null);
    }
  }, [isOpen, task]);

  // Handle escape key
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

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleQuickAddTag = async (e: React.MouseEvent) => {
    e.preventDefault();
    const trimmed = newQuickTagName.trim();
    if (!trimmed || !onQuickCreateTag) return;

    setIsCreatingQuickTag(true);
    try {
      const created = await onQuickCreateTag({ name: trimmed });
      setSelectedTagIds((prev) => [...prev, created.id]);
      setNewQuickTagName('');
    } catch (err: unknown) {
      console.error('Quick create tag error:', err);
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const msg = err.response.data.message;
        setError(Array.isArray(msg) ? msg.join(', ') : msg);
      } else {
        setError('Failed to create tag.');
      }
    } finally {
      setIsCreatingQuickTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title is required and cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload: CreateTaskInput | UpdateTaskInput = {
        title: trimmedTitle,
        status,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        tagIds: selectedTagIds,
      };

      await onSubmit(payload);
      onClose();
    } catch (err: unknown) {
      console.error('TaskModal submission error:', err);
      let errorMsg = 'Failed to save task. Please try again.';
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        const serverMsg = err.response.data.message;
        errorMsg = Array.isArray(serverMsg) ? serverMsg.join(', ') : serverMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      setError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditing = Boolean(task);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-md overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 id="task-modal-title" className="text-base font-semibold text-gray-900">
            {isEditing ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs flex items-start justify-between gap-2">
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

          {/* Title Field */}
          <div>
            <label
              htmlFor="task-title"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              required
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design homepage wireframe"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Status & Priority Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="task-status"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="task-priority"
                className="block text-xs font-semibold text-gray-700 mb-1"
              >
                Priority
              </label>
              <select
                id="task-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Due Date Field */}
          <div>
            <label
              htmlFor="task-due-date"
              className="block text-xs font-semibold text-gray-700 mb-1"
            >
              Due Date <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="flex gap-2 items-center">
              <input
                id="task-due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
              {dueDate && (
                <button
                  type="button"
                  onClick={() => setDueDate('')}
                  className="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                  title="Clear due date"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Tags & Labels Selection */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-gray-700">
                Tags & Labels <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              {selectedTagIds.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedTagIds([])}
                  className="text-[11px] text-gray-400 hover:text-gray-600 underline cursor-pointer"
                >
                  Clear all ({selectedTagIds.length})
                </button>
              )}
            </div>

            {/* Available Tags Pills */}
            {availableTags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-2 bg-gray-50 border border-gray-200 rounded-lg max-h-28 overflow-y-auto">
                {availableTags.map((tag) => {
                  const isSelected = selectedTagIds.includes(tag.id);
                  return (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => toggleTag(tag.id)}
                      style={{
                        backgroundColor: isSelected ? tag.color : `${tag.color}15`,
                        borderColor: isSelected ? tag.color : `${tag.color}40`,
                        color: isSelected ? '#FFFFFF' : tag.color,
                      }}
                      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                        isSelected ? 'shadow-xs font-semibold' : 'hover:opacity-80'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: isSelected ? '#FFFFFF' : tag.color }}
                      />
                      <span>{tag.name}</span>
                      {isSelected ? <span>✓</span> : <span className="opacity-40">+</span>}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 italic">
                No tags available yet. Create one below!
              </p>
            )}

            {/* Quick Add Tag Input */}
            {onQuickCreateTag && (
              <div className="mt-2 flex gap-1.5 items-center">
                <input
                  type="text"
                  value={newQuickTagName}
                  onChange={(e) => setNewQuickTagName(e.target.value)}
                  placeholder="Create new tag..."
                  className="flex-1 border border-gray-300 rounded-lg px-2.5 py-1 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleQuickAddTag}
                  disabled={isCreatingQuickTag || !newQuickTagName.trim()}
                  className="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 disabled:opacity-50 rounded-lg border border-gray-200 cursor-pointer"
                >
                  {isCreatingQuickTag ? '...' : '+ Tag'}
                </button>
              </div>
            )}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              {isSubmitting
                ? 'Saving...'
                : isEditing
                ? 'Save Changes'
                : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
