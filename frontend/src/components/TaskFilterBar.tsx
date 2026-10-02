import { TaskPriority, TaskStatus, Tag } from '../types/task';

interface TaskFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: TaskPriority | 'ALL';
  onPriorityChange: (priority: TaskPriority | 'ALL') => void;
  statusFilter: TaskStatus | 'ALL';
  onStatusChange: (status: TaskStatus | 'ALL') => void;
  tagFilter: string | 'ALL';
  onTagChange: (tagId: string | 'ALL') => void;
  tags: Tag[];
  onOpenTagManager: () => void;
  onClearFilters: () => void;
  onOpenCreateModal: () => void;
  totalCount: number;
  filteredCount: number;
}

export default function TaskFilterBar({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityChange,
  statusFilter,
  onStatusChange,
  tagFilter,
  onTagChange,
  tags,
  onOpenTagManager,
  onClearFilters,
  onOpenCreateModal,
  totalCount,
  filteredCount,
}: TaskFilterBarProps) {
  const isFiltered =
    searchQuery.trim() !== '' ||
    priorityFilter !== 'ALL' ||
    statusFilter !== 'ALL' ||
    tagFilter !== 'ALL';

  return (
    <div className="bg-white rounded-xl border border-gray-200/90 shadow-2xs p-3.5 mb-6 space-y-3">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title..."
            className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-gray-400 hover:text-gray-600 font-bold text-xs cursor-pointer"
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filters and Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) =>
              onPriorityChange(e.target.value as TaskPriority | 'ALL')
            }
            aria-label="Filter by priority"
            className="border border-gray-300 rounded-lg px-2.5 py-2 text-xs bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low Priority</option>
            <option value="MEDIUM">Medium Priority</option>
            <option value="HIGH">High Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusChange(e.target.value as TaskStatus | 'ALL')
            }
            aria-label="Filter by status"
            className="border border-gray-300 rounded-lg px-2.5 py-2 text-xs bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DONE">Done</option>
          </select>

          {/* Tag Filter */}
          <select
            value={tagFilter}
            onChange={(e) => onTagChange(e.target.value)}
            aria-label="Filter by tag"
            className="border border-gray-300 rounded-lg px-2.5 py-2 text-xs bg-white text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer"
          >
            <option value="ALL">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                🏷️ {tag.name}
              </option>
            ))}
          </select>

          {/* Manage Tags Button */}
          <button
            type="button"
            onClick={onOpenTagManager}
            title="Manage tags"
            className="border border-gray-300 rounded-lg px-2.5 py-2 text-xs bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            <span>🏷️</span>
            <span className="hidden sm:inline">Tags</span>
          </button>

          {/* Add Task Button */}
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 text-xs sm:text-sm rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <span className="text-base leading-none font-bold">+</span>
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter status row when active */}
      {isFiltered && (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-500">
          <div>
            Showing <strong className="text-gray-800">{filteredCount}</strong> of{' '}
            <strong className="text-gray-800">{totalCount}</strong> tasks
          </div>
          <button
            type="button"
            onClick={onClearFilters}
            className="text-blue-600 hover:text-blue-800 font-medium underline cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
