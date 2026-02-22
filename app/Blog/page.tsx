"use client"
import Navbar from '../components/Navbar'
import BounceAnimation from '../components/UI/BounceAnimation'
import Footer from '../components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Blogs = () => {
  const [blogData, setBlogData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(()=>{
    const fetchBlogs = async () =>{
      try {
        const response = await axios.get("/api/blog");
        setBlogData(response.data.blogs)
      } catch (error) {
        console.error("Error fetching blogs:", error);
        setError("Failed to fetch blogs. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchBlogs()
  },[])

  return (
    <div className='flex items-center flex-col'>
      <Navbar />
      <div className='mt-25 h-full'>
        <h1 className='text-3xl font-bold text-center mt-10'>Blog Page</h1>
        <BounceAnimation tagline1="From curiosity to creation." tagline2="Words, code, and the craft in between." tag1color='EB4C4C' tag2color='FFA6A6' />
      </div>
      

      <div className="w-full flex items-center justify-center min-h-[300px]">
        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-zinc-400 text-sm">Loading blogs...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 font-semibold">{error}</p>
        ) : blogData.length === 0 ? (
          <p className="text-zinc-400 text-lg">No blog posts found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {blogData.map((post, idx) => (
              <Link
                key={idx}
                href={`/Blog/${post.slug}`}
                className="group relative flex flex-col bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:-translate-y-2 hover:border-amber-500/40 hover:shadow-2xl hover:shadow-black/60 transition-all duration-300 cursor-pointer"
              >
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/20 to-transparent" />
                  {post.category && (
                    <div>
                      <span className="absolute top-3 left-3 bg-zinc-900/80 backdrop-blur-sm border border-emerald-500/10 text-emerald-500 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="absolute top-3 right-3 bg-zinc-900/80 backdrop-blur-sm border border-emerald-500/10 text-emerald-500 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full">
                        {post.timeToRead} min read
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col flex-1 p-5 gap-3">
                  <h2 className="text-white font-bold text-lg leading-snug group-hover:text-shadow-emerald-300 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-zinc-400 text-sm leading-relaxed line-clamp-3 flex-1">
                    {post.Titledescription}
                  </p>
                  <div className="border-t border-zinc-800" />
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-zinc-900 text-xs font-bold flex-shrink-0">
                        {post.author?.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-zinc-300 text-xs font-medium truncate max-w-[100px]">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-zinc-500 text-xs whitespace-nowrap">
                      {post.dateposted}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default Blogs