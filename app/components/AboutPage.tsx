import React, { useEffect, useRef } from "react";
import Image from "next/image";
import "./ExtraCss/About.css";

import { useSections } from "./SectionContext";

const AboutPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useSections();

  useEffect(() => {
    registerSection('about', rootRef.current);
  }, [registerSection]);

  return (
    <div ref={rootRef} id="about" className="relative mt-16">
      <div className="flex md:min-h-screen flex-col md:flex-row px-4 md:px-10 items-center justify-center md:justify-between bg-background text-foreground">
        <div className="left md:h-[80vh] md:w-[70vw] flex flex-col justify-center items-center text-center md:bg-[#06974f] ">
          <h1 className="mt-4 md:mt-3 text-2xl md:text-4xl font-bold">
            About me
          </h1>
          <p className="text-sm p-3    w-full max-w-[70vw] md:w-10/12 mt-4 md:mt-6 ">
            Hi, I’m Sushank Lamichhane, a BSc IT student and passionate web
            developer who loves turning ideas into real, impactful digital
            products. I specialize in building modern, responsive, and
            user-focused websites using technologies like JavaScript, React,
            Next.js, and Tailwind CSS, with added creativity through smooth
            animations using GSAP. Beyond coding, I enjoy combining technology
            with design and problem-solving — whether it’s developing full web
            applications, creating useful tools, or crafting clean UI
            experiences. I focus on writing efficient code, learning
            continuously, and building projects that are not just visually
            appealing but also practical and meaningful.
          </p>
        </div>
        <div className="right w-10/12 sm:w-8/12 md:w-4/12 flex justify-center mt-8 md:mt-0">
          <Image
            className="rounded-3xl ml-0 md:-ml-10 mb-10 w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] object-cover"
            src="/profile.jpeg"
            alt="Profile"
            width={400}
            height={400}
          />
        </div>
      </div>
      {/* <Marquee /> */}
    </div>
  );
};

export default AboutPage;
