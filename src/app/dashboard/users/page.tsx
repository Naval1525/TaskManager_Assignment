"use client";

import { useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";

export default function UsersPage() {
  const users = useAppStore((state) => state.users);
  const seedIfEmpty = useAppStore((state) => state.seedIfEmpty);

  useEffect(() => {
    seedIfEmpty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const roleColors = {
    Admin: "bg-purple-100 text-purple-800",
    Manager: "bg-blue-100 text-blue-800",
    Developer: "bg-green-100 text-green-800",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Users</h1>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                Role
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-base font-medium text-gray-900">
                    {user.name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${roleColors[user.userType]}`}
                  >
                    {user.userType}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
