"use client"
import { useParams } from 'next/navigation'
import { blogData } from '../../../blogData'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const BlogPostPage = () => {
  const params = useParams()
  const slug = params?.slug as string
  const post = blogData.find((p) => p.slug === slug)
  const [readProgress, setReadProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setReadProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!post) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
        <Navbar />
        <div className="text-center mt-20">
          <h1 className="text-7xl font-black text-zinc-800 mb-3">404</h1>
          <p className="text-zinc-400 text-xl mb-8">Blog post not found</p>
          <Link href="/Blog" className="px-6 py-3 bg-emerald-500 text-zinc-900 font-semibold rounded-lg hover:bg-emerald-400 transition-colors">
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-emerald-400 to-emerald-600 z-[100] transition-all duration-75"
        style={{ width: `${readProgress}%` }}
      />

      <Navbar />

      {/* ── HERO ── */}
      <div className="relative w-full h-[65vh] min-h-[440px] mt-16">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Multi-layer overlay for depth */}
        <div className="absolute inset-0 bg-zinc-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-14 px-4">
          <div className="max-w-3xl w-full mx-auto">
            <div className="flex flex-wrap items-center gap-3 mb-5">
              {post.category && (
                <span className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                  {post.category}
                </span>
              )}
              <span className="text-zinc-400 text-sm">{post.timeToRead} min read</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-400 text-sm">{post.dateposted}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-white mb-7">
              {post.title}
            </h1>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-zinc-900 font-bold text-sm flex-shrink-0 ring-2 ring-emerald-500/30">
                {post.author?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{post.author}</p>
                <p className="text-zinc-400 text-xs">Author</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            {post.tags.map((tag: string, i: number) => (
              <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700 text-zinc-300 hover:border-emerald-500/50 hover:text-emerald-400 transition-colors cursor-default">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Summary / intro card — uses Blogdescription only */}
        {post.Blogdescription && (
          <div className="bg-zinc-900 border-l-4 border-emerald-500 rounded-r-xl p-6 mb-10">
            <p className="text-zinc-300 text-base leading-relaxed m-0 italic">
              {post.Blogdescription}
            </p>
          </div>
        )}

        {/* ── MARKDOWN ARTICLE CONTENT ──
            Add a `content` field (markdown string) to each post in blogData.ts
            e.g.  content: "## Introduction\n\nReact is a JavaScript library..."
        */}
        <article>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-extrabold text-white mt-12 mb-5 leading-tight border-b border-zinc-800 pb-3">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-white mt-10 mb-4 leading-snug">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-emerald-300 mt-8 mb-3">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-zinc-300 text-base leading-[1.85] mb-6">{children}</p>
              ),
              strong: ({ children }) => (
                <strong className="text-white font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-zinc-200 italic">{children}</em>
              ),
              ul: ({ children }) => (
                <ul className="list-none space-y-2 mb-6 pl-1">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-6 pl-1 text-zinc-300">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-zinc-300 flex items-start gap-2 text-base leading-relaxed">
                  <span className="text-emerald-500 mt-[5px] flex-shrink-0 text-xs">▸</span>
                  <span>{children}</span>
                </li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-emerald-500 bg-zinc-900 rounded-r-xl px-6 py-4 my-8 italic text-zinc-300">
                  {children}
                </blockquote>
              ),
              code: ({ inline, children }: any) =>
                inline ? (
                  <code className="bg-zinc-800 text-emerald-400 px-1.5 py-0.5 rounded text-sm font-mono">
                    {children}
                  </code>
                ) : (
                  <pre className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 overflow-x-auto my-8">
                    <code className="text-emerald-300 text-sm font-mono leading-relaxed">{children}</code>
                  </pre>
                ),
              a: ({ href, children }) => (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline underline-offset-4 decoration-emerald-500/40 hover:text-emerald-300 hover:decoration-emerald-400 transition-colors">
                  {children}
                </a>
              ),
              hr: () => <hr className="border-zinc-800 my-10" />,
              img: ({ src, alt }) => (
                <div className="relative w-full h-72 rounded-xl overflow-hidden my-8 border border-zinc-800">
                  <Image src={src || ''} alt={alt || ''} fill className="object-cover" />
                </div>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-8">
                  <table className="w-full border-collapse text-sm">{children}</table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-zinc-800 bg-zinc-900 px-4 py-3 text-left text-emerald-400 font-semibold uppercase tracking-wider text-xs">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-zinc-800 px-4 py-3 text-zinc-300">{children}</td>
              ),
            }}
          >
            {post.content ?? ''}
          </ReactMarkdown>
        </article>

        {/* Divider */}
        <div className="my-14 border-t border-zinc-800" />

        {/* Author card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex items-center gap-5 hover:border-emerald-500/30 transition-colors">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-zinc-900 font-extrabold text-2xl flex-shrink-0 ring-2 ring-emerald-500/20">
            {post.author?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Written by</p>
            <h3 className="text-white font-bold text-lg">{post.author}</h3>
            <p className="text-zinc-400 text-sm mt-1">Developer & Writer</p>
          </div>
        </div>

        {/* Back button */}
        <div className="mt-10 flex justify-center">
          <Link
            href="/Blog"
            className="group flex items-center gap-2 px-6 py-3 rounded-full border border-zinc-700 text-zinc-300 hover:border-emerald-500 hover:text-emerald-400 transition-all duration-200 text-sm font-medium"
          >
            <span className="group-hover:-translate-x-1 transition-transform duration-200">←</span>
            Back to all posts
          </Link>
        </div>
      </div>

      {/* ── RELATED POSTS ── */}
      {relatedPosts.length > 0 && (
        <div className="bg-zinc-900/40 border-t border-zinc-800 py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              More in <span className="text-emerald-400">{post.category}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related, idx) => (
                <Link
                  key={idx}
                  href={`/Blog/${related.slug}`}
                  className="group flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:-translate-y-1 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-black/50 transition-all duration-300"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      sizes="33vw"
                      className="object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/10 to-transparent" />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <span className="text-emerald-500 text-xs font-semibold uppercase tracking-widest">{related.category}</span>
                    <h3 className="text-white font-bold text-sm leading-snug line-clamp-2">{related.title}</h3>
                    <p className="text-zinc-500 text-xs">{related.dateposted} · {related.timeToRead} min read</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}

export default BlogPostPage