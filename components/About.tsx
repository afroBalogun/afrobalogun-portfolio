"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { useRef, useState } from "react"
import { Courier_Prime } from "next/font/google"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

// hobby showcase: where each cover lands when its category is hovered (centre point, % of the section) and its tilt;
// slots ring the card cluster so the covers frame it instead of covering it
const SHOWCASE_SLOTS = [
  { x: 12, y: 22, r: -6 }, { x: 88, y: 22, r: 5 }, { x: 8, y: 68, r: 4 },
  { x: 92, y: 66, r: -5 }, { x: 30, y: 88, r: 3 }, { x: 70, y: 88, r: -3 },
]

// pointer type of the latest press, so a click can tell a touch tap from a mouse click
let lastPointerType = "mouse"

// typewriter face for the stack section only
const courier = Courier_Prime({ weight: ["400", "700"], subsets: ["latin"] })

// ——— typewritten-document pieces for the stack section ———
// hand-drawn strokes are visible by default; the scroll animation draws them in (pathLength=1 makes the dash math 0..1)
const strokeProps = { className: "stack-stroke", fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, pathLength: 1, strokeDasharray: "1", vectorEffect: "non-scaling-stroke" as const }

function Scribble() {
  return (
    <svg aria-hidden viewBox="0 0 240 10" preserveAspectRatio="none" className="absolute left-0 -bottom-1.5 w-full h-2 overflow-visible">
      <path d="M2 6 C 40 2, 80 9, 120 5 S 200 7, 238 3" {...strokeProps} />
    </svg>
  )
}

const FRONTEND = ["React.js", "Next.js", "Tailwind CSS", "GSAP", "React Native", "CSS3"]
const BACKEND = ["Node.js", "Express.js", "MongoDB", "PostgreSQL", "Spring Boot"]
const TOOLS = ["Figma", "Framer", "Git", "Vercel", "Linux", "REST APIs", "AWS"]

// ——— poster backdrop for the stack: faint grid and a giant wordmark ———
function StackPoster() {
  return (
    <div aria-hidden className="absolute inset-0 -z-10 pointer-events-none select-none">
      {/* poster grid */}
      <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] [background-size:12.5%_16.666%]" />
      {/* giant wordmark */}
      <p className="absolute inset-x-0 bottom-[12%] text-center font-inter font-semibold uppercase leading-none tracking-tight text-[22vw] opacity-[0.05]">stack</p>
    </div>
  )
}

// redacted phrase for the background "case file": an ink-coloured background behind ink-coloured text reads as a
// black bar; GSAP shrinks the background to reveal the words. box-decoration-break gives each wrapped line its own bar.
function Redact({ children }: { children: React.ReactNode }) {
  return (
    <span className="bg-redact px-1 -mx-1 [box-decoration-break:clone] bg-no-repeat bg-left bg-[length:100%_100%] bg-[linear-gradient(var(--color-secondary),var(--color-secondary))] motion-reduce:bg-none">
      {children}
    </span>
  )
}

function NumberedHeading({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <p className="stack-line grid grid-cols-[1.5rem_1fr] sm:grid-cols-[3rem_1fr] mt-10 font-bold">
      <span>{n}</span>
      <span>{children}</span>
    </p>
  )
}

