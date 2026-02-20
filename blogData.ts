interface BlogPost {
  title: string;
  timeToRead: string;
  description: string;
  image: string;
  tags: string[];
  category: string;
  dateposted: string;
  author: string;
}
interface category {
  name: string;
  color: string;
}
const blogData: BlogPost[] = [
  {
    "title": "Getting Started with React for Beginners",
    "timeToRead": "5 min read",
    "description": "Learn the basics of React, components, props, and how to build your first interactive UI using this popular JavaScript library.",
    "image": "/images/blog/react-beginners.jpg",
    "tags": ["React", "JavaScript", "Frontend"],
    "category": "Web Development",
    "dateposted": "2026-02-20",
    "author": "Sushank Lamichhane"
  },
  {
    "title": "Why Next.js is Perfect for Modern Web Apps",
    "timeToRead": "6 min read",
    "description": "Discover how Next.js improves performance with server-side rendering, routing, and optimization features for scalable web applications.",
    "image": "/images/blog/nextjs-modern.jpg",
    "tags": ["Next.js", "React", "Performance"],
    "category": "Frameworks",
    "dateposted": "2026-02-18",
    "author": "Sushank Lamichhane"
  },
  {
    "title": "Creating Smooth Animations Using GSAP",
    "timeToRead": "4 min read",
    "description": "A quick guide to adding professional-grade animations to your website using GSAP to enhance user experience and visual appeal.",
    "image": "/images/blog/gsap-animations.jpg",
    "tags": ["GSAP", "Animation", "Frontend"],
    "category": "UI/UX",
    "dateposted": "2026-02-15",
    "author": "Sushank Lamichhane"
  },
  {
    "title": "Tailwind CSS Tips for Faster UI Development",
    "timeToRead": "7 min read",
    "description": "Boost your productivity with Tailwind CSS by learning utility-first styling techniques and best practices for clean and responsive design.",
    "image": "/images/blog/tailwind-tips.jpg",
    "tags": ["Tailwind CSS", "CSS", "Design"],
    "category": "Styling",
    "dateposted": "2026-02-10",
    "author": "Sushank Lamichhane"
  }
]
const categories: category[] = [
  { name: "Web Development", color: "#00ff88" },
  { name: "Frameworks", color: "#00d4ff" },
    { name: "UI/UX", color: "#FF8C00" },    
    { name: "Styling", color: "#E9A8F2" },
]
export { blogData, categories };