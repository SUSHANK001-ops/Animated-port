"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, PlusCircle, LayoutDashboard, UserPlus } from "lucide-react";

interface Admin {
  id: string;
  email: string;
  username: string;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/me", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        router.push("/admin");
        return;
      }

      const data = await res.json();
      setAdmin(data.admin);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    localStorage.removeItem("admin_token");
    router.push("/admin");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1A]">
        <div className="text-white/50 text-lg">Loading...</div>
      </div>
    );
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: "All Blogs",
      href: "/admin/dashboard/blogs",
      icon: FileText,
    },
    {
      label: "New Blog",
      href: "/admin/dashboard/blogs/new",
      icon: PlusCircle,
    },
    {
      label: "Register Admin",
      href: "/admin/dashboard/register",
      icon: UserPlus,
    },
  ];

  return (
    <div className="min-h-screen bg-[#1A1A1A] flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/[0.02] p-6 flex flex-col fixed h-full">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white">Admin Panel</h2>
          <p className="text-white/40 text-sm mt-1">{admin?.username}</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-[#00ff88]/10 text-[#00ff88]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors mt-auto"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 p-8">{children}</main>
    </div>
  );
}
