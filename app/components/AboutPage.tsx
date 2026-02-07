import Image from "next/image";
import "./ExtraCss/About.css";
import Marquee from "./UI/Marquee";
const AboutPage = () => {
  return (
    <div id="about" className="relative -mt-10">
   
    
    <div className="flex md:min-h-screen flex-col md:flex-row px-4 md:px-10 items-center justify-center md:justify-between bg-background text-foreground">
      <div className="left md:h-[70vh] md:w-[50vw] flex flex-col justify-center items-center text-center md:bg-rose-700">
        <h1 className="mt-4 md:mt-3 text-2xl md:text-4xl font-bold">About me</h1>
        <p className="text-sm md:text-xl p-3 sm:p-5 sm:mt-8 w-full max-w-[90vw] md:w-10/12">
          Hi, I&apos;m Sushank Lamichhane, a BSc IT student with a passion for
          technology and creativity. I specialize in programming, graphic
          design, and web development. I am a passionate web developer with a
          strong focus on creating visually stunning and user-friendly websites.
          With a keen eye for design and a deep understanding of front-end
          technologies, I strive to bring ideas to life through innovative and
          responsive web solutions. My goal is to craft seamless digital
          experiences that captivate users and leave a lasting impression.
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
