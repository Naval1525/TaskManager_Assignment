"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const users = useAppStore((state) => state.users);
  const seedIfEmpty = useAppStore((state) => state.seedIfEmpty);
  const login = useAppStore((state) => state.login);

  useEffect(() => {
    seedIfEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = (userId: string) => {
    try {
      login(userId);
      router.push("/dashboard");
    } catch (error) {
      alert(error instanceof Error ? error.message : "Login failed");
    }
  };

  const roleColors = {
    Admin: "bg-purple-100 text-purple-800 border-purple-300",
    Manager: "bg-blue-100 text-blue-800 border-blue-300",
    Developer: "bg-green-100 text-green-800 border-green-300",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          Task Manager
        </h1>
        <p className="text-center text-base text-gray-600 mb-8">
          Select a user to login
        </p>
        <div className="space-y-3">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user.id)}
              className={`w-full p-5 rounded-lg border-2 text-left transition-all hover:shadow-lg hover:scale-[1.02] ${roleColors[user.userType]}`}
            >
              <div className="text-lg font-semibold mb-1">{user.name}</div>
              <div className="text-sm opacity-75">{user.userType}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