function ToolList({ tools, bracket }: { tools: string[]; bracket?: boolean }) {
  return (
    <div className="relative mt-3 px-10 sm:pl-24 sm:pr-16">
      {bracket && (
        <svg aria-hidden viewBox="0 0 8 100" preserveAspectRatio="none" className="absolute left-5 sm:left-16 top-0 w-2 h-full overflow-visible">
          <path d="M6 2 C 2 25, 7 55, 3 98" {...strokeProps} />
        </svg>
      )}
      <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
        {tools.map((tool) => <li key={tool} className="stack-line">{tool}</li>)}
      </ul>
    </div>
  )
}



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

  // expertise index: big titles; each row's own image follows the cursor on hover
  const expertise = [
    { title: "Design", img: "/expertise-design.jpg", description: "I start with the story, not the screen. Layout, type and pacing are decided before a line of code, so every element has a job." },
    { title: "Engineering", img: "/expertise-engineering.jpg", description: "Typed, tested and fast. Next.js and Node on both ends, built to load quickly and stay easy to change." },
    { title: "Motion", img: "/expertise-motion.jpg", description: "The last layer: transitions, micro-interactions and scroll moments that make a site feel alive without getting in its way." },
  ]
  const [hoverExp, setHoverExp] = useState<number | null>(null)
  // the trailing photo belongs to a hovering mouse/pen only; keyboard focus reveals the text without it
  const [expPointer, setExpPointer] = useState(false)
  const expCursorRef = useRef<HTMLDivElement>(null)
  // the floating photo trails the pointer (mouse/pen only; it is hidden for touch)
  const moveExpCursor = (e: React.PointerEvent) => {
    gsap.to(expCursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.45, ease: "power3.out", overwrite: "auto" })
  }

  const [hoveredHobby, setHoveredHobby] = useState<string | null>(null)

  // hobby collages: hover with a mouse, tap to toggle on touch, show on keyboard focus
  const hobbyProps = (key: string) => ({
    tabIndex: 0,
    role: "button" as const,
    "aria-expanded": hoveredHobby === key,
    onPointerDown: (e: React.PointerEvent) => { lastPointerType = e.pointerType },
    onPointerEnter: (e: React.PointerEvent) => { if (e.pointerType === "mouse") setHoveredHobby(key) },
    onPointerLeave: (e: React.PointerEvent) => { if (e.pointerType === "mouse") setHoveredHobby(null) },
    onClick: () => { if (lastPointerType !== "mouse") setHoveredHobby((h) => (h === key ? null : key)) },
    // a tap also focuses the card; only keyboard focus (:focus-visible) should open it, or the tap would toggle it shut
    onFocus: (e: React.FocusEvent<HTMLElement>) => { if (e.currentTarget.matches(":focus-visible")) setHoveredHobby(key) },
    onBlur: () => setHoveredHobby(null),
  })

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
        { text: "TYLER, THE CREATOR", x: 77, y: 63, delay: 190 },
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
        { text: "ADICHIE", x: 32, y: 10, delay: 60 },
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
        { text: "JUJUTSU KAISEN", x: 57, y: 36, delay: 120 },
        { text: "ONE PIECE", x: 91, y: 36, delay: 30 },
        { text: "ONE PUNCH MAN", x: 30, y: 63, delay: 200 },
        { text: "NARUTO", x: 48, y: 63, delay: 170 },
        { text: "HAIKYUU", x: 63, y: 63, delay: 130 },
      ],
    },
  }

  const backgroundRef = useRef<HTMLParagraphElement>(null)
  const expertiseRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLElement>(null)
  const hobbiesRef = useRef<HTMLElement>(null)
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

    // Background case file: redaction bars peel off one by one, the exhibit photo is taped in
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.to(".bg-redact", {
        backgroundSize: "0% 100%", duration: 0.6, ease: "power2.inOut", stagger: 0.35, delay: 0.6,
        scrollTrigger: { trigger: backgroundRef.current, start: "top 85%" },
      });
    }
    gsap.from(".bg-photo", {
      opacity: 0, y: 30, rotate: -6, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: ".bg-photo", start: "top 90%" },
    });

    // Expertise: index rows rise in one after another
    gsap.from(".exp-row", {
      opacity: 0, y: 40, duration: 0.9, ease: "power3.out", stagger: 0.15,
      scrollTrigger: { trigger: expertiseRef.current, start: "top 75%" },
    });

    // the journal blocks under the statement fade up one after another
    gsap.from(sectionRef.current!.querySelectorAll(".me-reveal"), {
      opacity: 0, y: 20, duration: 0.8, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
    });

    // Stack: the list types itself out as you scroll; hand-drawn strokes draw in as they arrive
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // words,chars (not chars alone): each word stays an unbreakable unit, so lines never wrap mid-word
      const script = new SplitText(".stack-line", { type: "words,chars" });
      gsap.from(script.chars, {
        opacity: 0,
        duration: 0.01,
        stagger: 0.02,
        ease: "none",
        scrollTrigger: { trigger: stackRef.current, start: "top 75%", end: "bottom 85%", scrub: true },
      });
      gsap.utils.toArray<SVGPathElement>(".stack-stroke").forEach((path) => {
        gsap.fromTo(path, { strokeDashoffset: 1 }, {
          strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut",
          scrollTrigger: { trigger: path.closest("svg"), start: "top 65%" },
        });
      });
      gsap.from(".stack-photo", {
        opacity: 0, y: 12, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: ".stack-photo", start: "top 75%" },
      });
    }

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

      {/* Background — redacted statement, a taped-in exhibit, and the journal notes (what I do / origin / approach) */}
      {/* overflow-x-clip: the tilted exhibit photo pokes ~1px past the edge on phones */}
      <section className="relative overflow-x-clip pt-28 md:pt-36 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-14 items-start">
          <p ref={backgroundRef} className="md:col-span-7 md:row-start-1 text-2xl md:text-3xl lg:text-4xl font-light leading-snug">
            For <Redact>3+ years</Redact> I&apos;ve worked between <Redact>design and code.</Redact> Building <Redact>interactive websites</Redact> where <Redact>motion has a purpose</Redact> and <Redact>nothing is there by accident</Redact>.
          </p>

          {/* journal notes: two staggered mono columns under the statement */}
          <div ref={sectionRef} className="md:col-span-7 md:row-start-2 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6 font-mono text-xs sm:text-[0.8rem] leading-relaxed">
            <div className="flex flex-col gap-5">
              <p className="me-reveal"><span className="font-bold">{me[0].title}.</span> {me[0].description}</p>
              <p className="me-reveal"><span className="font-bold">{me[1].title}.</span> {me[1].description}</p>
            </div>
            <p className="me-reveal sm:mt-24"><span className="font-bold">{me[2].title}.</span> {me[2].description}</p>
          </div>

          <figure className="md:col-start-9 md:col-span-4 md:row-start-1 md:row-span-2 max-md:w-3/4 max-md:self-end max-md:ml-auto">
            <div className="bg-photo relative rotate-2 shadow-[0_1rem_2rem_-1rem_rgb(0_0_0/0.35)]">
              <img src="/steve.jpg" alt="Steve Jobs poster: Let's go invent tomorrow instead of worrying about what happened yesterday" className="w-full aspect-4/5 object-cover grayscale" />
              {/* tape strips */}
              <span aria-hidden className="absolute -top-3 left-6 w-20 h-6 -rotate-6 bg-white/60" />
              <span aria-hidden className="absolute -top-3 right-6 w-20 h-6 rotate-3 bg-white/60" />
            </div>
            <figcaption className="mt-5 font-mono text-2xs uppercase tracking-widest leading-relaxed">
              <span className="font-bold">Exhibit A</span> — "Design is not just what it looks like and feels like. Design is how it works." — Steve Jobs
            </figcaption>
          </figure>
        </div>

      </section>


      {/* Expertise — big type index. Desktop (mouse/pen): hovering a row nudges it, dims the others, reveals its
          description and a desk-photo crop that trails the cursor. Touch: descriptions are always shown. */}
      <section ref={expertiseRef} className="flex flex-col gap-8 py-16" onPointerMove={moveExpCursor}>
        <p className="font-mono text-2xs uppercase tracking-widest">(Expertise)</p>
        <ul className="border-t border-secondary/20" onPointerLeave={() => { setHoverExp(null); setExpPointer(false) }}>
          {expertise.map((item, i) => (
            <li
              key={item.title}
              tabIndex={0}
              onPointerEnter={(e) => { if (e.pointerType !== "touch") { setHoverExp(i); setExpPointer(true) } }}
              // keyboard focus only: a tap also focuses the row, and shouldn't dim the others on phones
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && setHoverExp(i)}
              onBlur={() => setHoverExp(null)}
              className="exp-row group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3rem_1fr_minmax(0,22rem)] gap-x-4 gap-y-3 items-baseline py-6 md:py-8 border-b border-secondary/20 outline-none"
            >
              <span className="font-mono text-2xs opacity-50">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`font-light uppercase tracking-tight leading-none text-4xl sm:text-6xl lg:text-7xl transition-[translate,opacity] duration-500 ${hoverExp === i ? "translate-x-4" : ""} ${hoverExp !== null && hoverExp !== i ? "opacity-30" : ""}`}>
                {item.title}
              </h3>
              <p className={`col-start-2 md:col-start-3 font-mono text-xs sm:text-[0.8rem] leading-relaxed transition-opacity duration-500 pointer-fine:md:opacity-0 ${hoverExp === i ? "pointer-fine:md:opacity-100" : ""}`}>
                {item.description}
              </p>
            </li>
          ))}
        </ul>

        {/* trailing photo: one crop per row, cross-faded; positioned by GSAP, centred on the pointer */}
        <div
          ref={expCursorRef}
          aria-hidden
          className={`exp-photo hidden pointer-fine:block fixed top-0 left-0 z-30 -ml-28 -mt-36 w-56 aspect-4/5 overflow-hidden pointer-events-none transition-[scale,opacity] duration-300 ${hoverExp !== null && expPointer ? "scale-100 opacity-100" : "scale-50 opacity-0"}`}
        >
          {expertise.map((item, i) => (
            <img
              key={item.title}
              src={item.img}
              alt=""
              className={`absolute inset-0 w-full h-full object-cover grayscale transition-opacity duration-300 ${hoverExp === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </section>

      {/* Stack — typewritten document layout: numbered headings in both margins, indented lists, hand-drawn marks */}
      <section ref={stackRef} className={`${courier.className} relative isolate overflow-hidden pt-24 md:pt-32 pb-12`}>
        <StackPoster />
        <div className="relative isolate mx-auto max-w-152 text-[0.78rem] sm:text-sm leading-relaxed">
          <p className="stack-line text-center">
            <span className="relative inline-block font-bold">STACK<Scribble /></span>
          </p>
          <p className="stack-line text-center mt-1">(what I build with)</p>

          <NumberedHeading n={1}>FRONTEND</NumberedHeading>
          <ToolList tools={FRONTEND} />

          <NumberedHeading n={2}>BACKEND</NumberedHeading>
          <ToolList tools={BACKEND} bracket />

          <NumberedHeading n={3}>TOOLS</NumberedHeading>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-start">
            <div className="flex-1"><ToolList tools={TOOLS} /></div>
            {/* pixel art: pixelated scaling keeps its hard edges; no grayscale so the green power light shows */}
            <img src="/stack-computer.png" alt="Pixel-art desktop computer" className="stack-photo w-40 sm:w-44 aspect-4/3 object-cover [image-rendering:pixelated] self-end sm:self-start mt-3 mr-6 sm:mr-0" />
          </div>
        </div>
      </section>

      {/* Hobbies */}
      <section
        className="h-[60vh] relative overflow-hidden flex justify-center items-center gap-5"
        ref={hobbiesRef}
      >
        {/* Showcase: on the light page, the hovered category's covers burst out from the centre into
            full colour around the cards, and its collage name sits huge behind. Always mounted so it can animate out too. */}
        <div aria-hidden className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${hoveredHobby ? "opacity-100" : "opacity-0"}`}>
          {(["music", "reading", "anime"] as const).map((key) => {
            const c = hobbyCollages[key]
            const on = hoveredHobby === key
            return (
              <div key={key} className={`absolute inset-0 transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0"}`}>
                <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono font-semibold uppercase leading-none tracking-tight text-[22vw] opacity-[0.06]">
                  {c.title}
                </p>
                {c.images.map((img, i) => {
                  const slot = SHOWCASE_SLOTS[i % SHOWCASE_SLOTS.length]
                  return (
                    <img
                      key={img.src}
                      src={img.src}
                      alt=""
                      className={`absolute w-24 sm:w-40 md:w-52 -translate-x-1/2 -translate-y-1/2 shadow-2xl ${i >= 4 ? "max-md:hidden" : ""} transition-[left,top,rotate,scale,opacity] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]`}
                      style={{
                        left: on ? `${slot.x}%` : "50%",
                        top: on ? `${slot.y}%` : "50%",
                        rotate: on ? `${slot.r}deg` : "0deg",
                        scale: on ? "1" : "0.3",
                        opacity: on ? 1 : 0,
                        transitionDelay: on ? `${i * 60}ms` : "0ms",
                      }}
                    />
                  )
                })}
                <p className="absolute inset-x-6 top-[76%] mx-auto max-w-2xl text-center font-mono text-2xs uppercase tracking-[0.2em] leading-relaxed opacity-60">
                  {c.labels.map((l) => l.text).join(" · ")}
                </p>
              </div>
            )
          })}
        </div>

        {/* Cards — dimming lives on the illustrations: GSAP fades the <article>s in, and a CSS opacity transition there fights it */}
        <article
          className={`text-center relative z-20 cursor-default`}
          {...hobbyProps("music")}
        >
          <p className="text-xs font-medium mb-2 music">music</p>
          <div className="relative">
            <img src="earphones.png" alt="Earphones" className={`w-[10.1875rem] bg-primary transition-opacity duration-500 ${hoveredHobby && hoveredHobby !== "music" ? "opacity-40" : ""}`} />
            <div
              ref={h1Ref}
              className="absolute z-10 inset-0 bg-primary"
              style={{ transformOrigin: "right center" }}
            />
          </div>
        </article>

        <article
          className={`text-center relative mt-12 z-20 cursor-default`}
          {...hobbyProps("reading")}
        >
          <div className="relative">
            <img src="read.png" alt="Reading" className={`w-[10.1875rem] bg-primary transition-opacity duration-500 ${hoveredHobby && hoveredHobby !== "reading" ? "opacity-40" : ""}`} />
            <div
              ref={h2Ref}
              className="absolute z-10 inset-0 bg-primary"
              style={{ transformOrigin: "right center" }}
            />
          </div>
          <p className="text-xs font-medium mt-2 reading">reading / writing</p>
        </article>

        <article
          className={`text-center relative z-20 cursor-default`}
          {...hobbyProps("anime")}
        >
          <p className="text-xs font-medium mb-2 anime">anime</p>
          <div className="relative">
            <div
              ref={h3Ref}
              className="absolute z-10 inset-0 bg-primary"
              style={{ transformOrigin: "right center" }}
            />
            <img src="anime.png" alt="Anime" className={`w-[10.1875rem] bg-primary transition-opacity duration-500 ${hoveredHobby && hoveredHobby !== "anime" ? "opacity-40" : ""}`} />
          </div>
        </article>

        <article className={`absolute bottom-0 right-0 font-mono text-3xl name z-20 transition-opacity duration-500 ${hoveredHobby ? "opacity-0" : ""}`}>
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
          <img src="tree.png" alt="Tree" className="w-[20.125rem] max-md:w-auto max-md:h-50" />

        </div>
      </section>

    </main>
  )
}