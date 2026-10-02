export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Tag {
  id: string;
  name: string;
  color: string;
  createdAt?: string;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

export interface UpdateTagInput {
  name?: string;
  color?: string;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  tagIds?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  tagIds?: string[];
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error?: string;
}
