import { create } from "zustand";
import type { User, Project, Task, TaskStatus } from "@/types";
import { STORAGE_KEYS, getItem, setItem, removeItem } from "@/lib/storage";
import { assertAllowed } from "@/lib/permissions";
import { generateId, getCurrentTimestamp } from "@/lib/utils";

export interface AppState {
  users: User[];
  projects: Project[];
  currentUser: User | null;

  // Actions
  seedIfEmpty: () => void;
  login: (userId: string) => void;
  logout: () => void;
  createProject: (name: string) => void;
  createTask: (projectId: string, taskName: string) => void;
  assignTask: (projectId: string, taskId: string, developerId: string) => void;
  updateTaskStatus: (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => void;
  getProjectById: (projectId: string) => Project | undefined;
}

/**
 * Seed initial data if localStorage is empty
 */
function seedData(): { users: User[]; projects: Project[] } {
  const users: User[] = [
    { id: "u1", name: "Admin Naval", userType: "Admin" },
    { id: "u2", name: "Manager Naval", userType: "Manager" },
    { id: "u3", name: "Dev Naval", userType: "Developer" },
  ];

  const projects: Project[] = [
    {
      id: "p1",
      name: "Website Revamp",
      createdAt: getCurrentTimestamp(),
      tasks: [
        {
          id: "t1",
          task: "Create UI layout",
          assignedTo: "u3",
          status: "TODO",
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        },
        {
          id: "t2",
          task: "Fix auth bugs",
          assignedTo: "u3",
          status: "IN_PROGRESS",
          createdAt: getCurrentTimestamp(),
          updatedAt: getCurrentTimestamp(),
        },
      ],
    },
  ];

  return { users, projects };
}

// Initialize store from localStorage
function initializeStore() {
  const existingUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
  const existingProjects = getItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
  const currentUser = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);

  if (existingUsers.length === 0 || existingProjects.length === 0) {
    const { users, projects } = seedData();
    setItem(STORAGE_KEYS.USERS, users);
    setItem(STORAGE_KEYS.PROJECTS, projects);
    return { users, projects, currentUser: null };
  }

  return { users: existingUsers, projects: existingProjects, currentUser };
}

const initialState = initializeStore();

export const useAppStore = create<AppState>((set, get) => ({
  users: initialState.users,
  projects: initialState.projects,
  currentUser: initialState.currentUser,

  /**
   * Seed data if localStorage is empty (idempotent - only updates if needed)
   */
  seedIfEmpty: () => {
    const state = get();
    const existingUsers = getItem<User[]>(STORAGE_KEYS.USERS, []);
    const existingProjects = getItem<Project[]>(STORAGE_KEYS.PROJECTS, []);
    const currentUser = getItem<User | null>(STORAGE_KEYS.CURRENT_USER, null);

    // Check if we need to seed
    if (existingUsers.length === 0 || existingProjects.length === 0) {
      // Only seed if store is actually empty
      if (state.users.length === 0 && state.projects.length === 0) {
        const { users, projects } = seedData();
        setItem(STORAGE_KEYS.USERS, users);
        setItem(STORAGE_KEYS.PROJECTS, projects);
        set({ users, projects });
      }
      return;
    }

    // Check if state needs to be updated from localStorage
    const usersChanged =
      state.users.length !== existingUsers.length ||
      state.users.some((u, i) => u.id !== existingUsers[i]?.id);
    const projectsChanged =
      state.projects.length !== existingProjects.length ||
      state.projects.some((p, i) => p.id !== existingProjects[i]?.id);
    const currentUserChanged = state.currentUser?.id !== currentUser?.id;

    // Only update if something actually changed
    if (usersChanged || projectsChanged || currentUserChanged) {
      set({ users: existingUsers, projects: existingProjects, currentUser });
    }
  },

  /**
   * Login user by ID
   */
  login: (userId: string) => {
    const users = get().users;
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error(`User with id "${userId}" not found`);
    }
    setItem(STORAGE_KEYS.CURRENT_USER, user);
    set({ currentUser: user });
  },

  /**
   * Logout current user
   */
  logout: () => {
    removeItem(STORAGE_KEYS.CURRENT_USER);
    set({ currentUser: null });
  },

  /**
   * Create a new project (Admin only)
   */
  createProject: (name: string) => {
    if (!name.trim()) {
      throw new Error("Project name cannot be empty");
    }

    const { currentUser, projects } = get();
    assertAllowed("createProject", currentUser);

    const newProject: Project = {
      id: generateId(),
      name: name.trim(),
      tasks: [],
      createdAt: getCurrentTimestamp(),
    };

    const updatedProjects = [...projects, newProject];
    setItem(STORAGE_KEYS.PROJECTS, updatedProjects);
    set({ projects: updatedProjects });
  },

  /**
   * Create a new task in a project (Manager only)
   */
  createTask: (projectId: string, taskName: string) => {
    if (!taskName.trim()) {
      throw new Error("Task name cannot be empty");
    }

    const { currentUser, projects } = get();
    assertAllowed("createTask", currentUser);

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id "${projectId}" not found`);
    }

    const newTask: Task = {
      id: generateId(),
      task: taskName.trim(),
      assignedTo: null,
      status: "TODO",
      createdAt: getCurrentTimestamp(),
      updatedAt: getCurrentTimestamp(),
    };

    const updatedProject = {
      ...project,
      tasks: [...project.tasks, newTask],
    };

    const updatedProjects = projects.map((p) =>
      p.id === projectId ? updatedProject : p
    );

    setItem(STORAGE_KEYS.PROJECTS, updatedProjects);
    set({ projects: updatedProjects });
  },

  /**
   * Assign a task to a developer (Manager only)
   */
  assignTask: (projectId: string, taskId: string, developerId: string) => {
    const { currentUser, projects, users } = get();
    assertAllowed("assignTask", currentUser);

    const developer = users.find((u) => u.id === developerId);
    if (!developer || developer.userType !== "Developer") {
      throw new Error("Task can only be assigned to a Developer");
    }

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id "${projectId}" not found`);
    }

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Task with id "${taskId}" not found`);
    }

    const updatedTask = {
      ...task,
      assignedTo: developerId,
      updatedAt: getCurrentTimestamp(),
    };

    const updatedProject = {
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    };

    const updatedProjects = projects.map((p) =>
      p.id === projectId ? updatedProject : p
    );

    setItem(STORAGE_KEYS.PROJECTS, updatedProjects);
    set({ projects: updatedProjects });
  },

  /**
   * Update task status with permission checks
   */
  updateTaskStatus: (
    projectId: string,
    taskId: string,
    status: TaskStatus
  ) => {
    const { currentUser, projects } = get();

    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      throw new Error(`Project with id "${projectId}" not found`);
    }

    const task = project.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error(`Task with id "${taskId}" not found`);
    }

    assertAllowed("updateTaskStatus", currentUser, {
      currentStatus: task.status,
      nextStatus: status,
    });

    const updatedTask = {
      ...task,
      status,
      updatedAt: getCurrentTimestamp(),
    };

    const updatedProject = {
      ...project,
      tasks: project.tasks.map((t) => (t.id === taskId ? updatedTask : t)),
    };

    const updatedProjects = projects.map((p) =>
      p.id === projectId ? updatedProject : p
    );

    setItem(STORAGE_KEYS.PROJECTS, updatedProjects);
    set({ projects: updatedProjects });
  },

  /**
   * Get project by ID
   */
  getProjectById: (projectId: string) => {
    const { projects } = get();
    return projects.find((p) => p.id === projectId);
  },
}));
