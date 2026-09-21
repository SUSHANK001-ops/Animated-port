"use client"
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'

interface BlogPost {
  slug: string
  title: string
  timeToRead: number | string
  Titledescription?: string
  image?: string
  tags?: string[]
  category?: string
  dateposted?: string
  author?: string
}

function formatDate(value?: string) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const Blogs = () => {
  const [blogData, setBlogData] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog')
        setBlogData(response.data.blogs)
      } catch (err) {
        console.error('Error fetching blogs:', err)
        setError('Failed to fetch blogs. Please try again later.')
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="editorial-wide pt-32 pb-24 md:pt-40">
          <p className="eyebrow mb-3">Writing</p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Blog
          </h1>
          <p className="mt-4 text-[0.975rem] leading-relaxed text-muted">
            From curiosity to creation — notes on DevOps, cloud, and building for the web.
          </p>

          <div className="mt-12">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
                Loading posts…
              </div>
            ) : error ? (
              <p className="text-sm text-red-400">{error}</p>
            ) : blogData.length === 0 ? (
              <p className="text-sm text-muted">No posts yet — check back soon.</p>
            ) : (
              <div className="divide-y divide-border border-y border-border">
                {blogData.map((post, idx) => (
                  <Link
                    key={idx}
                    href={`/blog/${post.slug}`}
                    data-click-sound
                    className="group flex items-center gap-5 py-6 transition-opacity hover:opacity-95"
                  >
                    {post.image && (
                      <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-lg sm:block">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="112px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        {post.category && (
                          <span className="font-mono text-[11px] uppercase tracking-widest text-accent">
                            {post.category}
                          </span>
                        )}
                        <span className="font-mono text-xs text-muted">
                          {formatDate(post.dateposted)}
                          {post.timeToRead ? ` · ${post.timeToRead} min` : ''}
                        </span>
                      </div>
                      <h2 className="text-lg font-medium text-foreground group-hover:text-accent">
                        {post.title}
                      </h2>
                      <p className="mt-1 line-clamp-2 text-sm text-muted">
                        {post.Titledescription}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Blogs
