import gsap from "gsap";

import { SplitText } from "gsap/SplitText";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const mobileMenuRef = useRef(null);
  const navbarRef = useRef<HTMLElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        // Scrolling down — hide
        gsap.to(navbarRef.current, {
          y: -150,
          duration: 0.7,
          ease: "power3.out",
        });
      } else {
        // Scrolling up — show
        gsap.to(navbarRef.current, {
          y: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    gsap.registerPlugin(SplitText);
    if (isMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        duration: 0.5,
        left: "0%",
        ease: "power3.inOut",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        duration: 0.5,
        left: "-100%",
        ease: "power3.inOut",
      });
    }
    gsap.to( ".navlinks", {
      duration: 1,
      opacity: isMenuOpen ? 1 : 0,
      scale: isMenuOpen ? 1 : 0.8,
      stagger: 0.1,
      ease: "power3.inOut",

    })
  }, [isMenuOpen]);

  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.currentTarget;
    const split = SplitText.create(target, {
      type: "chars",
    });
    gsap.from(split.chars, {
      duration: 0.4,
      y: -8,
      opacity: 0,
      stagger: 0.05,
      ease: "back.out(1.7)",
    });
  };

  return (
    <nav ref={navbarRef} className="fixed top-0 left-0 flex items-center justify-center w-full z-50">
      {/* Navbar content goes here */}
      <div className="p-6 navbar mt-8 items-center  gap-28 md:gap-9 rounded-full w-fit flex justify-center z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
        <div className="left-section">
          <div className="flex gap-2 text-xl font-devanagari font-medium text-white">
            <p className="font-Kalam">||</p>
            <Link href="#home" className="hover:scale-105 transition-transform duration-300 font-Kalam">
              <h2>सुशांक</h2>
            </Link>
            <p className="font-Kalam">||</p>
          </div>
        </div>
        <div className="right-section md:flex hidden gap-8 text-white font-semibold text-sm tracking-wide">
          <Link onMouseEnter={handleMouseEnter} href="#about">
            About
          </Link>
          <Link onMouseEnter={handleMouseEnter} href="#services">
            Services
          </Link>
          <Link onMouseEnter={handleMouseEnter} href="#projects">
            Projects
          </Link>
          <Link onMouseEnter={handleMouseEnter} href="#experience">
            Experience
          </Link>
          <Link onMouseEnter={handleMouseEnter} href="#contact">
            Contact
          </Link>
        </div>
        {/* Mobile menu icon can go here */}
        <Menu className="md:hidden hover:scale-105 " onClick={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
      {/* Mobile menu overlay OUTSIDE the centered container */}
      <div
        ref={mobileMenuRef}
        className="menuitems md:hidden flex flex-col fixed top-0  bg-gray-900 bg-opacity-70 rounded-lg gap-4 w-full h-screen -right-full text-white font-semibold z-50"
      >
        <div className="navlinks flex flex-col gap-8 text-3xl justify-center h-full w-full items-center">
          <div className="absolute top-8 left-8">
            <div className="flex gap-2 text-xl font-devanagari font-medium text-white">
              <p>||</p>
              <Link href="#home">
                <h2>सुशांक</h2>
              </Link>
              <p>||</p>
            </div>
          </div>
          <X className="absolute top-8 right-8 cursor-pointer z-50" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
          <div className="navlinks flex flex-col gap-8 text-3xl justify-center h-full w-full items-center">
            <Link href="#about" onClick={() => setIsMenuOpen(false)}>About</Link>
            <Link href="#services" onClick={() => setIsMenuOpen(false)}>Services</Link>
            <Link href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</Link>
            <Link href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</Link>
            <Link href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
