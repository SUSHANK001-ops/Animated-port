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
            Hi, I'm Sushanka Lamichhane, a BSc IT student and Full-Stack
            Developer with a passion for technology and creativity. I specialize
            in crafting visually stunning, responsive websites by blending a
            keen eye for design with strong technical problem-solving.  Beyond
            coding, I thrive in agile environments, valuing collaborative
            teamwork, time management, and adaptability. My goal is to use my
            analytical thinking and creative design approach to build seamless
            digital experiences that leave a lasting impression.
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
