"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, Edit, Trash2, Search } from "lucide-react";

interface Blog {
  _id: string;
  slug: string;
  title: string;
  category: string;
  author: string;
  image: string;
  createdAt: string;
}

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);

  const fetchBlogs = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch("/api/admin/blog", {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      const data = await res.json();
      if (data.blogs) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (slug: string) => {
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.slug !== slug));
        setDeleteSlug(null);
      }
    } catch (error) {
      console.error("Failed to delete blog:", error);
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Blog Posts</h1>
        <Link
          href="/admin/dashboard/blogs/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00ff88]/90 transition-colors text-sm"
        >
          <PlusCircle size={18} />
          New Post
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
          size={18}
        />
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
        />
      </div>

      {/* Blog table */}
      {filteredBlogs.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/40">No blog posts found.</p>
          <Link
            href="/admin/dashboard/blogs/new"
            className="inline-block mt-4 text-[#00ff88] hover:underline text-sm"
          >
            Create your first blog post
          </Link>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-white/50 text-sm font-medium">
                  Title
                </th>
                <th className="text-left p-4 text-white/50 text-sm font-medium">
                  Category
                </th>
                <th className="text-left p-4 text-white/50 text-sm font-medium">
                  Author
                </th>
                <th className="text-left p-4 text-white/50 text-sm font-medium">
                  Date
                </th>
                <th className="text-right p-4 text-white/50 text-sm font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr
                  key={blog._id}
                  className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="p-4">
                    <p className="text-white text-sm font-medium truncate max-w-[300px]">
                      {blog.title}
                    </p>
                    <p className="text-white/30 text-xs mt-0.5">
                      /{blog.slug}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="text-xs px-2 py-1 bg-white/5 rounded text-white/60">
                      {blog.category}
                    </span>
                  </td>
                  <td className="p-4 text-white/60 text-sm">{blog.author}</td>
                  <td className="p-4 text-white/40 text-sm">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/dashboard/blogs/edit/${blog.slug}`}
                        className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-[#00ff88] transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        onClick={() => setDeleteSlug(blog.slug)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-white/60 hover:text-red-400 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteSlug && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="glass-card p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Delete Blog Post?
            </h3>
            <p className="text-white/50 text-sm mb-6">
              This action cannot be undone. The blog post will be permanently
              deleted.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteSlug(null)}
                className="px-4 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteSlug)}
                className="px-4 py-2 rounded-lg text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
