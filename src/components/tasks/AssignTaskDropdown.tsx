"use client";

import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

interface AssignTaskDropdownProps {
  projectId: string;
  taskId: string;
  currentAssignee: string | null;
}

export function AssignTaskDropdown({
  projectId,
  taskId,
  currentAssignee,
}: AssignTaskDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const users = useAppStore((state) => state.users);
  const assignTask = useAppStore((state) => state.assignTask);

  const developers = users.filter((u) => u.userType === "Developer");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleAssign = (developerId: string) => {
    try {
      assignTask(projectId, taskId, developerId);
      setIsOpen(false);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to assign task");
    }
  };

  const currentAssigneeName = currentAssignee
    ? users.find((u) => u.id === currentAssignee)?.name || "Unassigned"
    : "Unassigned";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-between w-full min-w-[160px] px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <span className="truncate">{currentAssigneeName}</span>
        <svg
          className={`ml-2 h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? "transform rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
          {developers.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No developers available
            </div>
          ) : (
            <ul className="py-1">
              {developers.map((dev) => (
                <li key={dev.id}>
                  <button
                    type="button"
                    onClick={() => handleAssign(dev.id)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-blue-50 transition-colors ${
                      currentAssignee === dev.id
                        ? "bg-blue-50 text-blue-700 font-medium"
                        : "text-gray-700"
                    }`}
                  >
                    {dev.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
