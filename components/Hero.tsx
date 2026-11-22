"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef } from "react"
import LagosStamp from "@/components/LagosStamp"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Hero after lqve.jp (a giant word across the screen, a figure behind it that steps in front once the word is in,
// small labelled text on the letters, thin top and bottom bars), with some of the DASH reference (cream grid with a
// few outlined squares, one word on a colour block with an asterisk). The figure is the balo drawing (public/black-fro.png)
// redrawn as a vector so it stays sharp at any size.

// outlined squares on the grid (column, row), like the DASH background; each blinks on its own beat
const CELLS = [[3, 1], [4, 1], [9, 0], [12, 2], [13, 2], [13, 3], [2, 5], [6, 6], [7, 6], [16, 1], [17, 4], [18, 4], [10, 7], [15, 7], [1, 8], [19, 8], [5, 9], [14, 9]]

export default function Hero() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".fig-back", { autoAlpha: 0 })
      return
    }
    const intro = gsap.timeline({ paused: true })
      .from(".giant-letter", { yPercent: 18, opacity: 0, duration: 0.9, stagger: 0.08, ease: "power4.out" })
      // the figure is already standing behind the word; once the word is in, it steps in front of it
      // (the front copy is revealed top to bottom over the back one)
      .fromTo(".fig-front", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1, ease: "power2.inOut" }, "+=0.25")
      .set(".fig-back", { autoAlpha: 0 })
      .from(".hero-meta", { opacity: 0, y: 10, duration: 0.6, stagger: 0.08, ease: "power3.out" }, "<-0.6")
    // play as the page intro leaves ("site:landing"); with no intro on screen, play now
    // leaving the hero: the word (and the text on it) drifts down so it trails the page, while the figure lifts away
    // faster. Scrubbed to the scroll, so it reverses on the way back up.
    gsap.timeline({ defaults: { ease: "none" }, scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } })
      .to(".hero-stage", { y: () => innerHeight * 0.06 }, 0)
      .to(".fig-back, .fig-front", { y: () => -innerHeight * 0.025 }, 0)

    const play = () => intro.play()
    // the page intro sends "site:landing" as it lifts, and notes when that is (window.__introAt). On a slow load the
    // hero can mount after the signal has gone, which used to leave it hidden; so if the moment has just passed, play
    // now; if it's coming, wait for it; and whatever happens, play within the intro's full length.
    const introAt = (window as unknown as { __introAt?: number }).__introAt ?? 0
    const now = performance.now()
    let fallback: ReturnType<typeof setTimeout> | undefined
    if (!document.getElementById("loader") || (introAt <= now && now - introAt < 2000)) play()
    else {
      addEventListener("site:landing", play, { once: true })
      fallback = setTimeout(play, Math.max(0, introAt - now) + 900)
    }
    // without this, a re-run (React dev runs effects twice) leaves a listener that plays a stale, reverted timeline
    return () => { removeEventListener("site:landing", play); clearTimeout(fallback) }
  }, { scope: ref })

  // cursor spotlight on the grid: the pointer position goes into CSS variables (no re-render), and the square under
  // it snaps to the grid. The grid is 4.5rem, and rem grows on big screens, so the cell size is read live.
  const glow = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return
    const el = e.currentTarget, b = el.getBoundingClientRect(), x = e.clientX - b.left, y = e.clientY - b.top
    const cell = parseFloat(getComputedStyle(document.documentElement).fontSize) * 4.5
    el.style.setProperty("--mx", `${x}px`)
    el.style.setProperty("--my", `${y}px`)
    el.style.setProperty("--cx", `${Math.floor(x / cell) * cell}px`)
    el.style.setProperty("--cy", `${Math.floor(y / cell) * cell}px`)
    el.style.setProperty("--glow", "1")
  }

  return (
    <section ref={ref} aria-label="Introduction" onPointerMove={glow} onPointerLeave={(e) => e.currentTarget.style.setProperty("--glow", "0")}
      className="relative min-h-svh overflow-hidden bg-cream text-ink flex flex-col">
      {/* grid paper, with a few squares picked out */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(to_right,rgba(19,22,15,.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(19,22,15,.06)_1px,transparent_1px)] bg-size-[4.5rem_4.5rem]">
        {CELLS.map(([c, r], i) => (
          <span key={i} className="absolute size-[4.5rem] border border-violet/30 motion-safe:animate-cell-blink" style={{ left: `${c * 4.5}rem`, top: `${r * 4.5}rem`, animationDelay: `${(i * 0.77) % 6}s` }} />
        ))}
      </div>

      {/* the spotlight: the same grid in violet plus a soft wash, both masked to a circle round the cursor */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-(--glow,0) transition-opacity duration-500 bg-[radial-gradient(circle_16rem_at_var(--mx)_var(--my),rgba(124,77,255,.06),transparent_70%),linear-gradient(to_right,rgba(124,77,255,.35)_1px,transparent_1px),linear-gradient(to_bottom,rgba(124,77,255,.35)_1px,transparent_1px)] bg-size-[100%_100%,4.5rem_4.5rem,4.5rem_4.5rem] [mask-image:radial-gradient(circle_16rem_at_var(--mx)_var(--my),#000,transparent)]" />
      {/* the square under the cursor */}
      <span aria-hidden className="pointer-events-none absolute left-0 top-0 size-[4.5rem] border border-violet bg-violet/[0.06] opacity-(--glow,0) translate-x-(--cx) translate-y-(--cy) transition-[translate,opacity] duration-200 ease-out" />

      {/* top line */}
      <div className="hero-meta relative z-30 flex items-start justify-between gap-6 px-4 sm:px-6 lg:px-12 pt-24 md:pt-28 font-mono text-2xs sm:text-xs uppercase tracking-widest">
        <p className="text-violet w-40">Every great design begins with an even greater story.</p>
        <LagosStamp className="items-end text-right" />
      </div>

      {/* desktop: the figure stands on the bottom edge of the screen, so it runs off it (back copy behind the word);
          nudged down so its head sits low on the letter it overlaps and the word still reads */}
      <Figure className="fig-back max-md:hidden absolute z-0 left-1/2 bottom-0 h-[min(46svh,31vw)] max-h-[92%] -translate-x-[38%] translate-y-[14%]" />

      {/* the word (and, on phones, the figure tied to it) */}
      <div className="relative flex-1 grid place-items-center px-4 sm:px-6 lg:px-12 py-10">
        <div className="hero-stage relative w-full">
          {/* phones: the back copy sits exactly where the front copy lands, so the reveal reads as one figure stepping forward */}
          <Figure className="fig-back md:hidden absolute z-0 left-1/2 bottom-[-28%] h-[150%] -translate-x-[38%] translate-y-[45%] [mask-image:linear-gradient(to_bottom,#000_70%,transparent_95%)]" />

          {/* the word fills its box, sized from the box's width (cqw): full width up to tablets, a centred 70% from 1024px up
              so the hero stays calm and the side text sits mostly on the paper beside it */}
          <div className="@container relative z-10 lg:mx-auto lg:w-[70%]">
            <p aria-hidden className="flex justify-between font-display font-extrabold [font-stretch:62%] uppercase leading-[0.82] text-ink text-[18cqw] select-none">
              {"afroBalogun".split("").map((l, i) => <span key={i} className="giant-letter inline-block">{l}</span>)}
            </p>
          </div>

          <Figure className="fig-front md:hidden absolute z-20 left-1/2 bottom-[-28%] h-[150%] -translate-x-[38%] translate-y-[45%] [mask-image:linear-gradient(to_bottom,#000_70%,transparent_95%)]" />

          {/* text set on the letters, each line on its own solid label so it reads over ink and paper alike */}
          <div className="hero-meta absolute z-30 left-[3%] top-1/3 -translate-y-1/2 max-md:hidden">
            <h1 className="font-inter font-black uppercase leading-[1.25] tracking-tight text-[clamp(1rem,1.9vw,3.5rem)]">
              <span className="relative inline-block bg-lime text-ink px-[0.2em] -rotate-2">Design<sup className="absolute -right-[0.55em] -top-[0.15em] text-violet text-[0.8em]">*</sup></span>{" "}
              <span className="bg-ink text-cream px-[0.2em]">engineer</span><br />
              <span className="bg-ink text-cream px-[0.2em]">Temiloluwa Obasa</span>
            </h1>
          </div>
          <p className="hero-meta absolute z-30 right-[3%] top-1/2 -translate-y-1/2 max-md:hidden text-right font-mono text-[clamp(0.6875rem,0.9vw,1.5rem)] uppercase tracking-widest leading-[2]">
            <span className="bg-ink text-cream px-[0.5em] py-[0.2em]">I design, build &amp; grow</span><br />
            <span className="bg-ink text-cream px-[0.5em] py-[0.2em]">web products</span><br />
            <span className="bg-ink text-cream px-[0.5em] py-[0.2em] normal-case tracking-normal">* and the motion in them</span>
          </p>
        </div>
      </div>

      {/* desktop: front copy of the figure, over the word */}
      <Figure className="fig-front max-md:hidden absolute z-20 left-1/2 bottom-0 h-[min(46svh,31vw)] max-h-[92%] -translate-x-[38%] translate-y-[14%]" />

      {/* phones: the headline sits under the word instead of on it */}
      <div className="hero-meta md:hidden relative z-30 px-4 pb-6">
        <h1 className="font-inter font-black uppercase leading-[1.05] tracking-tight text-3xl">
          <span className="relative inline-block bg-lime px-[0.2em] -rotate-2">Design<sup className="absolute -right-[0.55em] -top-[0.15em] text-violet text-[0.8em]">*</sup></span> engineer<br />based in Lagos
        </h1>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest">I design, build &amp; grow web products</p>
      </div>

      {/* bottom bar */}
      <div className="hero-meta relative z-30 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 sm:px-6 lg:px-12 pb-6 font-mono text-2xs sm:text-xs uppercase tracking-widest">
        <p className="flex items-center gap-2 bg-ink/[0.06] px-2.5 py-1.5">
          <span aria-hidden className="relative flex size-2"><span className="absolute inline-flex size-full rounded-full bg-[#2f9e44] opacity-60 motion-safe:animate-ping" /><span className="relative inline-flex size-2 rounded-full bg-[#2f9e44]" /></span>
          Available for work
        </p>
        <div aria-hidden className="max-lg:hidden w-[min(28rem,32vw)] overflow-hidden whitespace-nowrap [mask-image:linear-gradient(90deg,transparent,#000_15%,#000_85%,transparent)]">
          <div className="inline-block motion-safe:animate-marquee">{"design — build — grow — afroBalogun — ".repeat(6)}</div>
        </div>
        <div className="flex gap-x-6 gap-y-2 flex-wrap">
          <a href="/works" className="underline underline-offset-4 hover:text-violet transition-colors">See the work →</a>
          <a href="/Obasa-Temiloluwa-Resume.pdf" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-violet transition-colors">Résumé</a>
          <a href="mailto:temiruto14@gmail.com" className="underline underline-offset-4 hover:text-violet transition-colors">Email</a>
        </div>
      </div>
    </section>
  )
}

// the balo drawing, redrawn: a scribbled fro, a heavy collar, and the back in thick brush lines, filled with the page's
// cream so the figure can stand in front of the black letters
const CREAM = "#F6F5F5" // the page colour (bg-cream); written out because the theme colours are not CSS variables here
const FRO = (() => {
  const cx = 355, cy = 322, rx = 92, ry = 76, n = 30, from = (150 * Math.PI) / 180, to = (390 * Math.PI) / 180
  const at = (a: number, k: number) => `${(cx + rx * k * Math.cos(a)).toFixed(1)} ${(cy + ry * k * Math.sin(a)).toFixed(1)}`
  let d = `M${at(from, 1)}`
  for (let i = 1; i <= n; i++) {
    const a0 = from + ((i - 1) / n) * (to - from), a1 = from + (i / n) * (to - from)
    d += ` Q${at((a0 + a1) / 2, 1.08 + 0.04 * Math.sin(i * 2.7))} ${at(a1, 1)}`
  }
  return d
})()

// also used by the Gap poster (components/GapPoster.tsx)
export function Figure({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="120 230 640 650" preserveAspectRatio="xMidYMax meet" className={`pointer-events-none ${className}`}>
      {/* white fill: fro, neck and body */}
      <ellipse cx="355" cy="322" rx="96" ry="80" fill={CREAM} />
      <path d="M322 418C300 440 262 452 248 476C236 500 238 560 228 610C220 650 212 680 200 700L168 700C150 720 132 740 140 752C160 772 196 790 222 812C246 832 290 846 332 858L332 880H660L652 880C648 760 640 680 632 624C628 588 606 566 586 540C562 510 556 474 540 448C520 418 490 404 452 398Z" fill={CREAM} />
      <path d="M300 380L420 380L440 410L320 420Z" fill={CREAM} />
      <g fill="none" stroke="#13160F" strokeLinecap="round" strokeLinejoin="round">
        <path d={FRO} strokeWidth="5" />
        <path d="M322 418C300 440 262 452 248 476C236 500 238 560 228 610C220 650 212 680 200 700" strokeWidth="7" />
        <path d="M168 700C150 720 132 740 140 752C160 772 196 790 222 812C246 832 290 846 332 858" strokeWidth="6" />
        <path d="M452 398C490 404 520 418 540 448C556 474 562 510 586 540C606 566 628 588 632 624C640 680 648 760 652 880" strokeWidth="7" />
        <path d="M312 590L314 700M292 702C318 708 338 728 350 756" strokeWidth="2" />
      </g>
      {/* the hand, and the heavy collar with its little highlight */}
      <path d="M196 702C188 690 176 676 170 684C166 700 178 712 190 716Z" fill="#13160F" />
      <path d="M318 410Q340 385 380 380Q430 377 452 392Q480 404 504 413Q470 419 440 416Q410 426 385 433Q350 433 318 410Z" fill="#13160F" />
      <path d="M368 404Q384 398 400 400" fill="none" stroke={CREAM} strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
