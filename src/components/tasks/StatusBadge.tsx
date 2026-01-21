import type { TaskStatus } from "@/types";

interface StatusBadgeProps {
  status: TaskStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    TODO: "bg-gray-100 text-gray-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    REVIEW: "bg-yellow-100 text-yellow-800",
    COMPLETED: "bg-green-100 text-green-800",
    NOT_COMPLETED: "bg-red-100 text-red-800",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
