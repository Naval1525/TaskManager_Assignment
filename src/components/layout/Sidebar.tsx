"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard/projects", label: "Projects" },
    { href: "/dashboard/users", label: "Users" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen shadow-lg">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8 text-white">Task Manager</h1>
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-lg transition-all text-base font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
