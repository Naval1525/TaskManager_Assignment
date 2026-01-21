export type UserType = "Admin" | "Manager" | "Developer";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "REVIEW" | "COMPLETED" | "NOT_COMPLETED";

export interface User {
  id: string;
  name: string;
  userType: UserType;
}

export interface Task {
  id: string;
  task: string;
  assignedTo: string | null;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}

export interface Project {
  id: string;
  name: string;
  tasks: Task[];
  createdAt: number;
}
