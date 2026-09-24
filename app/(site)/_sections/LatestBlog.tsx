import React from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
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
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

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
    <div className="editorial-page">
      <p className="eyebrow eyebrow-dot mb-3">Writing</p>
      <h2 className="serif-title serif-section mb-6">Latest from the blog</h2>

      {/* Stacked-paper cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {posts.map((post, i) => {
          const href = post.slug ? `/blog/${post.slug}` : '/blog'
          return (
            <Link
              key={post.slug || i}
              href={href}
              data-click-sound
              className="paper-card group block"
            >
              <span className="font-mono text-[0.65rem] text-muted">
                {formatDate(post.date)}
              </span>
              <h3 className="mt-2 serif-title text-base leading-snug text-foreground group-hover:text-link">
                {post.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                {post.description}
              </p>
            </Link>
          )
        })}
      </div>

      <Link
        href="/blog"
        data-click-sound
        className="group mt-8 inline-flex items-center gap-1.5 text-sm text-link"
      >
        <span className="link-quiet">Read the blog</span>
        <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  )
}

export default LatestBlog
