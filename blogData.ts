interface BlogPost {
  slug: string;
  title: string;
  timeToRead: string;
  Titledescription: string;
  image: string;
  tags: string[];
  category: string;
  dateposted: string;
  author: string;
  content: string;
}
interface category {
  name: string;
  color: string;
}
const blogData: BlogPost[] = [
  {
    "slug": "getting-started-with-react-for-beginners",
    "title": "Getting Started with React for Beginners",
    "timeToRead": "5 ",
    "Titledescription": "dadawdaw;dhiabjdljahjdjabdhkjadghadjklajakldjahjdlajgdkawl;dhk ajkdljakbdj,ajdbhkdjhadjjandkjajdawjkwdawjdkawndjawkdnawjkdmnadkjawndnawkdawnkjdmnawdkjawmdlajkdawldkam.diladjwakmdawjildkwajdlkadjakdajkdajjkdawjldkajdjkwadljkadjkaLearn the basics of React, components, props, and how to build your first interactive UI using this popular JavaScript library.",
    "image": "/images/blog/react-beginners.jpg",
    "tags": ["React", "JavaScript", "Frontend"],
    "category": "Web Development",
    "dateposted": "2026-02-20",
    "author": "Sushank Lamichhane",
    "content": "## Introduction\n\nReact is a JavaScript library for building user interfaces. In this article, we'll cover the basics of React, including components, props, and state management.\n\n### Components\n\nComponents are the building blocks of React applications. They allow you to split the UI into independent, reusable pieces.\n\n### Props\n\nProps are inputs to components. They are passed to components via HTML attributes and help make components dynamic.\n\n### State Management\n\nState is a built-in object that stores property values that belong to a component. When the state object changes, the component re-renders.\n\n" 
  },
  {
    "slug": "why-nextjs-is-perfect-for-modern-web-apps",
    "title": "Why Next.js is Perfect for Modern Web Apps",
    "timeToRead": "6 ",
    "Titledescription": "Discover how Next.js improves performance with server-side rendering, routing, and optimization features for scalable web applications.",
    "image": "/images/blog/nextjs-modern.jpg",
    "tags": ["Next.js", "React", "Performance"],
    "category": "Frameworks",
    "dateposted": "2026-02-18",
    "author": "Sushank Lamichhane",
    "content": "## Why Next.js?\n\nNext.js enables server-side rendering, automatic code splitting, and optimized asset loading. These features help developers build scalable and performant web applications.\n\n### Server-side Rendering\n\nSSR improves SEO and initial load performance.\n\n### Routing\n\nNext.js provides a file-based routing system that is easy to use and flexible.\n\n### Optimization\n\nBuilt-in optimizations make your apps faster and more efficient.\n\n"
  },
  {
    "slug": "creating-smooth-animations-using-gsap",
    "title": "Creating Smooth Animations Using GSAP",
    "timeToRead": "4 ",
    "Titledescription": "A quick guide to adding professional-grade animations to your website using GSAP to enhance user experience and visual appeal.",
    "image": "/images/blog/gsap-animations.jpg",
    "tags": ["GSAP", "Animation", "Frontend"],
    "category": "UI/UX",
    "dateposted": "2026-02-15",
    "author": "Sushank Lamichhane",
    "content": "## GSAP Animations\n\nGSAP is a powerful JavaScript library for creating high-performance animations.\n\n### Getting Started\n\nInstall GSAP and start animating elements with ease.\n\n### Examples\n\nGSAP can animate properties, timelines, and more for smooth UI effects.\n\n"
  },
  {
    "slug": "tailwind-css-tips-for-faster-ui-development",
    "title": "Tailwind CSS Tips for Faster UI Development",
    "timeToRead": "7 ",
    "Titledescription": "Boost your productivity with Tailwind CSS by learning utility-first styling techniques and best practices for clean and responsive design.",
    "image": "/images/blog/tailwind-tips.jpg",
    "tags": ["Tailwind CSS", "CSS", "Design"],
    "category": "Styling",
    "dateposted": "2026-02-10",
    "author": "Sushank Lamichhane",
    "content": "## Tailwind CSS Tips\n\nTailwind CSS lets you build custom UIs quickly using utility classes.\n\n### Productivity\n\nUse utility-first styling for rapid development.\n\n### Best Practices\n\nKeep your design clean and responsive with Tailwind's features.\n\n"
  }
]
const categories: category[] = [
  { name: "Web Development", color: "#00ff88" },
  { name: "Frameworks", color: "#00d4ff" },
    { name: "UI/UX", color: "#FF8C00" },    
    { name: "Styling", color: "#E9A8F2" },
]
export { blogData, categories };