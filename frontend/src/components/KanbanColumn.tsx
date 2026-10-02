import { useRef, useState } from 'react';
import { Task, TaskStatus, UpdateTaskInput } from '../types/task';
import TaskCard from './TaskCard';

interface KanbanColumnProps {
  status: TaskStatus;
  title: string;
  tasks: Task[];
  accentColor: string;
  isFiltered?: boolean;
  onUpdate: (id: string, updates: UpdateTaskInput) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => Promise<void> | void;
  onEdit: (task: Task) => void;
}

export default function KanbanColumn({
  status,
  title,
  tasks,
  accentColor,
  isFiltered = false,
  onUpdate,
  onDelete,
  onDropTask,
  onEdit,
}: KanbanColumnProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const dragCounter = useRef(0);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current += 1;
    if (dragCounter.current === 1) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      dragCounter.current = 0;
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      await onDropTask(taskId, status);
    }
  };

  const emptyMessage = isFiltered
    ? `No matching tasks in ${title.toLowerCase()}`
    : `No tasks in ${title.toLowerCase()}`;

  return (
    <div
      data-testid={`column-${status}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`flex flex-col rounded-xl border overflow-hidden shadow-xs transition-colors duration-200 ${
        isDragOver
          ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400/40'
          : 'bg-gray-50/80 border-gray-200/80'
      }`}
    >
      {/* Column Header */}
      <div
        className={`px-4 py-3 border-b border-gray-200/80 flex items-center justify-between ${accentColor}`}
      >
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/80 border border-gray-200 text-gray-600">
            {tasks.length}
          </span>
        </div>
        {isDragOver && (
          <span className="text-[11px] font-medium text-blue-600 animate-pulse">
            Drop to move
          </span>
        )}
      </div>

      {/* Card List Area */}
      <div className="p-3 flex-1 space-y-3 min-h-[220px]">
        {tasks.length === 0 ? (
          <div
            className={`h-full min-h-[160px] flex items-center justify-center text-xs rounded-lg p-4 text-center border-2 border-dashed transition-colors ${
              isDragOver
                ? 'border-blue-400 bg-blue-100/30 text-blue-600 font-medium'
                : 'border-gray-200/60 text-gray-400'
            }`}
          >
            {isDragOver ? `Drop task here to move to ${title}` : emptyMessage}
          </div>
        ) : (
          <>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
            {isDragOver && (
              <div className="border-2 border-dashed border-blue-400 bg-blue-100/40 rounded-lg p-2.5 text-center text-xs font-medium text-blue-700 animate-pulse">
                Drop to move to {title}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
