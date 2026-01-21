"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { canCreateTask } from "@/lib/permissions";
import { TaskTable } from "@/components/tasks/TaskTable";
import { CreateTaskModal } from "@/components/tasks/CreateTaskModal";
import { Button } from "@/components/ui/Button";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getProjectById = useAppStore((state) => state.getProjectById);
  const currentUser = useAppStore((state) => state.currentUser);
  const seedIfEmpty = useAppStore((state) => state.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const project = getProjectById(projectId);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Project Not Found</h1>
        <p className="text-base text-gray-600">The project you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
        {canCreateTask(currentUser) && (
          <Button onClick={() => setIsModalOpen(true)} variant="primary" size="md">
            Create Task
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <TaskTable project={project} />
      </div>

      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
      />
    </div>
  );
}
