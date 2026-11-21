"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { Draggable, InertiaPlugin, ScrollTrigger, SplitText } from "gsap/all"
import { useRef, useState } from "react"
import AboutScene from "@/components/AboutScene"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger, Draggable, InertiaPlugin)

// hobby showcase: where each cover lands when its category is hovered (centre point, % of the section) and its tilt;
// slots ring the card cluster so the covers frame it instead of covering it
const SHOWCASE_SLOTS = [
  { x: 12, y: 22, r: -6 }, { x: 88, y: 22, r: 5 }, { x: 8, y: 68, r: 4 },
  { x: 92, y: 66, r: -5 }, { x: 30, y: 88, r: 3 }, { x: 70, y: 88, r: -3 },
]

// pointer type of the latest press, so a click can tell a touch tap from a mouse click
let lastPointerType = "mouse"

const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase"

// the toolkit: one draggable tag per tool, coloured by kind
const TOOLKIT = [
  ...["React", "Next.js", "Tailwind CSS", "GSAP", "React Native", "TypeScript"].map((t) => ({ t, kind: "front" })),
  ...["Node.js", "Express", "MongoDB", "PostgreSQL", "Spring Boot"].map((t) => ({ t, kind: "back" })),
  ...["Figma", "Framer", "Git", "Vercel", "Linux", "AWS"].map((t) => ({ t, kind: "tools" })),
]
const TAG_COLOURS: Record<string, string> = { front: "bg-lime text-ink", back: "bg-violet text-cream", tools: "bg-[#FF8A3D] text-ink" }
const TAG_TILT = [-8, 5, -3, 9, -6, 2, 7, -10, 4, -2, 6, -7, 3, -5, 8, -4, 1]

// Exhibit A: the quote broken across a 10 x 13 grid, pictures of things I love (and things I made) in some cells.
// c/r: grid column/row to start at, w/h: cells spanned
type Piece = { c: number; r: number; w: number; h: number }
const EXHIBIT_TEXT: (Piece & { t: string })[] = [
  { c: 2, r: 2, w: 4, h: 2, t: "Everything around you" },
  { c: 6, r: 5, w: 4, h: 2, t: "that you call life" },
  { c: 3, r: 9, w: 4, h: 2, t: "was made by people" },
  { c: 6, r: 11, w: 4, h: 3, t: "that were no smarter than you." },
]
const EXHIBIT_PICS: (Piece & { src: string; fit?: "contain" })[] = [
  { c: 7, r: 2, w: 2, h: 3, src: "/graduation.jpeg" },
  { c: 10, r: 2, w: 1, h: 1, src: "/sticker.jpg" },
  { c: 9, r: 4, w: 2, h: 1, src: "/cases/goldenpages.jpg" },
  { c: 1, r: 4, w: 2, h: 2, src: "/naruto.jpg" },
  { c: 4, r: 5, w: 2, h: 3, src: "/frank.jpeg" },
  { c: 2, r: 6, w: 1, h: 1, src: "/earphones.png", fit: "contain" },
  { c: 1, r: 7, w: 2, h: 3, src: "/one-piece.jpg" },
  { c: 8, r: 7, w: 2, h: 2, src: "/tyler.jpeg" },
  { c: 6, r: 8, w: 1, h: 1, src: "/subject.jpg" },
  { c: 10, r: 9, w: 1, h: 1, src: "/read.png", fit: "contain" },
  { c: 7, r: 9, w: 2, h: 2, src: "/cases/truelife.jpg" },
  { c: 2, r: 11, w: 2, h: 2, src: "/stack-computer.png", fit: "contain" },
  { c: 4, r: 12, w: 2, h: 2, src: "/sonder-son.jpeg" },
  { c: 10, r: 13, w: 1, h: 1, src: "/chainsaw.jpeg" },
]
const at = (x: Piece) => ({ gridColumn: `${x.c} / span ${x.w}`, gridRow: `${x.r} / span ${x.h}` })



