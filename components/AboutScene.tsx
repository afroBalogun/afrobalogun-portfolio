"use client"
import { useEffect, useState } from "react"

// The About opener, laid out like a film poster: an info sheet (a hello, four facts with a live Lagos clock and a
// pulsing Available dot, the description), then TEMI huge across the width, with the home hero's highlight labels set
// on it: a tilted lime HELLO tag over a violet NICE TO MEET YOU bar on the left; how I work (understand, design in
// the browser, ship & measure) on orange, lime and violet bars on the right.

const CAPTION =
  "Based in Lagos, I've spent the last few years building things that move with a reason and work on the first try: websites and web apps, a mobile app, data pipelines, even a digital twin for a plant. I design them, then I build them myself: the interface, the motion, the API and data behind it, carried by one person from the first sketch to launch, so the thing you approve is the thing that ships."

const FACTS = [
  { k: "Role", v: "Designer & developer" },
  { k: "Based in", v: "Lagos, Nigeria" },
  { k: "Working", v: "Freelance & in-house, since 2024" },
]

const label = "font-semibold uppercase tracking-wide text-xs"
// label highlights, in turn; each wipes in after the one before (keyframes in globals.css)
const HL = ["#BCF975", "#FF8A3D", "#CFC4F7"]
const T0 = 0.9 // seconds: start just after the page intro
function Label({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <p className={label}>
      <span className="about-hl" style={{ ["--hl" as string]: HL[i % HL.length], animationDelay: `${T0 + i * 0.12}s` }}>{children}</span>
    </p>
  )
}
// fades the content under a label up, just behind it
const riseStyle = (i: number) => ({ style: { animationDelay: `${T0 + 0.1 + i * 0.12}s` } })

// the time in Lagos, set after mount so server and client render the same markup
function useLagosTime() {
  const [t, setT] = useState("")
  useEffect(() => {
    const tick = () => setT(new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return t
}

export default function AboutScene() {
  const time = useLagosTime()
  return (
    <section aria-labelledby="about-hello" className="flex min-h-svh flex-col gap-6 md:gap-8 pt-28 md:pt-36 pb-10">
      {/* the info sheet */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 text-sm">
        <Label i={0}>About</Label>
        <p {...riseStyle(0)} className="about-rise md:col-span-2 max-w-[44ch] leading-snug">
          Hi, I&apos;m Temi. I&apos;m a{" "}
          <span className="bg-no-repeat bg-bottom bg-[length:100%_40%] bg-[linear-gradient(#BCF975,#BCF975)]">designer and full-stack developer.</span>
        </p>
        <p></p>
        {FACTS.map((f, i) => (
          <div key={f.k} className="flex flex-col gap-1">
            <Label i={i + 1}>{f.k}</Label>
            <p {...riseStyle(i + 1)} className="about-rise leading-snug opacity-80">{f.v}</p>
          </div>
        ))}
        <div className="flex flex-col gap-1">
          <Label i={4}>Available</Label>
          <p {...riseStyle(4)} className="about-rise flex items-center gap-2 leading-snug opacity-80">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inset-0 rounded-full bg-lime opacity-80 animate-ping" />
              <span className="relative size-2 rounded-full bg-[#3BB54A]" />
            </span>
            For new projects
          </p>
        </div>
        <Label i={5}>Description</Label>
        <p {...riseStyle(5)} className="about-rise col-span-2 md:col-span-3 max-w-[60ch] text-base md:text-lg leading-snug opacity-90">{CAPTION}</p>
      </div>

      {/* the big word, with a hello set on it in the hero's highlight style */}
      <div className="relative mt-auto pt-10">
        <h1 id="about-hello" aria-label="Hi, I'm Temi" className="flex justify-center font-display font-black uppercase leading-[0.78] tracking-[-0.02em] [font-stretch:125%] text-[24.5vw]">
          {"Temi".split("").map((ch, i) => (
            <span key={i} aria-hidden className="inline-block overflow-hidden pt-[0.06em]">
              <span className="inline-block [animation:intro-word_.9s_cubic-bezier(.22,1,.36,1)_both] motion-reduce:[animation:none]" style={{ animationDelay: `${T0 + 0.5 + i * 0.09}s` }}>{ch}</span>
            </span>
          ))}
        </h1>
        <p aria-hidden style={{ animationDelay: `${T0 + 1.1}s` }} className="about-pop origin-bottom-left absolute left-[1%] top-[22%] font-inter font-black uppercase leading-[1.25] tracking-tight text-[clamp(0.9rem,1.9vw,3.5rem)]">
          <span className="relative inline-block bg-lime text-ink px-[0.2em] -rotate-2">Hello<sup className="absolute -right-[0.55em] -top-[0.15em] text-violet text-[0.8em]">*</sup></span>
          <br />
          <span className="bg-violet text-cream px-[0.2em]">Nice to meet you</span>
        </p>
        <p aria-hidden style={{ animationDelay: `${T0 + 1.25}s` }} className="about-pop origin-bottom-right max-md:hidden absolute right-[1%] bottom-[12%] text-right font-mono text-[clamp(0.6875rem,0.9vw,1.5rem)] uppercase tracking-widest leading-[2]">
          <span className="bg-[#FF8A3D] text-ink px-[0.5em] py-[0.2em]">Understand</span><br />
          <span className="bg-lime text-ink px-[0.5em] py-[0.2em]">Design in the browser</span><br />
          <span className="bg-violet text-cream px-[0.5em] py-[0.2em] normal-case tracking-normal">Ship &amp; measure</span>
        </p>
      </div>
    </section>
  )
}
