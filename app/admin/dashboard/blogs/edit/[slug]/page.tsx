"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X, Loader } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BlogEditor from "../../components/BlogEditor";

export default function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [coverUploading, setCoverUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    Titledescription: "",
    content: "",
    image: "",
    category: "",
    tags: "",
    timeToRead: "",
    author: "",
  });

  const getToken = () => localStorage.getItem("admin_token") || "";

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/admin/blog/${slug}`, {
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        });

        if (!res.ok) {
          alert("Blog not found");
          router.push("/admin/dashboard/blogs");
          return;
        }

        const data = await res.json();
        const blog = data.blog;
        setForm({
          title: blog.title || "",
          slug: blog.slug || "",
          Titledescription: blog.Titledescription || "",
          content: blog.content || "",
          image: blog.image || "",
          category: blog.category || "",
          tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
          timeToRead: blog.timeToRead || "",
          author: blog.author || "",
        });
      } catch {
        alert("Failed to fetch blog");
        router.push("/admin/dashboard/blogs");
      } finally {
        setFetching(false);
      }
    };

    fetchBlog();
  }, [slug, router]);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    if (!res.ok) throw new Error("Upload failed");
    const data = await res.json();
    return data.url;
  }, []);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverUploading(true);
    try {
      const url = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: url }));
    } catch {
      alert("Failed to upload cover image");
    } finally {
      setCoverUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/blog/${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to update blog post");
        return;
      }

      router.push("/admin/dashboard/blogs");
    } catch {
      alert("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white/50">Loading blog post...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/dashboard/blogs"
          className="p-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-3xl font-bold text-white">Edit Blog Post</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-white/70 text-sm mb-1.5">Title</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Slug (read-only) */}
        <div>
          <label className="block text-white/70 text-sm mb-1.5">
            Slug (read-only)
          </label>
          <input
            type="text"
            value={form.slug}
            readOnly
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white/50 cursor-not-allowed"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-white/70 text-sm mb-1.5">
            Description
          </label>
          <textarea
            value={form.Titledescription}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                Titledescription: e.target.value,
              }))
            }
            rows={3}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors resize-none"
            placeholder="Brief description of the blog post"
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-white/70 text-sm mb-1.5">
            Cover Image
          </label>
          {form.image ? (
            <div className="relative w-full h-48 rounded-lg overflow-hidden glass-card">
              <Image
                src={form.image}
                alt="Cover"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg hover:bg-black/80 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-48 glass-card rounded-lg cursor-pointer hover:border-[#00ff88]/30 transition-colors">
              {coverUploading ? (
                <Loader size={24} className="text-[#00ff88] animate-spin" />
              ) : (
                <>
                  <Upload size={24} className="text-white/30 mb-2" />
                  <span className="text-white/30 text-sm">
                    Click to upload cover image
                  </span>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Category, Tags, Time to Read, Author in grid */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-white/70 text-sm mb-1.5">
              Category
            </label>
            <input
              type="text"
              value={form.category}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
              placeholder="e.g. Technology"
              required
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, tags: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
              placeholder="react, nextjs, web"
              required
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1.5">
              Time to Read
            </label>
            <input
              type="text"
              value={form.timeToRead}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, timeToRead: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
              placeholder="5 min read"
              required
            />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-1.5">
              Author
            </label>
            <input
              type="text"
              value={form.author}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, author: e.target.value }))
              }
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 focus:outline-none focus:border-[#00ff88]/50 transition-colors"
              placeholder="Author name"
              required
            />
          </div>
        </div>

        {/* Rich Text Editor for Content */}
        <div>
          <label className="block text-white/70 text-sm mb-1.5">
            Content
          </label>
          <BlogEditor
            value={form.content}
            onChange={(content) =>
              setForm((prev) => ({ ...prev, content }))
            }
            onImageUpload={uploadImage}
          />
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-[#00ff88] text-black font-semibold rounded-lg hover:bg-[#00ff88]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
          <Link
            href="/admin/dashboard/blogs"
            className="px-6 py-2.5 border border-white/10 text-white/60 rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
