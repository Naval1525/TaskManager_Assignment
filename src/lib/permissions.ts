import type { User, TaskStatus } from "@/types";

/**
 * Permissions layer - Atomic functions for role-based access control
 * All functions are pure and testable
 */

/**
 * Check if user is Admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.userType === "Admin";
}

/**
 * Check if user is Manager
 */
export function isManager(user: User | null): boolean {
  return user?.userType === "Manager";
}

/**
 * Check if user is Developer
 */
export function isDeveloper(user: User | null): boolean {
  return user?.userType === "Developer";
}

/**
 * Check if user can create projects (Admin only)
 */
export function canCreateProject(user: User | null): boolean {
  return isAdmin(user);
}

/**
 * Check if user can create tasks (Manager only)
 */
export function canCreateTask(user: User | null): boolean {
  return isManager(user);
}

/**
 * Check if user can assign tasks (Manager only)
 */
export function canAssignTask(user: User | null): boolean {
  return isManager(user);
}

/**
 * Check if manager can set a specific status
 * Managers cannot set COMPLETED status
 */
export function canManagerSetStatus(status: TaskStatus): boolean {
  return status !== "COMPLETED";
}

/**
 * Check if developer can transition from currentStatus to nextStatus
 * Developers can only follow strict flow: TODO → IN_PROGRESS → REVIEW → COMPLETED
 */
export function canDeveloperTransition(
  currentStatus: TaskStatus,
  nextStatus: TaskStatus
): boolean {
  const validTransitions: Record<TaskStatus, TaskStatus[]> = {
    TODO: ["IN_PROGRESS"],
    IN_PROGRESS: ["REVIEW"],
    REVIEW: ["COMPLETED"],
    COMPLETED: [],
    NOT_COMPLETED: [],
  };

  return validTransitions[currentStatus]?.includes(nextStatus) ?? false;
}

/**
 * Assert that an action is allowed, throw error if not
 */
export function assertAllowed(
  actionName: string,
  user: User | null,
  payload?: Record<string, unknown>
): void {
  if (!user) {
    throw new Error(`Action "${actionName}" requires authentication`);
  }

  switch (actionName) {
    case "createProject":
      if (!canCreateProject(user)) {
        throw new Error("Only Admins can create projects");
      }
      break;

    case "createTask":
      if (!canCreateTask(user)) {
        throw new Error("Only Managers can create tasks");
      }
      break;

    case "assignTask":
      if (!canAssignTask(user)) {
        throw new Error("Only Managers can assign tasks");
      }
      break;

    case "updateTaskStatus": {
      const { currentStatus, nextStatus } = payload as {
        currentStatus: TaskStatus;
        nextStatus: TaskStatus;
      };

      if (isDeveloper(user)) {
        if (!canDeveloperTransition(currentStatus, nextStatus)) {
          throw new Error(
            `Invalid status transition for Developer: ${currentStatus} → ${nextStatus}`
          );
        }
      } else if (isManager(user)) {
        if (!canManagerSetStatus(nextStatus)) {
          throw new Error("Managers cannot set status to COMPLETED");
        }
      } else if (isAdmin(user)) {
        throw new Error("Admins cannot change task status");
      }
      break;
    }

    default:
      throw new Error(`Unknown action: ${actionName}`);
  }
}
