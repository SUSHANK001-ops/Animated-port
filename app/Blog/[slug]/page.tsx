"use client"

import { useParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import '../blog-content.css'

interface BlogPost {
  slug: string
  title: string
  author: string
  category: string
  tags?: string[]
  dateposted: string
  timeToRead: number
  Blogdescription?: string
  Titledescription?: string
  content?: string
  image?: string       // ← correct field name from your DB
}

// ─── Reading Progress Bar ─────────────────────────────────────────────────────
const ReadingProgress = ({ progress }: { progress: number }) => (
  <div className="fixed top-0 left-0 right-0 z-[100] h-[3px] bg-transparent">
    <div
      className="h-full bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 transition-all duration-75 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
)

// Helper: detect if content is HTML (from the rich text editor) vs Markdown
function isHTMLContent(content: string): boolean {
  // If it contains common HTML block tags, treat as HTML
  return /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|figure|br|hr)[\/\s>]/i.test(content);
}

// Helper: extract headings from HTML content
function extractHTMLHeadings(html: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, ""); // strip inner tags
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    headings.push({ level, text, id });
  }
  return headings;
}

// Helper: extract headings from Markdown content
function extractMarkdownHeadings(content: string) {
  return content
    .split("\n")
    .filter((line) => line.match(/^#{1,3} /))
    .map((line) => {
      const level = line.match(/^(#+)/)?.[1].length ?? 1;
      const text = line.replace(/^#+\s/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      return { level, text, id };
    });
}

// ─── Table of Contents ────────────────────────────────────────────────────────
const TableOfContents = ({ content }: { content: string }) => {
  const headings = isHTMLContent(content)
    ? extractHTMLHeadings(content)
    : extractMarkdownHeadings(content);

  if (headings.length < 2) return null;

  return (
    <nav className="p-5 bg-white/5 border border-white/10 rounded-xl">
      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-4">
        On this page
      </p>
      <ul className="flex flex-col gap-0.5">
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <a
              href={`#${h.id}`}
              className="block px-2 py-1.5 rounded-md text-[13px] text-gray-400 hover:text-emerald-400 hover:bg-white/5 transition-colors duration-150 leading-snug"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// InlineImage: accepts a string URL or a Blob and provides a string src for Next Image
const InlineImage: React.FC<{
  src?: string | Blob
  alt?: string
  sizes?: string
  className?: string
  fill?: boolean
}> = ({ src, alt, sizes, className, fill }) => {
  const [url, setUrl] = useState<string>('')

  useEffect(() => {
    if (!src) {
      setUrl('')
      return
    }

    if (typeof src === 'string') {
      setUrl(src)
      return
    }

    const objectUrl = URL.createObjectURL(src as Blob)
    setUrl(objectUrl)
    return () => {
      URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  if (!url) return null

  return (
    <Image
      src={url}
      alt={alt || ''}
      fill={fill}
      sizes={sizes}
      className={className}
    />
  )
}

// ─── Blog Content Renderer ────────────────────────────────────────────────────
// Adds IDs to headings for anchor links, renders HTML with proper styling
function addIdsToHTML(html: string): string {
  return html.replace(
    /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi,
    (match, tag, attrs, inner) => {
      const text = inner.replace(/<[^>]*>/g, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      // Don't add id if one already exists
      if (/id\s*=/.test(attrs)) return match;
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    }
  );
}

const BlogContent = ({ content }: { content: string }) => {
  const processedContent = useMemo(() => {
    if (!content) return "";
    if (isHTMLContent(content)) {
      return addIdsToHTML(content);
    }
    // Fallback: if content is plain/markdown text, wrap in <p> tags
    return content
      .split("\n\n")
      .map((block) => `<p>${block.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }, [content]);

  return (
    <div
      className="blog-html-content"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BlogPostPage = () => {
  const [blogData, setBlogData] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [readProgress, setReadProgress] = useState(0)
  const [pageUrl, setPageUrl] = useState('')

  useEffect(() => {
    setPageUrl(window.location.href)
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get('/api/blog')
        setBlogData(response.data.blogs)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  }, [])

  const params = useParams()
  const slug = params?.slug as string
  const post = blogData.find((p) => p.slug === slug)

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setReadProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Share URLs
  const encodedUrl = encodeURIComponent(pageUrl)
  const encodedTitle = encodeURIComponent(post?.title ?? '')
  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  }

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-5">
          <div className="w-11 h-11 rounded-full border-2 border-white/10 border-t-emerald-400 animate-spin" />
          <p className="text-gray-500 text-sm tracking-wider">Loading article…</p>
        </div>
        <Footer />
      </div>
    )
  }

  // ── 404 ──────────────────────────────────────────────────────────────────────
  if (!post) {
    return (
      <div className="min-h-screen bg-[#0a0c0e] flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-5">
          <span className="text-[120px] font-bold leading-none bg-gradient-to-br from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
            404
          </span>
          <h1 className="text-3xl font-bold text-white">Article not found</h1>
          <p className="text-gray-400 max-w-sm">
            The post you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/Blog"
            className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-emerald-500/50 hover:text-white transition-all duration-200"
          >
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const relatedPosts = blogData
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3)

  const initials = post.author
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="min-h-screen mt-20  text-gray-200">
      <ReadingProgress progress={readProgress} />
      <Navbar />

      {/* ── HERO (text only, no bg image) ──────────────────────────────────── */}
      <header className="relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 ]">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto px-6 pt-16 pb-10 flex flex-col gap-5">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[13px] text-gray-500">
            <Link href="/Blog" className="hover:text-emerald-400 transition-colors">
              Blog
            </Link>
            <span className="text-white/20">›</span>
            <span className="text-gray-400">{post.category}</span>
          </nav>

          {/* Category pill */}
          {post.category && (
            <span className="inline-flex w-fit items-center px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
              {post.category}
            </span>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold leading-[1.12] tracking-tight text-white">
            {post.title}
          </h1>

          {/* Description (Titledescription from DB) */}
          {(post.Titledescription || post.Blogdescription) && (
            <p className="text-lg text-gray-400 leading-relaxed max-w-2xl">
              {post.Titledescription ?? post.Blogdescription}
            </p>
          )}

          {/* Divider */}
          <hr className="border-t border-white/10" />

          {/* Meta row */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-[13px] font-bold text-[#0a0c0e] shrink-0">
              {initials}
            </div>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-gray-400">By</span>
              <span className="font-semibold text-gray-200">{post.author}</span>
              <span className="text-white/20">•</span>
              {/* Calendar icon */}
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <rect x="3" y="4" width="18" height="18" rx="2" strokeWidth="2" />
                <path d="M16 2v4M8 2v4M3 10h18" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="text-gray-400">{post.dateposted}</span>
              <span className="text-white/20">•</span>
              <span className="text-gray-400">{post.timeToRead} min read</span>
            </div>
          </div>

        
        </div>
      </header>

      {/* ── FEATURED IMAGE (like image 3) ──────────────────────────────────── */}
      {post.image && (
        <div className="max-w-3xl mx-auto px-6 mb-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden  ">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-contain object-center"
            />
          </div>
        </div>
      )}

      {/* ── BODY ──────────────────────────────────────────────────────────── */}
      <div className="max-w-[1100px] mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 items-start">

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-5">
            {post.content && <TableOfContents content={post.content} />}

            
          </div>
        </aside>

        {/* Article */}
        <article className="min-w-0">

          {/* Mobile share row */}
          

          {/* Blog content */}
          <BlogContent content={post.content ?? ''} />

          {/* ── Author card ──────────────────────────────────────────────────── */}
          <div className="flex items-center gap-5 mt-16 p-6 bg-white/5 border border-white/10 rounded-2xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-400 flex items-center justify-center text-xl font-bold text-[#0a0c0e] shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-1">
                Written by
              </p>
              <p className="text-xl font-bold text-white">{post.author}</p>
              <p className="text-sm text-gray-400 mt-0.5">Developer &amp; Writer</p>
            </div>
          </div>
  {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap mt-4 gap-2">
              {post.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-gray-400 hover:border-emerald-500/40 hover:text-emerald-400 transition-colors cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {/* ── Back link ────────────────────────────────────────────────────── */}
          <div className="mt-10">
            <Link
              href="/Blog"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-emerald-400 transition-colors"
            >
              ← Back to all posts
            </Link>
          </div>
        </article>
      </div>

      {/* ── RELATED POSTS ─────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="max-w-[1100px] mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold text-white mb-7">
            More in <span className="text-emerald-400">{post.category}</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {relatedPosts.map((related, idx) => (
              <Link
                key={idx}
                href={`/blog/${related.slug}`}
                className="group relative flex flex-col gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                {/* Related post image */}
                {related.image && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-1">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                )}

                <span className="text-[11px] font-bold tracking-widest uppercase text-emerald-400">
                  {related.category}
                </span>
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {related.title}
                </h3>
                <p className="text-[13px] text-gray-500 mt-auto">
                  {related.dateposted} · {related.timeToRead} min read
                </p>
                <span className="text-emerald-400 text-lg opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

export default BlogPostPage