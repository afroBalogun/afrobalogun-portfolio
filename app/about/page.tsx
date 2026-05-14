"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { useRef, useState } from "react"
import { PiPlus } from "react-icons/pi"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

export default function About() {
  const me = [
    {
      title: "What I Do",
      description: "I'm a creative designer and developer creating interactive websites with a minimalistic approach that leave a lasting impression."
    },
    {
      title: "My Origin",
      description: "Creativity has always been part of who I am along with a deep curiosity about how things work. Finding web development gave me a path to channel both, while learning how real-world applications are designed and built."
    },
    {
      title: "My Approach",
      description: "I believe in the power of simplicity and intentionality. I strive to create work that is not only visually appealing but also purposeful and meaningful, with a focus on user experience and storytelling."
    }
  ]

  const expertise = [
    {
      title: "Creative Strategy & Design",
      description: "Before a single line of code is written, I explore the visual narrative. I design interfaces that are not just 'minimal' but intentional, ensuring every element has a reason to exist."
    },
    {
      title: "Technical Architecture",
      description: "I leverage a modern stack to build digital environments that are high-performance, scalable, and structurally robust."
    },
    {
      title: "Interactive Experiences",
      description: "This is where the art meets the engine. I focus on the micro-interactions and subtle details that leave a lasting impression on the user."
    }
  ]

  const [hoveredHobby, setHoveredHobby] = useState<string | null>(null)
  const [activeStackCol, setActiveStackCol] = useState<number | null>(null)

  const stackCollages = [
    {
      images: [
        { src: "/logos/react.png", x: 8, y: 12, w: 80, rotate: -3, delay: 0 },
        { src: "/logos/nextjs.png", x: 22, y: 45, w: 70, rotate: 4, delay: 60 },
        { src: "/logos/tailwind.png", x: 62, y: 18, w: 75, rotate: -5, delay: 90 },
        { src: "/logos/gsap.png", x: 76, y: 52, w: 65, rotate: 3, delay: 130 },
        { src: "/logos/rn.png", x: 40, y: 62, w: 72, rotate: -2, delay: 50 },
      ],
      labels: ["REACT.JS", "NEXT.JS", "TAILWIND CSS", "GSAP", "REACT NATIVE", "CSS3"],
    },
    {
      images: [
        { src: "/logos/node.png", x: 10, y: 20, w: 85, rotate: -4, delay: 0 },
        { src: "/logos/express.png", x: 55, y: 10, w: 75, rotate: 3, delay: 70 },
        { src: "/logos/mongo.png", x: 30, y: 48, w: 90, rotate: -2, delay: 110 },
        { src: "/logos/postgres.png", x: 68, y: 38, w: 78, rotate: 5, delay: 80 },
        { src: "/logos/spring.png", x: 20, y: 68, w: 68, rotate: 2, delay: 150 },
      ],
      labels: ["NODE.JS", "EXPRESS.JS", "MONGODB", "POSTGRESQL", "SPRING BOOT"],
    },
    {
      images: [
        { src: "/logos/figma.png", x: 12, y: 15, w: 80, rotate: -3, delay: 0 },
        { src: "/logos/framer.png", x: 58, y: 8, w: 72, rotate: 4, delay: 60 },
        { src: "/logos/git.png", x: 32, y: 45, w: 85, rotate: -1, delay: 100 },
        { src: "/logos/vercel.png", x: 70, y: 40, w: 70, rotate: 5, delay: 80 },
        { src: "/logos/linux.png", x: 45, y: 65, w: 75, rotate: -4, delay: 140 },
      ],
      labels: ["FIGMA", "FRAMER", "GIT", "VERCEL", "LINUX", "REST APIs"],
    },
  ]

  const hobbyCollages: Record<string, {
    title: string
    images: { src: string; x: number; y: number; w: number; rotate: number; delay: number }[]
    labels: { text: string; x: number; y: number; delay: number }[]
  }> = {
    music: {
      title: "sounds",
      images: [
        { src: "/sonder-son.jpeg", x: 10, y: 18, w: 115, rotate: -4, delay: 0 },
        { src: "/frank.jpeg", x: 55, y: 6, w: 88, rotate: 3, delay: 50 },
        { src: "/graduation.jpeg", x: 28, y: 42, w: 130, rotate: -2, delay: 100 },
        { src: "/tyler.jpeg", x: 66, y: 30, w: 82, rotate: 5, delay: 70 },
        { src: "/melodic-blues.jpeg", x: 18, y: 63, w: 100, rotate: 2, delay: 140 },
      ],
      labels: [
        { text: "YAYA BEY", x: 6, y: 42, delay: 0 },
        { text: "SZA", x: 32, y: 10, delay: 60 },
        { text: "BRENT FAIYAZ", x: 57, y: 36, delay: 120 },
        { text: "FRANK OCEAN", x: 72, y: 36, delay: 80 },
        { text: "CLEO SOL", x: 82, y: 36, delay: 150 },
        { text: "KANYE WEST", x: 91, y: 36, delay: 30 },
        { text: "OBONGJAYAR", x: 48, y: 63, delay: 170 },
        { text: "ERYKAH BADU", x: 63, y: 63, delay: 130 },
        { text: "TYLER THE CREATOR", x: 77, y: 63, delay: 190 },
      ],
    },
    reading: {
      title: "pages",
      images: [
        { src: "/subject.jpg", x: 10, y: 18, w: 115, rotate: -3, delay: 0 },
        { src: "/subject2.jpg", x: 55, y: 6, w: 88, rotate: 4, delay: 50 },
        { src: "/subject3.jpg", x: 28, y: 42, w: 130, rotate: -1, delay: 100 },
        // { src: "/reading/4.jpg", x: 66, y: 30, w: 82, rotate: 6, delay: 70 },
        // { src: "/reading/5.jpg", x: 18, y: 63, w: 100, rotate: 2, delay: 140 },
        // { src: "/reading/6.jpg", x: 48, y: 58, w: 78, rotate: -4, delay: 180 },
        // { src: "/reading/7.jpg", x: 74, y: 55, w: 95, rotate: 1, delay: 110 },
        // { src: "/reading/8.jpg", x: 38, y: 22, w: 92, rotate: -2, delay: 160 },
      ],
      labels: [
        { text: "CHIMAMANDA", x: 32, y: 10, delay: 60 },
        { text: "MURAKAMI", x: 43, y: 36, delay: 40 },
        { text: "ACHEBE", x: 57, y: 36, delay: 120 },
        { text: "ORWELL", x: 72, y: 36, delay: 80 },
        { text: "KAFKA", x: 82, y: 36, delay: 150 },
        { text: "SOYINKA", x: 91, y: 36, delay: 30 },
        { text: "COELHO", x: 30, y: 63, delay: 200 },
      ],
    },
    anime: {
      title: "frames",
      images: [
        { src: "/naruto.jpg", x: 10, y: 18, w: 115, rotate: -4, delay: 0 },
        { src: "/saitama.jpg", x: 28, y: 42, w: 130, rotate: -2, delay: 100 },
        { src: "/chainsaw.jpeg", x: 66, y: 30, w: 82, rotate: 5, delay: 70 },
        { src: "/one-piece.jpg", x: 18, y: 63, w: 100, rotate: 2, delay: 140 },
        { src: "/blue-lock.jpeg", x: 48, y: 58, w: 78, rotate: -5, delay: 180 },
        { src: "/hinata.jpeg", x: 74, y: 55, w: 95, rotate: 1, delay: 110 },
        // { src: "/anime/8.jpg", x: 38, y: 22, w: 92, rotate: -3, delay: 160 },
      ],
      labels: [
        { text: "VINLAND SAGA", x: 6, y: 42, delay: 0 },
        { text: "BERSERK", x: 32, y: 10, delay: 60 },
        { text: "BLUE LOCK", x: 20, y: 36, delay: 90 },
        { text: "FRIEREN", x: 43, y: 36, delay: 40 },
        { text: "JUJUTSU", x: 57, y: 36, delay: 120 },
        { text: "ONE-PIECE", x: 91, y: 36, delay: 30 },
        { text: "ONE PUNCH MAN", x: 30, y: 63, delay: 200 },
        { text: "NARUTO", x: 48, y: 63, delay: 170 },
        { text: "HAIKYUU", x: 63, y: 63, delay: 130 },
      ],
    },
  }

  const backgroundRef = useRef<HTMLParagraphElement>(null)
  const expertiseRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const mask1Ref = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const filmRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const stackRef = useRef<HTMLElement>(null)
  const hobbiesRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  const h1Ref = useRef<HTMLDivElement>(null)
  const h2Ref = useRef<HTMLDivElement>(null)
  const h3Ref = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const treeMaskRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia();

    // ——————————————————————————————————————————————————
    // — ALL DEVICES: Core Reveals & Layout Animations  —
    // ——————————————————————————————————————————————————

    // Mask Reveals
    gsap.to(mask1Ref.current, {
      scaleX: 0,
      duration: 1.1,
      ease: "power4.inOut",
      transformOrigin: "right center",
      scrollTrigger: { trigger: mask1Ref.current, start: "top 80%" },
    });

    gsap.from(filmRef.current, {
      x: "-100%",
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: { trigger: sectionRef.current, start: "25% 75%" },
    });

    // Stack Scroll Animation (Pinned)
    const cols = gsap.utils.toArray<HTMLElement>(".stack-col");
    gsap.set(cols, { opacity: 0.15, scale: 0.92 });

    gsap.timeline({
      scrollTrigger: {
        trigger: stackRef.current,
        start: "top top",
        end: "+=500",
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          const p = self.progress;
          if (p < 0.02) setActiveStackCol(null);
          else if (p < 0.38) setActiveStackCol(0);
          else if (p < 0.65) setActiveStackCol(1);
          else setActiveStackCol(2);
        },
        onLeaveBack: () => setActiveStackCol(null),
        onLeave: () => setActiveStackCol(null),
      },
    })
      .to(cols[0], { opacity: 1, scale: 1, duration: 0.4 })
      .to(cols[0], { opacity: 0.15, scale: 0.92, duration: 0.4 })
      .to(cols[1], { opacity: 1, scale: 1, duration: 0.4 }, "<")
      .to(cols[1], { opacity: 0.15, scale: 0.92, duration: 0.4 })
      .to(cols[2], { opacity: 1, scale: 1, duration: 0.4 }, "<");

    // Hobbies Reveal
    gsap.from(
      hobbiesRef.current!.querySelectorAll("article:not(:last-child)"),
      {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
        scrollTrigger: { trigger: hobbiesRef.current, start: "top 80%" },
      }
    );

    const stl = gsap.timeline({
      scrollTrigger: { trigger: hobbiesRef.current, start: "top 80%" },
    });
    stl.to([h1Ref.current, h2Ref.current, h3Ref.current], {
      scaleX: 0,
      duration: 1.1,
      ease: "power4.inOut",
      transformOrigin: "right center",
    });
    stl.from(".music", { opacity: 0, duration: 0.5, y: 20, ease: "power3.out" }, "<");
    stl.from(".reading", { opacity: 0, duration: 0.5, y: -20, ease: "power3.out" }, "<");
    stl.from(".anime", { opacity: 0, duration: 0.5, y: 20, ease: "power3.out" }, "<");

    // Footer Tree Mask
    const ftl = gsap.timeline({
      scrollTrigger: { trigger: footerRef.current, start: "top 80%" },
    });
    ftl.to(treeMaskRef.current, {
      scaleY: 0,
      duration: 1.5,
      ease: "power4.out",
      transformOrigin: "right top",
    });

    // ——————————————————————————————————————————————————
    // — DESKTOP ONLY: SplitText & Heavy Effects        —
    // ——————————————————————————————————————————————————
    mm.add("(min-width: 768px)", () => {

      // Background SplitText
      if (backgroundRef.current) {
        const split = new SplitText(backgroundRef.current, { type: "lines" });
        gsap.from(split.lines, {
          opacity: 0,
          y: 28,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: backgroundRef.current, start: "top 80%" },
        });
      }

      // Shape/Stack SplitText
      const shape = new SplitText(".shape", { type: "chars" });
      gsap.from(shape.chars, {
        opacity: 0,
        y: 2,
        duration: 0.1,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: backgroundRef.current, start: "bottom center" },
      });

      const stack = new SplitText(".stack", { type: "chars" });
      gsap.from(stack.chars, {
        opacity: 0,
        y: 2,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.05,
        scrollTrigger: { trigger: stackRef.current, start: "center 80%" },
      });

      // Me-Items Staggered Loop
      itemsRef.current?.querySelectorAll(".me-item").forEach((item, i) => {
        const header = item.querySelector(".me-header");
        const desc = item.querySelector(".me-desc");
        const icon = item.querySelector(".me-icon");

        gsap.from(icon, {
          rotate: -90,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(2)",
          scrollTrigger: { trigger: item, start: "top 82%" },
          delay: i * 0.08,
        });
        gsap.from(header, {
          opacity: 0,
          x: 24,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 82%" },
          delay: i * 0.08,
        });
        if (desc) {
          const split = new SplitText(desc, { type: "words" });
          gsap.from(split.words, {
            opacity: 0,
            y: 10,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.025,
            scrollTrigger: { trigger: item, start: "top 80%" },
            delay: 0.2 + i * 0.08,
          });
        }
      });

      // About Character Scatter
      const aboutDirs = [
        { x: -60, y: -40 }, { x: 0, y: -80 }, { x: 60, y: -40 },
        { x: 80, y: 0 }, { x: 40, y: 60 },
      ];
      const about = new SplitText(".about", { type: "chars" });
      gsap.from(about.chars, {
        opacity: 0,
        x: (i: number) => aboutDirs[i % aboutDirs.length].x,
        y: (i: number) => aboutDirs[i % aboutDirs.length].y,
        rotate: (i: number) => (i % 2 === 0 ? -18 : 18),
        duration: 1,
        ease: "back.out(1.4)",
        stagger: 0.08,
        scrollTrigger: { trigger: ".about", start: "top 85%" },
      });

      // Expertise Parallax & ClipPath
      const article = expertiseRef.current!.querySelector("article");
      gsap.from(article, {
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.4,
        ease: "power4.inOut",
        scrollTrigger: { trigger: expertiseRef.current, start: "top 80%" },
      });
      gsap.to(article, {
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: article,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Card Blur & Reveal
      cardsRef.current?.querySelectorAll(".card").forEach((card, i) => {
        const title = card.querySelector("h6");
        const desc = card.querySelector("p");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: card, start: "top 85%" },
          delay: i * 0.15,
        });
        tl.from(title, { opacity: 0, y: 16, duration: 0.6, ease: "power3.out" });
        if (desc) {
          const split = new SplitText(desc, { type: "words" });
          tl.from(split.words, {
            opacity: 0,
            y: 8,
            filter: "blur(4px)",
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.02,
          }, "-=0.1");
        }
      });

      // Name SplitText
      const ttl = gsap.timeline({
        scrollTrigger: { trigger: ".name", start: "top 80%" },
      });
      ttl.from(".name h4", { opacity: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 });
      const name = new SplitText(".name h6", { type: "chars" });
      ttl.from(name.chars, { opacity: 0, y: 2, duration: 0.5, ease: "power3.out", stagger: 0.05 });

      // Footer Text SplitText (Appended to the ftl timeline initialized above)
      const pf = new SplitText(".footer p", { type: "chars" });
      const h4f = new SplitText(".footer h4", { type: "words" });
      ftl.from(pf.chars, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.02,
      });
      ftl.from(h4f.words, {
        opacity: 0,
        y: 10,
        duration: 0.5,
        ease: "power3.out",
        stagger: 0.3,
        delay: 0.3,
      }, "-=0.3");

    });
    return () => mm.revert();

  }, { scope: aboutRef });

  return (
    <main
      className="min-h-screen pt-8 sm:pt-12 md:pt-15 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-between gap-20"
      ref={aboutRef}
    >

      {/* Background */}
      <section className="relative h-[80vh] flex flex-col md:flex-row justify-between">
        <div className="flex flex-col justify-between pt-50 font-light">
          <p className="text-xs">(Background)</p>
          <p
            ref={backgroundRef}
            className="md:absolute max-w-100 text-xl md:text-2xl lg:text-3xl font-light leading-snug mt-20 md:ml-20 lg:ml-40 max-md:mb-5 z-30 text-white mix-blend-difference"
          >
            With over 3 years in the creative and development space, I specialize in building interactive web experiences that blend design, motion, and purposeful simplicity into work that feels both engaging and intentional.
          </p>
        </div>
        <div className="flex flex-col justify-around items-end gap-20">
          <article
            className="h-60 md:h-125 w-60 md:w-125 relative flex justify-center py-10 bg-cover bg-center grayscale"
            style={{ backgroundImage: "url('/steve.jpg')" }}
          >
            <div
              ref={mask1Ref}
              className="absolute z-10 inset-0 bg-white dark:bg-black"
              style={{ transformOrigin: "right center" }}
            />
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-end p-6">
              <p className="text-[10px] sm:text-xs font-extralight uppercase md:w-65 max-md:w-56 text-[#C1C1C1]">
                "Design is not just what it looks like and feels like. Design is how it works."<br />
                <span className="font-semibold">— Steve Jobs</span>
              </p>
            </div>
          </article>
          <p className="font-light w-25 md:w-30 text-[10px] md:text-sm mr-20 shape">
            shaping ideas into refined, immersive digital experiences.
          </p>
        </div>
      </section>

      {/* Me */}
      <section className="min-h-screen flex max-md:flex-col-reverse gap-10 justify-end items-center max-md:mt-40" ref={sectionRef}>
        <article
          className="h-30 min-w-75 w-full md:w-[40vw] relative md:absolute left-0 bg-cover bg-center"
          ref={filmRef}
          style={{ backgroundImage: "url('/lib.jpg')" }}
        />

        <div ref={itemsRef} className="flex flex-col justify-between items-center gap-20 z-20">
          {me.map((item, index) => (
            <div key={index} className="me-item flex flex-col gap-3">
              <div className="me-header flex gap-5">
                <span className="me-icon mt-0.5"><PiPlus /></span>
                <h6 className="text-xs font-semibold uppercase mb-2">{item.title}</h6>
              </div>
              <p className="me-desc text-sm font-light max-w-100">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Expertise */}
      <section className="flex flex-col gap-20 md:gap-40" ref={expertiseRef}>
        <h6 className="font-semibold font-mono text-4xl tracking-[0.4em] mb-2 about">about</h6>

        <div className="flex max-md:flex-col-reverse items-left md:items-end justify-between gap-20">
          <article
            className="h-[60vh] w-full md:w-[50vw] md:h-screen overflow-hidden flex justify-center items-end bg-cover bg-center grayscale-60"
            style={{ backgroundImage: "url('/desk.jpg')" }}
          >
            {/* <img src="black-fro.png" alt="" /> */}
          </article>
          {/* <p className="text-xs">(Expertise)</p> */}
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-5 mb-">
            {expertise.map((item, index) => (
              <div key={index} className="card flex flex-col gap-3 mt-10">
                <h6 className="text-xs font-semibold uppercase mb-1">{item.title}</h6>
                {/* <div
                    className="expertise-line w-full h-px bg-neutral-700 mb-2"
                    style={{ transformOrigin: "left center" }}
                  /> */}
                <p className="text-xs font-light max-w-100">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stack */}
      <section className="h-screen relative flex justify-center items-center" ref={stackRef}>
        <h2 className="font-semibold font-mono text-4xl tracking-[0.4em] stack">stack</h2>

        {/* Scatter overlay — same pattern as hobbies */}
        {activeStackCol !== null && (() => {
          const col = stackCollages[activeStackCol]
          return (
            <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
              {col.images.map((img, i) => (
                <div
                  key={i}
                  className="scatter-item absolute"
                  style={{
                    left: `${img.x}%`,
                    top: `${img.y}%`,
                    width: img.w,
                    transform: `rotate(${img.rotate}deg)`,
                    animationDelay: `${img.delay}ms`,
                  }}
                >
                </div>
              ))}
              {col.labels.map((lbl, i) => (
                <span
                  key={i}
                  className="scatter-label absolute text-[10px] font-semibold tracking-[0.18em] uppercase opacity-60"
                  style={{
                    left: `${20 + (i * 13) % 60}%`,
                    top: `${30 + (i * 17) % 40}%`,
                    animationDelay: `${i * 40}ms`,
                  }}
                >
                  {lbl}
                </span>
              ))}
            </div>
          )
        })()}

        <div className="w-full absolute bottom-10 left-0 flex max-md:flex-col max-md:items-start justify-between max-md:gap-5 md:text-center">
          <article className="stack-col flex flex-col items-center gap-3">
            <p className="text-[10px] md:text-sm font-semibold uppercase w-30 md:w-60">
              Frontend
            </p>
          </article>
          <article className="stack-col flex flex-col items-center gap-3">
            <p className="text-[10px] md:text-sm font-semibold uppercase w-30 md:w-60">
              Backend
            </p>
          </article>
          <article className="stack-col flex flex-col items-center gap-3">
            <p className="text-[10px] md:text-sm font-semibold uppercase w-30 md:w-60">
              Tools
            </p>
          </article>
        </div>

        <p className="text-xs font-light opacity-20 w-60 absolute top-1/2 -right-1/14 rotate-270">
          "Good design is obvious. Great design is transparent."
          <span className="font-semibold"> — Joe Sparano</span>
        </p>
      </section>

      <div className="h-[40vh] m"></div>

      {/* Hobbies */}
      <section
        className="h-screen relative flex justify-center items-center gap-5"
        ref={hobbiesRef}
      >
        {/* Scatter overlay */}
        <style>{`
    @keyframes scatterIn {
      from { opacity: 0; transform: scale(0.82) translateY(8px); }
      to   { opacity: 1; transform: scale(1)    translateY(0px); }
    }
    .scatter-item {
      animation: scatterIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
    .scatter-label {
      animation: scatterIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  `}</style>

        {hoveredHobby && (() => {
          const collage = hobbyCollages[hoveredHobby]
          return (
            <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden">
              {/* title top-left */}
              <span
                className="scatter-item absolute top-6 left-6 text-4xl font-mono font-semibold tracking-tight opacity-90"
                style={{ animationDelay: "0ms" }}
              >
                {hoveredHobby}
              </span>



              {/* scattered images */}
              {collage.images.map((img, i) => (
                <div
                  key={i}
                  className="scatter-item absolute"
                  style={{
                    left: `${img.x}%`,
                    top: `${img.y}%`,
                    width: img.w,
                    transform: `rotate(${img.rotate}deg)`,
                    animationDelay: `${img.delay}ms`,
                  }}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-auto object-cover grayscale"
                    style={{ display: "block" }}
                  />
                </div>
              ))}

              {/* scattered text labels */}
              {collage.labels.map((lbl, i) => (
                <span
                  key={i}
                  className="scatter-label absolute text-[10px] font-semibold tracking-[0.18em] uppercase opacity-70"
                  style={{
                    left: `${lbl.x}%`,
                    top: `${lbl.y}%`,
                    animationDelay: `${lbl.delay}ms`,
                  }}
                >
                  {lbl.text}
                </span>
              ))}
            </div>
          )
        })()}

        {/* Cards */}
        <article
          className="text-center relative z-20 cursor-default"
          onMouseEnter={() => setHoveredHobby("music")}
          onMouseLeave={() => setHoveredHobby(null)}
        >
          <p className="text-xs font-medium mb-2 music">music</p>
          <div className="relative">
            <img src="earphones.png" alt="Earphones" />
            <div
              ref={h1Ref}
              className="absolute z-10 inset-0 bg-primary"
              style={{ transformOrigin: "right center" }}
            />
          </div>
        </article>

        <article
          className="text-center mt-12 z-20 cursor-default"
          onMouseEnter={() => setHoveredHobby("reading")}
          onMouseLeave={() => setHoveredHobby(null)}
        >
          <div className="relative">
            <img src="read.png" alt="Reading" />
            <div
              ref={h2Ref}
              className="absolute z-10 inset-0 bg-primary"
              style={{ transformOrigin: "right center" }}
            />
          </div>
          <p className="text-xs font-medium mt-2 reading">reading / writing</p>
        </article>

        <article
          className="text-center z-20 cursor-default"
          onMouseEnter={() => setHoveredHobby("anime")}
          onMouseLeave={() => setHoveredHobby(null)}
        >
          <p className="text-xs font-medium mb-2 anime">anime</p>
          <div className="relative">
            <div
              ref={h3Ref}
              className="absolute z-10 inset-0 bg-primary"
              style={{ transformOrigin: "right center" }}
            />
            <img src="anime.png" alt="Anime" />
          </div>
        </article>

        <article className="absolute bottom-0 right-0 font-mono text-3xl name z-20">
          <h4 className="opacity-20">Obasa</h4>
          <h4 className="opacity-20">Temiloluwa</h4>
          <h6 className="text-xl absolute top-1/3 tracking-[0.2em] font-semibold">Hobbies</h6>
        </article>
      </section>

      {/* About Footer */}
      <section className="h-[50vh] flex flex-col justify-end items-center gap-5 footer" ref={footerRef}>
        <div>
          <p className="text-xs font-light text-center mb-2">Don't hold back.</p>
          <h4 className="text-3xl md:text-4xl font-mono">Say Hi!</h4>
        </div>
        <div className="relative">
          <div
            ref={treeMaskRef}
            className="absolute z-10 inset-0 bg-primary"
            style={{ transformOrigin: "right center" }}
          />
          <img src="tree.png" alt="Tree" className="max-md:h-50" />

        </div>
      </section>

    </main>
  )
}