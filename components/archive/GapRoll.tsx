"use client"
// ARCHIVED (Nov 2026): the scroll-driven "gap" section with the three cubes that merge into a band and roll, one block
// at a time, through the three steps. Not on any page right now; to use it again, import it from
// "@/components/archive/GapRoll" and render <GapRoll />.
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// "The gap", told on scroll while the section is pinned:
//   1. three cubes stacked in the centre (lime, ink, violet)
//   2. they tumble together into one ink cube
//   3. that cube stretches into a band the width of the page (inside its margins), covering the measuring line that
//      marks the empty gap, while THE and GAP draw in toward it
//   4. the band is three blocks side by side (stacked on phones); each is a cube that rolls toward the viewer in turn
//      (rotateX with perspective, the roll from the reference) to show one step of how I work: understand, design in
//      the browser, ship & measure.
// Reduced motion: no pin and no roll; the three steps sit as three coloured blocks.

// how I close the gap: the three steps of how I work, one per block
const POINTS = [
  { k: "Understand", v: "One honest conversation about the goal, the people it's for and the constraint that matters.", tone: "bg-lime text-ink" },
  { k: "Design in the browser", v: "Design and build together, with real data and real motion, so what you approve is what ships.", tone: "bg-violet text-cream" },
  { k: "Ship & measure", v: "Launch, then watch: search, speed, analytics. Getting it to people is part of the job.", tone: "bg-ink text-cream [&_.gap-title]:text-lime" },
]
const CUBES = ["bg-lime", "bg-ink", "bg-violet"] // top to bottom; the middle one is the colour they merge into
const CUBE = "clamp(2.75rem, 5svh, 4rem)"

