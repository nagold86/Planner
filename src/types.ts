export type TaskStatus = 'not-started' | 'in-progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  progress: number;
  priority: TaskPriority;
  assignee?: string;
  dependsOn?: string[];
  parentId?: string;
  subtasks: Task[];
  projectId: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  tasks: Task[];
}
