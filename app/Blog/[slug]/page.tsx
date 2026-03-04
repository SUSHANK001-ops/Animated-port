import type { Metadata } from 'next'
import connectDB from '@/lib/db'
import BlogModel from '@/model/blogModel'
import BlogPostClient from './BlogPostClient'

// ─── Dynamic OG metadata for social sharing ───────────────────────────────────
// This runs on the server so Facebook, X, Instagram, LinkedIn, WhatsApp, etc.
// all see the proper og:image (thumbnail), og:title, og:description when shared.

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params

  try {
    await connectDB()
    const blog = await BlogModel.findOne({ slug }).lean<{
      title: string
      Titledescription?: string
      image?: string
      author?: string
      category?: string
      dateposted?: string
      tags?: string[]
    }>()

    if (!blog) {
      return {
        title: 'Article Not Found',
        description: 'The blog post you are looking for could not be found.',
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sushanka.com.np'
    const postUrl = `${siteUrl}/Blog/${slug}`
    const title = blog.title
    const description = blog.Titledescription || `Read ${blog.title} by ${blog.author || 'Sushanka Lamichhane'}`
    const image = blog.image || `${siteUrl}/logo.svg`

    return {
      title: `${title} | Sushanka Lamichhane`,
      description,
      authors: blog.author ? [{ name: blog.author }] : undefined,
      keywords: blog.tags || [],

      // ── Open Graph (Facebook, Instagram, LinkedIn, WhatsApp, etc.) ────────
      openGraph: {
        type: 'article',
        title,
        description,
        url: postUrl,
        siteName: 'Sushanka Lamichhane',
        locale: 'en_US',
        publishedTime: blog.dateposted || undefined,
        authors: blog.author ? [blog.author] : undefined,
        tags: blog.tags || [],
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
            type: 'image/jpeg',
          },
        ],
      },

      // ── Twitter / X Card ─────────────────────────────────────────────────
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },

      // ── Alternate URLs ────────────────────────────────────────────────────
      alternates: {
        canonical: postUrl,
      },
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
    return {
      title: 'Blog | Sushanka Lamichhane',
      description: 'Read the latest articles from Sushanka Lamichhane.',
    }
  }
}

// ─── Page Component (server) ──────────────────────────────────────────────────
export default function BlogPostPage() {
  return <BlogPostClient />
}