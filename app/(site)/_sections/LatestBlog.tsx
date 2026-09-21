import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import connectDB from '@/lib/db'
import BlogModel from '@/model/blogModel'
import { latestBlogFallback } from '@/data/config'

interface PostPreview {
  slug: string
  title: string
  description: string
  date: string
}

function formatDate(value: string) {
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Server component — reads latest posts straight from MongoDB. */
async function getLatestPosts(): Promise<PostPreview[]> {
  try {
    await connectDB()
    const blogs = await BlogModel.find()
      .sort({ dateposted: -1 })
      .limit(3)
      .select('slug title Titledescription dateposted')
      .lean<{ slug: string; title: string; Titledescription: string; dateposted: string }[]>()

    return blogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      description: b.Titledescription,
      date: b.dateposted,
    }))
  } catch {
    return []
  }
}

const LatestBlog = async () => {
  let posts = await getLatestPosts()

  // Fallback so the section still reads well before any posts exist.
  if (posts.length === 0) {
    posts = [
      {
        slug: '',
        title: latestBlogFallback.title,
        description: latestBlogFallback.excerpt,
        date: latestBlogFallback.date,
      },
    ]
  }

  return (
    <div className="editorial">
      <p className="eyebrow mb-3">Writing</p>
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        Latest from the blog
      </h2>

      <div className="divide-y divide-border border-y border-border">
        {posts.map((post, i) => {
          const href = post.slug ? `/blog/${post.slug}` : '/blog'
          return (
            <Link
              key={post.slug || i}
              href={href}
              data-click-sound
              className="group block py-5 transition-opacity hover:opacity-90"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-base font-medium text-foreground group-hover:text-accent">
                  {post.title}
                </h3>
                <span className="shrink-0 font-mono text-xs text-muted">
                  {formatDate(post.date)}
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-sm text-muted">{post.description}</p>
            </Link>
          )
        })}
      </div>

      <Link
        href="/blog"
        data-click-sound
        className="group mt-6 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
      >
        Read the blog
        <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  )
}

export default LatestBlog
