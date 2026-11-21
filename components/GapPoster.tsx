"use client"

import { useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// "The gap" as a vintage-style poster in the site palette, on the page itself: a heavy condensed title, two short
// paragraphs, a violet asterisk, and below them a violet band, a lime diagonal stripe and an ink corner (the "fan"),
// one step of how I work on each.
// Motion: the finished poster shows first, then the section pins and each band in turn grows out of its place to fill
// the poster with its step's page (violet Understand, lime Design in the browser) and folds back into the fan; the
// last, ink Ship & measure, opens and stays open, so its black page runs straight on into Kind words (ink too).
// Reduced motion: just the finished poster.
// Phones get a portrait layout (2:3); from md up it is landscape, one screen tall at most. Every piece is placed in %
// of the section and sized in cqw, so the composition scales as one piece. (The rolling-cubes version of this section
// is kept in components/archive/GapRoll.tsx.)

const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase"
const STEPS = [
  { n: "01", k: "Understand", line: "One honest conversation first: the goal, the people it's for, and the constraint that matters.", tags: ["Goals", "Users", "Constraints"] },
  { n: "02", k: "Design in the browser", line: "Design and build together, with real data and real motion, so nothing gets lost in a handoff.", tags: ["Layout", "Motion", "Real data"] },
  { n: "03", k: "Ship & measure", line: "Launch, then watch it work: search, speed and analytics, and the next change they point to.", tags: ["SEO", "Performance", "Analytics"] },
]
// each layer's finished shape (its CSS clip-path) and colours; the animation reads the shape back from the CSS
const LAYERS = [
  { cls: "inset-0 bg-violet text-cream [clip-path:polygon(0%_70%,100%_70%,100%_100%,0%_100%)] md:[clip-path:polygon(0%_68%,100%_68%,100%_100%,0%_100%)]", title: "" },
  { cls: "inset-0 bg-lime text-ink [clip-path:polygon(0%_95%,100%_76%,100%_86%,0%_105%)] md:[clip-path:polygon(0%_102%,100%_72%,100%_84%,0%_114%)]", title: "" },
  { cls: "inset-x-0 top-0 -bottom-px bg-ink text-cream [clip-path:polygon(0%_104%,100%_85%,100%_100%,0%_100%)] md:[clip-path:polygon(0%_113%,100%_83%,100%_100%,0%_100%)]", title: "text-lime" },
]

export default function GapPoster() {
  const root = useRef<HTMLElement>(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()
    // re-run on crossing md, so the finished shapes are read for the layout in use
    mm.add({ motion: "(prefers-reduced-motion: no-preference)", md: "(min-width: 768px)" }, (ctx) => {
      if (!ctx.conditions?.motion) return
      const q = gsap.utils.selector(root)
      const layers = q("[data-layer]"), contents = q("[data-content]"), labels = q("[data-step-label]"), mark = q("[data-mark]")
      const finals = layers.map((el) => getComputedStyle(el).clipPath)
      const FULL = "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)"

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: root.current, start: "bottom bottom", end: "+=300%", pin: true, scrub: 0.5 },
      })
      // where the poster is shorter than the screen (phones, tablets) the space above it while pinned is the pin
      // spacer: make it ink, continuing the dark section before, and let the nav sit straight on it
      const spacer = tl.scrollTrigger?.pin?.parentElement
      if (spacer) { spacer.style.background = "#24201F"; spacer.dataset.navBare = "" }

      tl.to({}, { duration: 0.4 }) // the finished poster first
      layers.forEach((layer, i) => {
        // this band grows out of its place to fill the poster with its step's page...
        tl.set(layer, { zIndex: 5 })
          .to(labels, { opacity: 0, duration: 0.2 })
          .to(layer, { clipPath: FULL, duration: 1, ease: "power2.inOut" }, "<")
          .to(contents[i], { opacity: 1, duration: 0.3 }, "-=0.3")
          .to({}, { duration: 0.6 })
        if (i === layers.length - 1) return // ...the last (ink) stays open and runs on into Kind words
        // ...then folds back into the fan
        tl.to(contents[i], { opacity: 0, duration: 0.25 })
          .to(layer, { clipPath: finals[i], duration: 1, ease: "power2.inOut" }, "<0.1")
          .to(labels, { opacity: 1, duration: 0.2 }, "-=0.2")
          .set(layer, { zIndex: 0 })
          .to({}, { duration: 0.3 })
      })
      tl.to(mark, { rotate: 360, duration: tl.duration() }, 0) // the asterisk turns through the whole sequence
    })
  }, { scope: root })

  const label = "font-mono uppercase tracking-[0.14em] text-[max(0.6875rem,2cqw)] md:text-[max(0.6875rem,0.8cqw)]"
  return (
    // the section itself is the poster: the page's own background, full width, the bands running edge to edge
    <section ref={root} aria-labelledby="gap-title" className="@container relative w-full overflow-hidden bg-cream text-ink aspect-[2/3] md:aspect-auto md:h-[min(100svh,62.5vw)]">

      {/* the poster's top half, under the layers so each step's page covers it */}
      <svg data-mark aria-hidden viewBox="-50 -50 100 100" className="absolute left-[58%] top-[40%] w-[28cqw] md:left-[58%] md:top-[18%] md:w-[16cqw]">
        {[0, 45, 90, 135].map((a) => <rect key={a} x={-9} y={-50} width={18} height={100} rx={9} fill="#7C4DFF" transform={`rotate(${a})`} />)}
      </svg>
      <h2 id="gap-title" className={`absolute left-[6%] top-[3%] md:left-[4%] md:top-[5%] ${POSTER} leading-[0.82] text-[16cqw] md:text-[8cqw] text-[#2E2A28]`}>
        The gap
      </h2>
      <div className="absolute left-[8%] top-[19%] w-[60%] md:left-[4.5%] md:top-[27%] md:w-[36%] flex flex-col gap-[3cqw] md:gap-[1.6cqw] font-inter font-medium leading-[1.35] text-[max(0.6875rem,2.2cqw)] md:text-[max(0.6875rem,0.88cqw)]">
        <p>Most products don&apos;t break in design or in code. They break in the handoff between them, where motion, edge cases and intent quietly go missing on the way from a file to a working site.</p>
        <p className="max-md:hidden">I work on both sides of that line. One honest conversation to understand the goal, then design and build together in the browser, with real data and real motion, then ship and measure: search, speed, analytics. Nothing gets translated, nothing gets thrown over a wall, and every change stays an edit instead of a meeting.</p>
      </div>
      <p aria-hidden className={`absolute right-[3%] top-[42%] md:right-[2%] md:top-[30%] [writing-mode:vertical-rl] ${label} font-bold`}>Lagos · 2026</p>

      {/* the fan: violet band, lime stripe rising to the right, ink corner under it; each also holds its step's page */}
      {LAYERS.map((l, i) => (
        <div key={i} data-layer data-nav-bare aria-hidden className={`absolute ${l.cls}`}>
          <div data-content className="absolute inset-0 opacity-0 flex flex-col justify-center gap-[3cqw] md:gap-[1.4cqw] px-[8%] md:px-[6%]">
            <span className="font-mono font-bold tracking-[0.14em] text-[max(0.75rem,3cqw)] md:text-[max(0.75rem,1cqw)]">{STEPS[i].n} / 03</span>
            <p className={`${POSTER} ${l.title} leading-[0.85] text-[15cqw] md:text-[9cqw]`}>{STEPS[i].k}</p>
            <p className="max-w-[36ch] font-inter font-medium leading-[1.35] text-[max(0.9rem,4cqw)] md:text-[max(0.9rem,1.6cqw)]">{STEPS[i].line}</p>
            <ul className="flex flex-wrap gap-2">
              {STEPS[i].tags.map((t) => (
                <li key={t} className="rounded-full border border-current px-3 py-1 font-mono uppercase tracking-widest text-[max(0.6875rem,2.4cqw)] md:text-[max(0.6875rem,0.8cqw)]">{t}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {/* the three steps, one on each part of the fan */}
      <ol className="contents">
        <li data-step-label className={`absolute left-[8%] top-[72%] md:left-[19%] md:top-[71%] text-cream ${label}`}><b>{STEPS[0].n}</b> {STEPS[0].k}</li>
        {/* tilted to the stripe's own angle: about 16deg on the 2:3 phone layout, 11deg on the landscape one */}
        <li data-step-label className={`absolute left-[20%] top-[94.5%] origin-left -rotate-[16deg] md:left-[62%] md:top-[86%] md:origin-center md:-rotate-[11deg] text-ink ${label}`}><b>{STEPS[1].n}</b> {STEPS[1].k}</li>
        <li data-step-label className={`absolute right-[5%] bottom-[3%] md:right-[4%] md:bottom-[5%] text-lime ${label}`}><b>{STEPS[2].n}</b> {STEPS[2].k}</li>
      </ol>
    </section>
  )
}
