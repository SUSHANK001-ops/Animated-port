import "./ExtraCss/About.css";
const AboutPage = () => {
  return (
    <div className="flex h-screen px-10 items-center justify-between  bg-background text-foreground">
      <div className="left w-22 flex flex-col justify-center items-center h-fit text-center  bg-rose-700">
        <h1 className="-mt-20 text-4xl font-bold">About me</h1>
        <p className="text-xl  mt-8  w-10/12">
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
      <div className="right w-4/12  ">
        <img className="rounded-3xl -ml-10" src="profile.jpeg" alt="Profile" />
      </div>
    </div>
  );
};

export default AboutPage;
