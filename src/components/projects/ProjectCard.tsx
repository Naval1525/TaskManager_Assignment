"use client";

import Link from "next/link";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const taskCount = project.tasks.length;
  const completedCount = project.tasks.filter(
    (t) => t.status === "COMPLETED"
  ).length;

  return (
    <Link href={`/dashboard/projects/${project.id}`}>
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all cursor-pointer border border-gray-200 hover:border-blue-300">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {project.name}
        </h3>
        <div className="flex items-center gap-4 text-base text-gray-600">
          <span className="font-medium">{taskCount} tasks</span>
          <span className="text-gray-400">•</span>
          <span>{completedCount} completed</span>
        </div>
      </div>
    </Link>
  );
}
