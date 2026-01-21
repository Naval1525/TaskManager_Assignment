"use client";

import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";

export function Header() {
  const router = useRouter();
  const currentUser = useAppStore((state) => state.currentUser);
  const logout = useAppStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  if (!currentUser) return null;

  const roleColors = {
    Admin: "bg-purple-100 text-purple-800",
    Manager: "bg-blue-100 text-blue-800",
    Developer: "bg-green-100 text-green-800",
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <span className="text-base text-gray-600">Logged in as:</span>
          <span className="text-base font-semibold text-gray-900">
            {currentUser.name}
          </span>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-full ${roleColors[currentUser.userType]}`}
          >
            {currentUser.userType}
          </span>
        </div>
        <Button variant="ghost" onClick={handleLogout} size="md">
          Logout
        </Button>
      </div>
    </header>
  );
}
