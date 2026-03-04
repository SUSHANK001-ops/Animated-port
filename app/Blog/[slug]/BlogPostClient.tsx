"use client"

import { useParams } from 'next/navigation'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState, useMemo, useCallback } from 'react'
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
  image?: string
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
  return /<(p|div|h[1-6]|ul|ol|li|blockquote|pre|table|figure|br|hr)[\/\s>]/i.test(content);
}

// Helper: extract headings from HTML content
function extractHTMLHeadings(html: string) {
  const headings: { level: number; text: string; id: string }[] = [];
  const regex = /<h([1-3])[^>]*>(.*?)<\/h[1-3]>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, "");
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

// ─── Blog Content Renderer ────────────────────────────────────────────────────
function addIdsToHTML(html: string): string {
  return html.replace(
    /<(h[1-6])([^>]*)>(.*?)<\/h[1-6]>/gi,
    (match, tag, attrs, inner) => {
      const text = inner.replace(/<[^>]*>/g, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (/id\s*=/.test(attrs)) return match;
      return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    }
  );
}

function cleanEditorHTML(html: string): string {
  let cleaned = html;
  cleaned = cleaned.replace(/<p[^>]*>\s*<br\s*\/?>\s*<\/p>/gi, '<p class="editor-spacer">&nbsp;</p>');
  cleaned = cleaned.replace(/&amp;nbsp;/g, '&nbsp;');
  return cleaned;
}

const BlogContent = ({ content }: { content: string }) => {
  const processedContent = useMemo(() => {
    if (!content) return "";
    if (isHTMLContent(content)) {
      let html = addIdsToHTML(content);
      html = cleanEditorHTML(html);
      return html;
    }
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

// ─── Share Buttons ────────────────────────────────────────────────────────────
const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    x: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [url]);

  const nativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch {
        // User cancelled
      }
    }
  }, [title, url]);

  const openShare = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[11px] font-bold tracking-widest uppercase text-gray-500">
        Share this article
      </p>
      <div className="flex items-center gap-2 flex-wrap">
        {/* Facebook */}
        <button
          onClick={() => openShare(shareLinks.facebook)}
          className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
          title="Share on Facebook"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </button>

        {/* X (Twitter) */}
        <button
          onClick={() => openShare(shareLinks.x)}
          className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200"
          title="Share on X"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </button>

        {/* LinkedIn */}
        <button
          onClick={() => openShare(shareLinks.linkedin)}
          className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-blue-400/50 hover:bg-blue-400/10 transition-all duration-200"
          title="Share on LinkedIn"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
          </svg>
        </button>

        {/* WhatsApp */}
        <button
          onClick={() => openShare(shareLinks.whatsapp)}
          className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-green-500/50 hover:bg-green-500/10 transition-all duration-200"
          title="Share on WhatsApp"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-green-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </button>

        {/* Reddit */}
        <button
          onClick={() => openShare(shareLinks.reddit)}
          className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 transition-all duration-200"
          title="Share on Reddit"
        >
          <svg className="w-4 h-4 text-gray-400 group-hover:text-orange-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        </button>

        {/* Native Share (mobile) */}
        {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
          <button
            onClick={nativeShare}
            className="group flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-200"
            title="Share via..."
          >
            <svg className="w-4 h-4 text-gray-400 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </button>
        )}

        {/* Copy Link */}
        <div className="relative">
          <button
            onClick={copyLink}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className={`group flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 ${
              copied
                ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
            }`}
            title="Copy link"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            )}
          </button>
          {(showTooltip || copied) && (
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-[10px] bg-[#222] border border-white/10 text-white/70 whitespace-nowrap">
              {copied ? 'Copied!' : 'Copy link'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const BlogPostClient = () => {
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
    <div className="min-h-screen mt-20 text-gray-200">
      <ReadingProgress progress={readProgress} />
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0">
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
          <h1 className="text-4xl md:text-5xl lg:text-[45px] font-bold leading-[1.12] tracking-tight text-white">
            {post.title}
          </h1>

          {/* Description */}
          {(post.Titledescription || post.Blogdescription) && (
            <p className="text-sm text-gray-400 leading-relaxed max-w-6xl">
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

      {/* ── FEATURED IMAGE ─────────────────────────────────────────────────── */}
      {post.image && (
        <div className="max-w-3xl mx-auto px-6 mb-4">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
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

            {/* Share in sidebar */}
            {pageUrl && (
              <ShareButtons url={pageUrl} title={post.title} />
            )}
          </div>
        </aside>

        {/* Article */}
        <article className="min-w-0 max-w-none prose-invert">

          {/* Mobile share row */}
          <div className="lg:hidden mb-8">
            {pageUrl && (
              <ShareButtons url={pageUrl} title={post.title} />
            )}
          </div>

          {/* Blog content */}
          <BlogContent content={post.content ?? ''} />

          {/* ── Share after content ──────────────────────────────────────────── */}
          <div className="mt-12 pt-8 border-t border-white/10">
            {pageUrl && (
              <ShareButtons url={pageUrl} title={post.title} />
            )}
          </div>

          {/* ── Author card ──────────────────────────────────────────────────── */}
          <div className="flex items-center gap-5 mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
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
                href={`/Blog/${related.slug}`}
                className="group relative flex flex-col gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
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

export default BlogPostClient