export default function About() {

  // expertise index: big titles; each row's own image follows the cursor on hover
  const expertise = [
    { title: "Design", img: "/expertise-design.jpg", description: "I start with the story, not the screen. Layout, type and pacing are decided before a line of code, so every element has a job." },
    { title: "Engineering", img: "/expertise-engineering.jpg", description: "Typed, tested and fast. Next.js and Node on both ends, built to load quickly and stay easy to change." },
    { title: "Motion", img: "/expertise-motion.jpg", description: "The last layer: transitions, micro-interactions and scroll moments that make a site feel alive without getting in its way." },
  ]
  const [hoverExp, setHoverExp] = useState<number | null>(null)
  // Exhibit A: a lime square snaps to the grid cell under the pointer
  const moveCell = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    const col = Math.min(9, Math.floor(((e.clientX - r.left) / r.width) * 10))
    const row = Math.min(12, Math.floor(((e.clientY - r.top) / r.height) * 13))
    const cell = cellRef.current!
    cell.style.left = `${col * 10}%`
    cell.style.top = `${(row * 100) / 13}%`
    cell.style.opacity = "1"
  }

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

  const expertiseRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const toolboxRef = useRef<HTMLElement>(null)
  const exhibitRef = useRef<HTMLDivElement>(null)
  const cellRef = useRef<HTMLSpanElement>(null)
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

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Exhibit A: the pictures pop into their cells in a scattered order
    if (!reduce) {
      gsap.from(".exhibit-pic", {
        scale: 0.4, opacity: 0, duration: 0.7, ease: "back.out(1.8)", stagger: { each: 0.07, from: "random" },
        scrollTrigger: { trigger: exhibitRef.current, start: "top 70%" },
      })
      gsap.from(".exhibit-line", {
        yPercent: 40, opacity: 0, duration: 0.8, ease: "power3.out", stagger: 0.25,
        scrollTrigger: { trigger: exhibitRef.current, start: "top 65%" },
      })
      // the lime loop round STUCK draws itself
      gsap.fromTo(".lost-loop", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut", delay: 0.25, scrollTrigger: { trigger: footerRef.current, start: "top 85%" } })
    }

    // Toolkit: the tags drop into the box when it scrolls in; then each can be dragged and thrown around inside it
    const tags = gsap.utils.toArray<HTMLElement>(".tool-tag")
    if (!reduce) {
      gsap.from(tags, {
        y: () => -(toolboxRef.current!.offsetHeight + 200), opacity: 0, duration: 1.2, ease: "bounce.out", stagger: 0.04,
        scrollTrigger: { trigger: toolboxRef.current, start: "top 70%" },
      })
    }
    let top = 1
    // shortcut: tags pass through each other (no collision physics); add a physics lib if they need to stack
    Draggable.create(tags, {
      bounds: toolboxRef.current,
      inertia: true,
      edgeResistance: 0.8,
      onPress() { gsap.to(this.target, { scale: 1.12, rotate: 0, zIndex: ++top, duration: 0.2 }) },
      onRelease() { gsap.to(this.target, { scale: 1, duration: 0.3 }) },
    })

    // Expertise: index rows rise in one after another
    gsap.from(".exp-row", {
      opacity: 0, y: 40, duration: 0.9, ease: "power3.out", stagger: 0.15,
      scrollTrigger: { trigger: expertiseRef.current, start: "top 75%" },
    });

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
      scrollTrigger: { trigger: footerRef.current, start: "top 88%" },
    });
    ftl.to(treeMaskRef.current, {
      scaleY: 0,
      duration: 0.8,
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

      // Footer text: starts with the tree (not after it), quick staggers
      const pf = new SplitText(".footer p", { type: "chars" });
      ftl.from(pf.chars, {
        opacity: 0,
        y: 10,
        duration: 0.35,
        ease: "power3.out",
        stagger: 0.01,
      }, 0);
      ftl.from(".footer .tag-word", {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: "power3.out",
        stagger: 0.05,
      }, 0.1);

    });
    return () => mm.revert();

  }, { scope: aboutRef });

  return (
    <main
      className="min-h-screen bg-cream text-ink px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-between gap-20"
      ref={aboutRef}
    >

      {/* Hello: the opener as an architectural poster (components/AboutScene.tsx) */}
      <AboutScene />



      {/* Exhibit A: Steve Jobs's line laid across a grid, with pictures of things I love in some of the cells */}
      <section aria-labelledby="exhibit-title" className="py-16 md:py-24">
        <p id="exhibit-title" className="font-mono text-xs uppercase tracking-widest"><span className="text-[#FF8A3D]">/</span> Lore</p>
        <div
          ref={exhibitRef}
          onPointerMove={moveCell}
          onPointerLeave={() => { if (cellRef.current) cellRef.current.style.opacity = "0" }}
          className="@container relative mt-8 mx-auto w-full max-w-[72rem] aspect-[10/13] min-h-0 grid grid-cols-10 grid-rows-13 border-r border-b border-ink/20 bg-[linear-gradient(to_right,rgba(36,32,31,.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(36,32,31,.2)_1px,transparent_1px)] bg-size-[10%_7.6923%]"
        >
          <span ref={cellRef} aria-hidden className="pointer-events-none absolute w-[10%] h-[7.6923%] bg-lime opacity-0 transition-[left,top,opacity] duration-200 ease-out" />
          {EXHIBIT_PICS.map((pic) => (
            <img key={pic.src} src={pic.src} alt="" className={`exhibit-pic relative size-full min-h-0 min-w-0 ${pic.fit === "contain" ? "object-contain p-[8%]" : "object-cover"}`} style={at(pic)} />
          ))}
          <blockquote className="contents">
            {EXHIBIT_TEXT.map((line) => (
              <p key={line.t} className="exhibit-line relative self-center px-[0.6cqw] font-display font-semibold uppercase tracking-tight leading-[0.95] text-[4.6cqw]" style={at(line)}>{line.t}</p>
            ))}
          </blockquote>
          <p className="relative self-center col-start-2 col-span-3 row-start-13 font-mono uppercase tracking-widest text-[1.5cqw]">— Steve Jobs</p>
        </div>
      </section>

      {/* Expertise — big type index. Desktop (mouse/pen): hovering a row nudges it, dims the others, reveals its
          description and a desk-photo crop that trails the cursor. Touch: descriptions are always shown. */}
      <section ref={expertiseRef} className="flex flex-col gap-8 py-16 md:py-24 -mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 px-4 sm:px-6 md:px-8 lg:px-12 bg-ink text-cream" onPointerMove={moveExpCursor}>
        <p className="font-mono text-2xs uppercase tracking-widest text-lime">(Expertise)</p>
        <ul className="border-t border-cream/20" onPointerLeave={() => { setHoverExp(null); setExpPointer(false) }}>
          {expertise.map((item, i) => (
            <li
              key={item.title}
              tabIndex={0}
              onPointerEnter={(e) => { if (e.pointerType !== "touch") { setHoverExp(i); setExpPointer(true) } }}
              // keyboard focus only: a tap also focuses the row, and shouldn't dim the others on phones
              onFocus={(e) => e.currentTarget.matches(":focus-visible") && setHoverExp(i)}
              onBlur={() => setHoverExp(null)}
              className="exp-row group grid grid-cols-[2.5rem_1fr] md:grid-cols-[3rem_1fr_minmax(0,22rem)] gap-x-4 gap-y-3 items-baseline py-6 md:py-8 border-b border-cream/20 outline-none"
            >
              <span className="font-mono text-2xs text-lime">{String(i + 1).padStart(2, "0")}</span>
              <h3 className={`font-light uppercase tracking-tight leading-none text-4xl sm:text-6xl lg:text-7xl transition-[translate,opacity,color] duration-500 ${hoverExp === i ? "translate-x-4 text-lime" : ""} ${hoverExp !== null && hoverExp !== i ? "opacity-30" : ""}`}>
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
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${hoverExp === i ? "opacity-100" : "opacity-0"}`}
            />
          ))}
        </div>
      </section>

      {/* Toolkit: the tags drop into the box; drag and throw them around */}
      <section ref={toolboxRef} aria-labelledby="toolkit-title" className="relative flex h-[75svh] min-h-[30rem] flex-col overflow-hidden rounded-[2rem] border-2 border-ink p-6 sm:p-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="toolkit-title" className={`${POSTER} leading-[0.85] text-[clamp(3rem,7vw,12rem)]`}>Toolkit</h2>
          <p className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-2xs uppercase tracking-widest">
            <span><span className="inline-block size-2 rounded-full bg-lime align-middle mr-1.5" />Front end</span>
            <span><span className="inline-block size-2 rounded-full bg-violet align-middle mr-1.5" />Back end</span>
            <span><span className="inline-block size-2 rounded-full bg-[#FF8A3D] align-middle mr-1.5" />Tools</span>
            <span className="hidden pointer-fine:inline opacity-60">· drag them around</span>
          </p>
        </div>
        <ul className="mt-auto flex flex-wrap-reverse content-start justify-center gap-2 sm:gap-3">
          {TOOLKIT.map((tool, i) => (
            <li key={tool.t} className={`tool-tag cursor-grab select-none rounded-full border-2 border-ink px-4 py-2 sm:px-6 sm:py-3 font-display font-bold uppercase tracking-tight text-[clamp(0.95rem,1.7vw,2.25rem)] shadow-[2px_3px_0_#24201F] active:cursor-grabbing ${TAG_COLOURS[tool.kind]}`} style={{ rotate: `${TAG_TILT[i % TAG_TILT.length]}deg` }}>
              {tool.t}
            </li>
          ))}
        </ul>
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
                <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-mono font-semibold uppercase leading-none tracking-tight text-[22vw] text-violet opacity-[0.12]">
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
          <h6 className="text-xl absolute top-1/3 tracking-[0.2em] font-semibold text-violet">Hobbies</h6>
        </article>
      </section>

      {/* About Footer */}
      <section className="min-h-[60vh] pt-24 flex flex-col justify-end items-center gap-8 footer" ref={footerRef}>
        <div>
          <p className="text-xs font-light text-center mb-3">Got something in mind?</p>
          <h4 className={`${POSTER} text-center leading-[0.85] text-[clamp(3.5rem,11vw,20rem)]`}>
            <a href="/contact" className="transition-colors hover:text-violet">
              <span className="tag-word inline-block">Call</span> <span className="tag-word inline-block">me</span> <span className="tag-word inline-block">if</span><br />
              <span className="tag-word inline-block">you&apos;re</span>{" "}
              <span className="tag-word relative inline-block">
                <svg aria-hidden viewBox="0 0 200 100" preserveAspectRatio="none" className="absolute -left-[14%] -top-[22%] w-[128%] h-[144%] overflow-visible">
                  <path className="lost-loop" d="M24 58 C 14 18, 168 4, 186 44 C 202 86, 44 100, 18 62 C 6 40, 64 16, 132 20" fill="none" stroke="#BCF975" strokeWidth="7" strokeLinecap="round" pathLength={1} strokeDasharray="1" vectorEffect="non-scaling-stroke" />
                </svg>
                <span className="relative">stuck.</span>
              </span>
            </a>
          </h4>
        </div>
        <div className="relative">
          <div
            ref={treeMaskRef}
            className="absolute z-10 inset-0 bg-primary"
            style={{ transformOrigin: "right center" }}
          />
          <img src="/about/reader.png" alt="A pen sketch of Temi reading in a folding chair" className="block w-[30rem] max-md:w-[18rem] h-auto" />

        </div>
      </section>

    </main>
  )
}