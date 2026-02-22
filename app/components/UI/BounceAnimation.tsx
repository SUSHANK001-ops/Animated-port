import gsap from 'gsap/all';
import  { useEffect, useRef } from 'react'
type Props = {
    tagline1: string;
    tagline2: string;
    tag1color?: string ;
    tag2color?: string ;
}
const BounceAnimation  = (props: Props) => {
    const taglineWrapperRef = useRef<HTMLDivElement>(null);
    const tagline1Ref = useRef<HTMLSpanElement>(null);
      const tagline2Ref = useRef<HTMLSpanElement>(null);

      const tag1Bg = props.tag1color ? (props.tag1color.startsWith('#') ? props.tag1color : `#${props.tag1color}`) : '#FADE2B';
      const tag2Bg = props.tag2color ? (props.tag2color.startsWith('#') ? props.tag2color : `#${props.tag2color}`) : '#fa542b';

      useEffect(()=>{
// Taglines fall from top (triggered by wrapper visibility)
    gsap.fromTo(
      tagline1Ref.current,
      { y: -120, opacity: 0, rotation: -8 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: taglineWrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    gsap.fromTo(
      tagline2Ref.current,
      { y: -120, opacity: 0, rotation: 6 },
      {
        y: 0,
        opacity: 1,
        rotation: 0,
        duration: 0.8,
        delay: 0.2,
        ease: "bounce.out",
        scrollTrigger: {
          trigger: taglineWrapperRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

      },[])
  return (
    <div ref={taglineWrapperRef} className="flex flex-row p-6 items-center justify-center w-full">
        <div className="relative flex flex-col items-start">
          <span
            ref={tagline1Ref}
            style={{ backgroundColor: tag1Bg }}
            className="text-gray-800 px-5 py-3 text-3xl md:text-4xl rounded-sm relative z-20 shadow-md opacity-0"
          >
            {props.tagline1}
          </span>
          <span
            ref={tagline2Ref}
            style={{ backgroundColor: tag2Bg }}
            className="text-gray-800 px-5 py-3 text-3xl md:text-4xl rounded-sm relative z-10 -mt-3 ml-10 md:ml-20 shadow-md opacity-0"
          >
            {props.tagline2}
          </span>
        </div>
      </div>
  )
}

export default BounceAnimation