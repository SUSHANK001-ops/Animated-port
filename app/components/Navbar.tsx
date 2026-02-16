import gsap from "gsap";

import { SplitText } from "gsap/SplitText";
import { Menu, X } from "lucide-react";

import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const mobileMenuRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(SplitText);
    if (isMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        duration: 0.5,
        right: "0%",
        ease: "power3.inOut",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        duration: 0.5,
        right: "-100%",
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
    <nav className="p-6 navbar fixed top-0 left-0 w-full flex justify-between items-center z-50 bg-black/20 backdrop-blur-md border-b border-white/5">
      {/* Navbar content goes here */}
      <div className="left-section">
        <div className="flex gap-2 text-xl font-devanagari font-medium text-white">
          <p>||</p>
         <a href="#home">
          <h2>सुशांक</h2>
          </a> 
          <p>||</p>
        </div>
      </div>
      <div className="right-section md:flex hidden gap-8 text-white font-semibold text-sm tracking-wide">
        <a onMouseEnter={handleMouseEnter} href="#about">
          About
        </a>
        <a onMouseEnter={handleMouseEnter} href="#services">
          Services
        </a>
        <a onMouseEnter={handleMouseEnter} href="#projects">
          Projects
        </a>
        <a onMouseEnter={handleMouseEnter} href="#experience">
          Experience
        </a>
        <a onMouseEnter={handleMouseEnter} href="#contact">
          Contact
        </a>
      </div>

      {/* Mobile menu icon can go here */}
      <Menu className="md:hidden hover:scale-105 " onClick={() => setIsMenuOpen(!isMenuOpen)} />
      <div
        ref={mobileMenuRef}
        className="menuitems md:hidden flex flex-col  absolute top-0 
         bg-gray-900 bg-opacity-70  rounded-lg gap-4 w-screen h-screen -right-full text-white font-semibold"
      >
        <div className="navlinks flex flex-col gap-8  text-3xl justify-center h-full w-full items-center">
          <div className="absolute top-8 left-8">
        <div className="flex gap-2 text-xl font-devanagari font-medium text-white">
          <p>||</p>
         <a href="#home">
          <h2>सुशांक</h2>
          </a> 
          <p>||</p>
        </div>
      </div>
          <X className=" absolute top-8 right-8 cursor-pointer z-50" onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }} />
         
         <div className="navlinks flex flex-col gap-8  text-3xl justify-center h-full w-full items-center">
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#projects" onClick={() => setIsMenuOpen(false)}>Projects</a>
          <a href="#experience" onClick={() => setIsMenuOpen(false)}>Experience</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
          </div> 
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
