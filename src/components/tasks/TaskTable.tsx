"use client";

import { useState } from "react";
import type { Project, Task, TaskStatus, User } from "@/types";
import { StatusBadge } from "./StatusBadge";
import { AssignTaskDropdown } from "./AssignTaskDropdown";
import { Button } from "@/components/ui/Button";
import { useAppStore, type AppState } from "@/store/useAppStore";
import {
  canCreateTask,
  canAssignTask,
  canDeveloperTransition,
  canManagerSetStatus,
  isDeveloper,
  isManager,
} from "@/lib/permissions";

interface TaskTableProps {
  project: Project;
}

export function TaskTable({ project }: TaskTableProps) {
  const currentUser = useAppStore((state: AppState) => state.currentUser);
  const users = useAppStore((state: AppState) => state.users);
  const updateTaskStatus = useAppStore((state: AppState) => state.updateTaskStatus);

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    try {
      updateTaskStatus(project.id, task.id, newStatus);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const handleDeveloperAction = (task: Task, action: "start" | "end" | "complete") => {
    if (!isDeveloper(currentUser)) return;

    let newStatus: TaskStatus;
    switch (action) {
      case "start":
        newStatus = "IN_PROGRESS";
        break;
      case "end":
        newStatus = "REVIEW";
        break;
      case "complete":
        newStatus = "COMPLETED";
        break;
    }

    if (canDeveloperTransition(task.status, newStatus)) {
      handleStatusChange(task, newStatus);
    }
  };

  const getAssigneeName = (userId: string | null) => {
    if (!userId) return "Unassigned";
    const user = users.find((u: User) => u.id === userId);
    return user?.name || "Unknown";
  };

  if (project.tasks.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-base">No tasks in this project yet.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full bg-white divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Task
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Assigned To
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {project.tasks.map((task) => (
            <tr key={task.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-base font-medium text-gray-900">
                  {task.task}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {isManager(currentUser) ? (
                  <AssignTaskDropdown
                    projectId={project.id}
                    taskId={task.id}
                    currentAssignee={task.assignedTo}
                  />
                ) : (
                  <span className="text-base text-gray-700">
                    {getAssigneeName(task.assignedTo)}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={task.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {isDeveloper(currentUser) &&
                  currentUser &&
                  task.assignedTo === currentUser.id && (
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!canDeveloperTransition(task.status, "IN_PROGRESS")}
                        onClick={() => handleDeveloperAction(task, "start")}
                      >
                        Start
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!canDeveloperTransition(task.status, "REVIEW")}
                        onClick={() => handleDeveloperAction(task, "end")}
                      >
                        End
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!canDeveloperTransition(task.status, "COMPLETED")}
                        onClick={() => handleDeveloperAction(task, "complete")}
                      >
                        Complete
                      </Button>
                    </div>
                  )}
                {isManager(currentUser) && (
                  <select
                    value={task.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as TaskStatus;
                      if (canManagerSetStatus(newStatus)) {
                        handleStatusChange(task, newStatus);
                      } else {
                        alert("Managers cannot set status to COMPLETED");
                      }
                    }}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-700"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="NOT_COMPLETED">NOT_COMPLETED</option>
                  </select>
                )}
                {!isDeveloper(currentUser) && !isManager(currentUser) && (
                  <span className="text-sm text-gray-400 italic">
                    No actions available
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
