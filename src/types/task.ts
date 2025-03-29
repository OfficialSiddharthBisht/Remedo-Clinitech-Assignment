export interface Task {
  id: string;
  title?: string;
  description: string;
  status: 'To Do' | 'In Progress' | 'Done';
  createdAt: string;
  notes?: string;
  subtasks?: SubTask[];
}

export interface SubTask {
  id: string;
  description: string;
  completed: boolean;
  createdAt: string;
} 