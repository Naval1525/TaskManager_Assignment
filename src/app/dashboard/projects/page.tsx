"use client";

import { useState, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { canCreateProject } from "@/lib/permissions";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { CreateProjectModal } from "@/components/projects/CreateProjectModal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = useAppStore((state) => state.projects);
  const currentUser = useAppStore((state) => state.currentUser);
  const seedIfEmpty = useAppStore((state) => state.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredProjects = projects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
        {canCreateProject(currentUser) && (
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            Create Project
          </Button>
        )}
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-base text-gray-500">
            {searchQuery ? "No projects found matching your search." : "No projects yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