export default function GapRoll() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const root = ref.current!
    const stage = root.querySelector<HTMLElement>(".gap-stage")!
    const band = root.querySelector<HTMLElement>(".gap-band")!
    const cubes = gsap.utils.toArray<HTMLElement>(".gap-cube", root)
    const cells = gsap.utils.toArray<HTMLElement>(".gap-cell", root)

    // each block is a two-sided cube: its plain ink side faces you, its point sits a quarter turn round. The block is
    // set back by half its depth so the side facing you lies flat on the page at its real size (no perspective swell).
    const place = () => cells.forEach((cell) => {
      const half = cell.offsetHeight / 2
      gsap.set(cell, { z: -half })
      gsap.utils.toArray<HTMLElement>(".gap-face", cell).forEach((f, i) => gsap.set(f, { rotationX: -90 * i, z: half, transformOrigin: `50% 50% ${-half}px` }))
    })
    place()

    const cube = () => cubes[1].offsetWidth
    const tl = gsap.timeline({
      defaults: { ease: "power2.inOut" },
      scrollTrigger: { trigger: root, start: "top top", end: "+=360%", pin: true, pinSpacing: true, scrub: 0.8, invalidateOnRefresh: true, onRefresh: place },
    })
    // 1 → 2: the outer cubes tumble into the middle one
    tl.to(cubes[0], { y: () => cube() * 1.25, rotation: 180, duration: 1 }, 0)
      .to(cubes[2], { y: () => -cube() * 1.25, rotation: -180, duration: 1 }, 0)
      .to(cubes[1], { rotation: 90, duration: 1 }, 0)
      // 3: the merged cube becomes the band, which stretches from cube size to the full width
      .set(band, { autoAlpha: 1 }, 1)
      .set(cubes, { autoAlpha: 0 }, 1)
      .fromTo(band, { scaleX: () => cube() / stage.offsetWidth, scaleY: () => cube() / stage.offsetHeight }, { scaleX: 1, scaleY: 1, duration: 1.2 }, 1)
      // the gap closes: THE and GAP start pushed apart and draw in as the band stretches across
      .fromTo(".gap-the", { y: () => -innerHeight * 0.05 }, { y: 0, duration: 1.2 }, 1)
      .fromTo(".gap-gap", { y: () => innerHeight * 0.05 }, { y: 0, duration: 1.2 }, 1)
      .from(".gap-intro", { autoAlpha: 0, y: 10, duration: 0.4 }, ">-0.1")
      .to(".gap-intro", { autoAlpha: 0, duration: 0.3 }, ">0.4")
    // 4: each block rolls round to its step, one at a time (each waits for the one before to finish)
    cells.forEach((cell, i) => tl.to(cell, { rotationX: 90, duration: 1 }, i === 0 ? "<" : ">+0.15"))
    tl.to({}, { duration: 0.5 }) // a beat on the finished band before the pin releases
  }, { scope: ref })

  return (
    <section ref={ref} aria-labelledby="gap-title" className="relative overflow-hidden bg-cream text-ink">
      <h2 id="gap-title" className="sr-only">The gap</h2>
      {/* poster layout: a huge grotesque THE tucked behind the band (the band covers its lower edge), then a huge GAP at the
          bottom left with a small justified caption beside it */}
      <div className="flex min-h-svh flex-col justify-center px-4 sm:px-6 lg:px-12 pt-20 md:pt-28 pb-8 md:pb-10">
        <p aria-hidden className="gap-the relative z-0 -mb-[0.2em] font-inter font-semibold uppercase tracking-[-0.05em] leading-[0.78] text-right text-[min(24vw,29svh)] md:text-[min(30vw,29svh)]">The</p>

        {/* the animated stage (hidden for reduced motion); it is exactly the page's content width */}
        {/* clipped at the sides so a rolling block never pokes past the page margins (it may still swell up and down) */}
        <div className="gap-stage relative z-10 overflow-x-clip h-[min(54svh,28rem)] md:h-[clamp(13rem,30svh,22rem)] motion-reduce:hidden">
          {/* a measuring line across the empty space: the gap itself. The band covers it as it stretches across. */}
          <div aria-hidden className="absolute inset-x-0 top-1/2 flex items-center gap-3 -translate-y-1/2 text-ink/60">
            <span className="h-4 w-px bg-current" />
            <span className="h-px flex-1 bg-current" />
            <span className="font-mono text-2xs uppercase tracking-widest">the gap</span>
            <span className="h-px flex-1 bg-current" />
            <span className="h-4 w-px bg-current" />
          </div>
          {CUBES.map((tone, i) => (
            <span key={i} aria-hidden className={`gap-cube absolute left-1/2 top-1/2 -translate-x-1/2 ${tone}`}
              style={{ width: CUBE, height: CUBE, marginTop: `calc(${(i - 1) * 1.25} * ${CUBE} - ${CUBE} / 2)` }} />
          ))}
          <div className="gap-band invisible absolute inset-0 grid grid-rows-3 md:grid-rows-1 md:grid-cols-3">
            {POINTS.map((p, i) => (
              <div key={p.k} className="relative [perspective:2400px]">
                <div className="gap-cell absolute inset-0 [transform-style:preserve-3d]">
                  {/* side 0: plain ink, so the three blocks read as one band before they roll */}
                  <div aria-hidden className="gap-face absolute inset-0 bg-ink [backface-visibility:hidden]" />
                  {/* side 1: the step */}
                  <div className={`gap-face absolute inset-0 flex flex-col justify-end gap-1 md:gap-2 overflow-hidden p-4 md:p-8 [backface-visibility:hidden] ${p.tone}`}>
                    <span className="font-mono text-xs opacity-70">{String(i + 1).padStart(2, "0")}</span>
                    <span className="gap-title font-inter font-semibold uppercase tracking-[-0.04em] leading-[0.92] text-[1.3rem] md:text-[clamp(1.6rem,2.4vw,3.25rem)]">{p.k}</span>
                    <span className="text-[0.8rem] leading-snug md:text-sm md:leading-relaxed max-w-sm">{p.v}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* a label across the ink band before the blocks roll */}
            <p className="gap-intro pointer-events-none absolute inset-0 grid place-items-center text-center text-cream font-inter font-semibold uppercase tracking-[-0.04em] text-[clamp(1.6rem,3vw,3.75rem)] leading-none">How I close the gap</p>
          </div>
        </div>

        {/* reduced motion: the three steps as three coloured blocks */}
        <ul className="relative z-10 hidden motion-reduce:grid grid-cols-1 md:grid-cols-3">
          {POINTS.map((p, i) => (
            <li key={p.k} className={`flex flex-col gap-2 p-6 md:p-10 ${p.tone}`}>
              <span className="font-mono text-xs opacity-70">{String(i + 1).padStart(2, "0")}</span>
              <span className="gap-title font-inter font-semibold uppercase tracking-[-0.04em] text-2xl md:text-3xl leading-none">{p.k}</span>
              <span className="text-sm leading-relaxed">{p.v}</span>
            </li>
          ))}
        </ul>

        {/* phones: the caption sits above GAP, so GAP can drop to the bottom without covering it */}
        <div className="mt-4 md:mt-8 flex flex-col-reverse md:flex-row md:items-end md:justify-between gap-4 md:gap-10">
          <p aria-hidden className="gap-gap font-inter font-semibold uppercase tracking-[-0.05em] leading-[0.78] text-violet text-[min(24vw,29svh)] md:text-[min(30vw,29svh)]">Gap</p>
          {/* short phones (under 700px tall) leave the caption out so the whole poster fits the screen while it is pinned */}
          <p className="w-full max-w-[30rem] md:pb-[0.4em] max-md:[@media(max-height:700px)]:hidden font-inter font-medium uppercase text-justify text-[0.6875rem] md:text-xs leading-[1.35] tracking-[0.02em] [hyphens:auto]">
            Most products don&apos;t break in design or in code. They break in the <span className="bg-lime px-0.5">handoff</span> between them, where
            motion, edge cases and intent quietly go missing. I work on both sides of it, so nothing has to be translated, nothing gets
            thrown over a wall, and every change stays an edit instead of a meeting.
          </p>
        </div>
      </div>
    </section>
  )
}
