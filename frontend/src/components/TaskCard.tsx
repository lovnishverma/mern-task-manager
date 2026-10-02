import { useState } from 'react';
import { Task, TaskPriority, TaskStatus, UpdateTaskInput } from '../types/task';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: UpdateTaskInput) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onEdit: (task: Task) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onEdit }: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: task.id, status: task.status })
    );
    e.dataTransfer.effectAllowed = 'move';
    setIsDragging(true);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    await onUpdate(task.id, { status: newStatus });
  };

  const getPriorityBadgeClass = (priority: TaskPriority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'MEDIUM':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'LOW':
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      data-testid={`task-card-${task.id}`}
      className={`bg-white p-3.5 rounded-lg border transition-all space-y-2.5 ${
        isDragging
          ? 'opacity-40 scale-[0.98] border-dashed border-blue-400 shadow-none'
          : 'border-gray-200 shadow-xs hover:shadow-sm cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-sm font-medium leading-snug break-words ${
            task.status === 'DONE' ? 'line-through text-gray-400' : 'text-gray-900'
          }`}
        >
          {task.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onClick={() => onEdit(task)}
            title="Edit task"
            className="text-gray-400 hover:text-blue-600 p-1 text-xs rounded hover:bg-gray-100 cursor-pointer"
          >
            ✏️
          </button>
          <button
            type="button"
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            onClick={() => onDelete(task.id)}
            title="Delete task"
            className="text-gray-400 hover:text-red-600 p-1 text-xs rounded hover:bg-gray-100 cursor-pointer"
          >
            ❌
          </button>
        </div>
      </div>

      {/* Color-coded Tag Pills */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 items-center">
          {task.tags.map((tag) => (
            <span
              key={tag.id}
              style={{
                backgroundColor: `${tag.color}15`,
                borderColor: `${tag.color}35`,
                color: tag.color,
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md border"
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ backgroundColor: tag.color }}
              />
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-gray-100 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`px-2 py-0.5 rounded-full border text-[11px] font-medium ${getPriorityBadgeClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>

          {task.dueDate && (
            <span
              title="Due date"
              className="inline-flex items-center gap-1 text-[11px] text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full"
            >
              📅 {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        <select
          value={task.status}
          draggable={false}
          onDragStart={(e) => e.preventDefault()}
          onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
          aria-label="Change status"
          className="text-[11px] border border-gray-200 rounded px-1.5 py-0.5 bg-gray-50 text-gray-700 hover:bg-gray-100 cursor-pointer"
        >
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </select>
      </div>
    </div>
  );
}
