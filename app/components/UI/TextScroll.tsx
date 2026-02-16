import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const TextScroll = () => {
    const ScreenRef = useRef<HTMLDivElement>(null);
    const centerTextRef = useRef<HTMLDivElement>(null);
    const upperTextRef = useRef<HTMLDivElement>(null);
    const lowerTextRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ScreenRef.current,
                start: "top top",
                end: "+=150%",
                pin: true,
                scrub: 1,
                anticipatePin: 1,
            }
        });

        // Center text scales UP (out) - starts small, grows large
        tl.fromTo(centerTextRef.current, 
            { 
                scale: 0.5, 
                opacity: 0
            },
            { 
                scale: 10, 
                opacity: 1,
                y:20,
                ease: "power2.inOut",
            }, 0
        );

        // Upper text scales DOWN and fades out
        tl.to(upperTextRef.current, {
            scale: 0,
            opacity: 0,
            y: -100,
            ease: "power2.inOut",
        }, 0);

        // Lower text scales DOWN and fades out
        tl.to(lowerTextRef.current, {
            scale: 0,
            opacity: 0,
            y: 100,
            ease: "power2.inOut",
        }, 0);

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div ref={ScreenRef} className="h-screen w-screen relative overflow-hidden">
            <div 
                ref={upperTextRef} 
                className="upper-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl p-6 sm:p-8 md:p-10 font-bold tracking-tighter origin-top-left"
            >
                <h1>SO I BUILT</h1>
                <h1 className="text-[#FF98A2]">DIGITAL SOLUTIONS</h1>
            </div>
            <div 
                ref={centerTextRef} 
                className="center-text text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl sm:text-6xl md:text-6xl lg:text-7xl p-6 sm:p-8 md:p-10 font-bold tracking-tighter origin-center whitespace-nowrap"
            >
                <h1>ENTER</h1>
                <h1>PORTFOLIO</h1>
            </div>
            <div 
                ref={lowerTextRef} 
                className="lower-text text-5xl sm:text-5xl md:text-7xl lg:text-8xl p-6 sm:p-8 md:p-10 font-bold tracking-tighter absolute bottom-0 right-0 origin-bottom-right text-right"
            >
                <h1>THAT ACTUALLY</h1>
                <h1>SCALE</h1>
            </div>
        </div>
    );
};

export default TextScroll;
