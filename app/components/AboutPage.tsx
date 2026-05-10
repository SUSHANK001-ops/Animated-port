import React, { useEffect, useRef } from "react";
import Image from "next/image";
import "./ExtraCss/About.css";

import { useSections } from "./SectionContext";

const AboutPage = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { registerSection } = useSections();

  useEffect(() => {
    registerSection("about", rootRef.current);
  }, [registerSection]);

  return (
    <div ref={rootRef} id="about" className="relative mt-16">
      <div className="flex md:min-h-screen flex-col md:flex-row px-4 md:px-10 items-center justify-center md:justify-between bg-background text-foreground">
        <div className="left md:h-[80vh] md:w-[70vw] flex flex-col justify-center items-center text-center md:bg-[#06974f] ">
          <h1 className="mt-4 md:mt-3 text-2xl md:text-4xl font-bold">
            About me
          </h1>
          <p className="text-sm p-3    w-full max-w-[70vw] md:w-10/12 mt-4 md:mt-6 ">
            A Full-Stack Developer and BSc IT student specializing in modern web applications, responsive UI/UX, and scalable backend systems. He combines technical expertise with creative design thinking to build seamless, user-focused digital experiences. Skilled in frontend and backend development, problem-solving, and agile collaboration, Sushanka focuses on creating high-quality solutions that are both visually impressive and highly functional.
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
