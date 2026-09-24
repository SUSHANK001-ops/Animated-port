"use client"
import Navbar from '../ui/Navbar'
import Footer from '../ui/Footer'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { Search } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

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

const FALLBACK = '/assests/Placeholder.png'

function formatDate(value?: string) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function yearOf(value?: string) {
  if (!value) return 'Undated'
  const d = new Date(value)
  return isNaN(d.getTime()) ? 'Undated' : String(d.getFullYear())
}

const Blogs = () => {
  const [blogData, setBlogData] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [query, setQuery] = useState('')
  const [activeCat, setActiveCat] = useState('All')

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

  // Category chips from the data.
  const categories = useMemo(() => {
    const set = new Set<string>()
    blogData.forEach((p) => p.category && set.add(p.category))
    return ['All', ...Array.from(set)]
  }, [blogData])

  // Filter by search + category.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return blogData.filter((p) => {
      const matchesCat = activeCat === 'All' || p.category === activeCat
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        (p.Titledescription ?? '').toLowerCase().includes(q) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(q))
      return matchesCat && matchesQuery
    })
  }, [blogData, query, activeCat])

  // Group by year, newest first.
  const grouped = useMemo(() => {
    const map = new Map<string, BlogPost[]>()
    filtered.forEach((p) => {
      const y = yearOf(p.dateposted)
      if (!map.has(y)) map.set(y, [])
      map.get(y)!.push(p)
    })
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <div className="editorial-page pt-32 pb-16 md:pt-36">
          <p className="eyebrow eyebrow-dot mb-3">Writing</p>
          <h1 className="display-serif text-4xl text-foreground md:text-5xl">Blog</h1>
          <p className="mt-4 max-w-lg text-[0.975rem] leading-relaxed text-muted">
            Welcome to my blog page. From curiosity to creation — notes on DevOps,
            cloud, and building for the web. Use the search below to filter by topic.
          </p>

          {/* Search + filter chips */}
          <div className="mt-8 flex flex-col gap-4">
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search posts…"
                className="search-field"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCat(cat)}
                  data-active={activeCat === cat}
                  className="filter-chip"
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="mt-12">
            {loading ? (
              <div className="flex items-center gap-3 text-sm text-muted">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
                Loading posts…
              </div>
            ) : error ? (
              <p className="text-sm text-c-red">{error}</p>
            ) : filtered.length === 0 ? (
              <p className="text-sm text-muted">No posts match your search.</p>
            ) : (
              <div className="space-y-12">
                {grouped.map(([year, posts]) => (
                  <section key={year}>
                    <h2 className="mb-2 font-mono text-xs tracking-widest text-muted">{year}</h2>
                    <div className="-mx-3">
                      {posts.map((post, idx) => (
                        <Link
                          key={idx}
                          href={`/blog/${post.slug}`}
                          data-click-sound
                          className="blog-row group"
                        >
                          <Image
                            src={post.image || FALLBACK}
                            alt={post.title}
                            width={56}
                            height={40}
                            className="thumb"
                          />
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate text-[0.95rem] font-medium text-foreground group-hover:text-link">
                              {post.title}
                            </h3>
                            {post.Titledescription && (
                              <p className="mt-0.5 line-clamp-1 text-sm text-muted">
                                {post.Titledescription}
                              </p>
                            )}
                          </div>
                          <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">
                            {formatDate(post.dateposted)}
                            {post.timeToRead ? ` · ${post.timeToRead} min` : ''}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
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
