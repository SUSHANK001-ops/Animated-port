"use client";

import { useEffect, useState } from "react";
import { FileText, Eye } from "lucide-react";

interface DashboardStats {
  totalBlogs: number;
  recentBlogs: { title: string; slug: string; createdAt: string }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/blog", {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        const data = await res.json();
        if (data.blogs) {
          setStats({
            totalBlogs: data.blogs.length,
            recentBlogs: data.blogs.slice(0, 5).map((b: { title: string; slug: string; createdAt: string }) => ({
              title: b.title,
              slug: b.slug,
              createdAt: b.createdAt,
            })),
          });
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#00ff88]/10 rounded-lg">
              <FileText className="text-[#00ff88]" size={24} />
            </div>
            <div>
              <p className="text-white/50 text-sm">Total Posts</p>
              <p className="text-2xl font-bold text-white">
                {stats?.totalBlogs ?? 0}
              </p>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-lg">
              <Eye className="text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-white/50 text-sm">Recent Posts</p>
              <p className="text-2xl font-bold text-white">
                {stats?.recentBlogs?.length ?? 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent posts */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Blog Posts
        </h2>

        {stats?.recentBlogs && stats.recentBlogs.length > 0 ? (
          <div className="space-y-3">
            {stats.recentBlogs.map((blog) => (
              <div
                key={blog.slug}
                className="flex items-center justify-between p-3 bg-white/[0.03] rounded-lg"
              >
                <div>
                  <p className="text-white text-sm font-medium">
                    {blog.title}
                  </p>
                  <p className="text-white/40 text-xs mt-0.5">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href={`/admin/dashboard/blogs/edit/${blog.slug}`}
                  className="text-xs text-[#00ff88] hover:underline"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm">No blog posts yet.</p>
        )}
      </div>
    </div>
  );
}
