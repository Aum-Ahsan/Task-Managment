export type ProjectStatus = 'active' | 'planning' | 'completed' | 'on-hold';
export type ProjectPriority = 'high' | 'medium' | 'low';
export type ProjectCategory = 'Design' | 'Development' | 'Infrastructure' | 'Research' | 'Marketing';
export type ViewType = 'dashboard' | 'projects' | 'timeline' | 'kanban' | 'archive';

export interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string;
  endDate: string;
  progress: number;
  category: ProjectCategory;
  teamMembers: string[];
  budget: number;
  spent: number;
  tasks: number;
  completedTasks: number;
  tags: string[];
  lastActivity: string;
  starred: boolean;
  archived: boolean;
}

export interface Task {
  id: number;
  projectId: number;
  title: string;
  completed: boolean;
  dueDate: string;
  priority: ProjectPriority;
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  category: string;
}

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'warning' | 'error';
  timestamp: string;
}

export interface FilterCriteria {
  status: ProjectStatus | 'all';
  priority: ProjectPriority | 'all';
  category: ProjectCategory | 'all';
  dateRange: 'all' | 'week' | 'month' | 'quarter';
}

export interface Analytics {
  activeProjects: number;
  completedProjects: number;
  totalBudget: number;
  totalSpent: number;
  budgetUtilization: number;
  avgProgress: number;
  overdueProjects: number;
  onTimeCompletion: number;
}

export interface NewProject {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  priority: ProjectPriority;
  category: ProjectCategory | '';
  budget: number;
  teamMembers: string[];
}