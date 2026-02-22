'use client';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLinkIcon, Github } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSections } from "./SectionContext";
import BounceAnimation from "./UI/BounceAnimation";
interface Project {
  title: string;
  description: string;
  tags: string[];
  color: string;
  liveUrl: string;
  githubUrl: string;
  featured: boolean;
}
const projects: Project[] = [
  {
    title: "SenChat",
    description:
      "A real-time chatting application with instant messaging, user authentication, and a sleek conversational UI. Built as a full-stack project with modern web technologies.",
    tags: ["MERN Stack", "Socket.io", "Real-time", "Authentication"],
    color: "#00ff88",
    liveUrl: "https://senchat.sushanka.com.np",
    githubUrl: "",
    featured: true,
  },
  {
    title: "SenBlog",
    description:
      "A full-stack blogging platform with rich text editing, user dashboards, and content management. Features responsive design, authentication, and a clean reading experience.",
    tags: ["MongoDB", "Express", "React", "Node.js"],
    color: "#00d4ff",
    liveUrl: "https://senblog.vercel.app/",
    githubUrl: "",
    featured: true,
  },
  {
    title: "SenTools",
    description:
      "A comprehensive utility toolkit web app with multiple developer and productivity tools built into a single platform. Clean UI with intuitive navigation.",
    tags: ["Next.js", "JavaScript", "Tailwind CSS"],
    color: "#E9A8F2",
    liveUrl: "https://sentools.vercel.app/",
    githubUrl: "https://github.com/SUSHANK001-ops/SenTOols.git",
    featured: true,
  },
  {
  "title": "UrlShare",
  "description": "A full-stack file sharing web app that allows users to upload files up to 100MB and generate public download links with QR code sharing and automatic expiration. Built with a responsive UI and cloud-based file storage.",
  "tags": ["Next.js", "Express", "PostgreSQL", "Cloudinary"],
  "color": "#6C9BFF",
  "liveUrl": "https://urlshare.sushanka.com.np",
  "githubUrl": "https://github.com/SUSHANK001-ops/UrlShare.git",
  "featured": true
}
];
const ProjectsPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useSections();
  useEffect(() => {
    registerSection('projects', rootRef.current);
  }, [registerSection]);

  const lineRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: lineRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

   

    // Infinite marquee for project cards (desktop only)
    if (!isMobile && marqueeTrackRef.current) {
      tweenRef.current = gsap.to(marqueeTrackRef.current, {
        xPercent: -50,
        repeat: -1,
        duration: 30,
        ease: "none",
      });
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [isMobile]);

  const handleMouseEnter = () => tweenRef.current?.pause();
  const handleMouseLeave = () => tweenRef.current?.resume();

  // Drag / swipe support
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartProgress = useRef(0);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (isMobile) return;
    isDragging.current = true;
    dragStartX.current = e.clientX;
    if (tweenRef.current) {
      tweenRef.current.pause();
      dragStartProgress.current = tweenRef.current.progress();
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [isMobile]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current || !tweenRef.current || !marqueeTrackRef.current) return;
    const delta = e.clientX - dragStartX.current;
    const trackWidth = marqueeTrackRef.current.scrollWidth / 2;
    const progressDelta = -delta / trackWidth;
    let newProgress = dragStartProgress.current + progressDelta;
    // Wrap progress between 0 and 1 for seamless looping
    newProgress = ((newProgress % 1) + 1) % 1;
    tweenRef.current.progress(newProgress);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (!isDragging.current) return;
    isDragging.current = false;
    tweenRef.current?.resume();
  }, []);

  // Duplicate projects for seamless infinite loop
  const duplicatedProjects = [...projects, ...projects];

  return (
    <div ref={rootRef} id="projects" className=" my-20 bg-[#1B1B1B] flex flex-col items-center">
      <h1 className="text-5xl md:text-6xl mt-5 font-bold text-[#06DF73]">
        My Projects
      </h1>
      <div
        ref={lineRef}
        className="mx-auto mt-6 h-0.5 w-24 bg-green-400 origin-center"
      />
      <BounceAnimation tagline1="Code with Purpose" tagline2=" Build with Impact" />

      {/* Mobile: normal vertical layout */}
      {isMobile && (
        <div className="flex flex-col items-center gap-6 mt-24 w-[90%] mx-auto">
          {projects.map((project, idx) => (
            <div
              key={idx}
              className="p-4 w-full border-2 border-gray-100 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-7xl text-gray-200">
                  {" "}
                  {idx < 9 ? `0${idx + 1}` : idx + 1}
                </h1>
                <div className="flex gap-3 items-center">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-100 flex gap-2 items-center hover:scale-105 transition-all duration-100"
                  >
                    <ExternalLinkIcon /> <span>Live</span>
                  </a>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-100 flex gap-2 items-center hover:scale-105 transition-all duration-100"
                    >
                      code <Github />
                    </a>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-200">{project.title}</h2>
              <p className="text-gray-400">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="bg-gray-600 px-2 py-1 rounded-2xl text-center text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop: Marquee container */}
      {!isMobile && (
        <div
          className="w-[80%] overflow-hidden mt-24 mx-auto cursor-grab active:cursor-grabbing select-none"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => {
            handleMouseLeave();
            handlePointerUp();
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div
            ref={marqueeTrackRef}
            className="flex w-max gap-6 py-4"
          >
            {duplicatedProjects.map((project, idx) => (
              <div
                key={idx}
                className="p-4 h-100 w-80 shrink-0 border-2 border-gray-100 rounded-lg shadow-md transition-transform duration-300 hover:scale-105"
              >
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-7xl text-gray-200">
                  {" "}
                  {(idx % projects.length) < 9
                    ? `0${(idx % projects.length) + 1}`
                    : (idx % projects.length) + 1}
                </h1>
                <div className="flex gap-3 items-center">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-100 flex gap-2 items-center hover:scale-105 transition-all duration-100"
                  >
                    <ExternalLinkIcon /> <span>Live</span>
                  </a>
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-100 flex gap-2 items-center hover:scale-105 transition-all duration-100"
                    >
                      code <Github />
                    </a>
                  )}
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-200">{project.title}</h2>
              <p className="text-gray-400">{project.description}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="bg-gray-600 px-2 py-1 rounded-2xl text-center text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
