import { Task, TaskStatus, UpdateTaskInput } from '../types/task';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  tasks: Task[];
  isFiltered?: boolean;
  onUpdate: (id: string, updates: UpdateTaskInput) => Promise<void> | void;
  onDelete: (id: string) => Promise<void> | void;
  onDropTask: (taskId: string, targetStatus: TaskStatus) => Promise<void> | void;
  onEdit: (task: Task) => void;
}

export default function KanbanBoard({
  tasks,
  isFiltered = false,
  onUpdate,
  onDelete,
  onDropTask,
  onEdit,
}: KanbanBoardProps) {
  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
      <KanbanColumn
        status="TODO"
        title="To Do"
        tasks={todoTasks}
        accentColor="bg-slate-100/70"
        isFiltered={isFiltered}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDropTask={onDropTask}
        onEdit={onEdit}
      />
      <KanbanColumn
        status="IN_PROGRESS"
        title="In Progress"
        tasks={inProgressTasks}
        accentColor="bg-blue-50/70"
        isFiltered={isFiltered}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDropTask={onDropTask}
        onEdit={onEdit}
      />
      <KanbanColumn
        status="DONE"
        title="Done"
        tasks={doneTasks}
        accentColor="bg-emerald-50/70"
        isFiltered={isFiltered}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onDropTask={onDropTask}
        onEdit={onEdit}
      />
    </div>
  );
}
