"use client"

import Link from "next/link"
import type { PointerEvent } from "react"
import { Yellowtail } from "next/font/google"
import { FEATURED } from "@/lib/featured"

const script = Yellowtail({ subsets: ["latin"], weight: "400" })

// Featured work, on dark: a heading (label | title | blurb), then each case as a tinted panel holding its
// screenshot(s), a lime arrow square in the corner and a lime "View" bubble that follows the cursor; under it a rule,
// number, title, question and result. A large statement after the cases opens the About section that follows.
const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase"

export default function FeaturedStack() {
  // the View bubble follows the pointer inside a case's panel
  const follow = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`)
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`)
  }

  return (
    // data-nav-bare: the nav sits straight on the dark instead of over its pale backdrop
    <section data-nav-bare aria-labelledby="featured-title" className="bg-ink text-cream">

      {/* heading: label | title | blurb */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-x-8 gap-y-4 px-4 sm:px-6 lg:px-12 pt-24 lg:pt-36">
        <p className="font-mono text-xs uppercase tracking-widest md:pt-4">Selected work</p>
        <h2 id="featured-title" className="scroll-mt-28 leading-[0.85]">
          <span className={`block ${POSTER} text-[clamp(3.5rem,8vw,18rem)]`}>Selected</span>
          <span className={`${script.className} block text-violet text-[clamp(3rem,6.5vw,15rem)] -mt-[0.1em] ml-[0.05em]`}>work.</span>
        </h2>
        <div className="flex flex-col gap-4 md:self-end md:pb-4 max-w-xs">
          <p className="text-sm leading-relaxed opacity-75">Products, platforms and pipelines I&apos;ve designed and built, from first sketch to live.</p>
          <Link href="/works" className="w-fit font-mono text-xs uppercase tracking-widest underline underline-offset-4 hover:text-lime transition-colors">View all works →</Link>
        </div>
      </div>

      <ol className="mt-16 lg:mt-24 flex flex-col gap-20 lg:gap-32 px-4 sm:px-6 lg:px-12">
        {FEATURED.map((c, i) => {
          const shots = [c.cover, ...(c.more ?? [])]
          return (
            <li key={c.slug} id={`case-${c.slug}`} className="scroll-mt-24">
              <Link href={`/works/${c.slug}`} className="group block outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-4 focus-visible:ring-offset-ink">
                <div onPointerMove={follow} className="relative bg-[#2F2A28] p-4 pb-16 sm:p-8 sm:pb-20 lg:p-16 lg:pb-24">
                  <div className={`grid gap-4 lg:gap-8 ${shots.length > 1 ? "md:grid-cols-2" : ""}`}>
                    {shots.map((src, k) => (
                      <div key={src} className="overflow-hidden bg-cream shadow-[0_18px_40px_rgba(0,0,0,.4)]">
                        <img src={src} alt={k ? "" : `${c.title} screenshot`} className={`block w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03] ${shots.length > 1 ? "aspect-[4/3]" : "aspect-[4/3] md:aspect-[16/8]"}`} />
                      </div>
                    ))}
                  </div>
                  {/* lime View bubble, on pointer devices */}
                  <span aria-hidden className="pointer-events-none absolute z-10 hidden md:flex size-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 rounded-full bg-lime font-medium text-ink scale-0 transition-transform duration-300 ease-out group-hover:scale-100" style={{ left: "var(--x, 50%)", top: "var(--y, 50%)" }}>View ↗</span>
                  <span aria-hidden className="absolute right-3 bottom-3 sm:right-5 sm:bottom-5 grid size-10 sm:size-12 place-items-center bg-lime text-ink text-xl transition-transform group-hover:-translate-y-1">↗</span>
                </div>
                <div className="mt-6 grid grid-cols-[2.5rem_1fr] md:grid-cols-[4rem_1fr_auto] gap-x-4 gap-y-3 border-t border-cream/30 pt-5">
                  <span className="font-mono text-sm pt-[0.4em]">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-display font-semibold tracking-tight leading-[1.05] text-[clamp(1.75rem,3vw,7rem)] transition-colors group-hover:text-lime">{c.title}</h3>
                    <p className="mt-2 text-sm md:text-base opacity-70">{c.question}</p>
                  </div>
                  <div className="col-start-2 md:col-start-3 md:text-right flex flex-col gap-1">
                    <p className={`${POSTER} leading-none text-[clamp(2rem,3vw,7rem)] text-lime`}>{c.results[0].value}</p>
                    <p className="font-mono text-xs uppercase tracking-widest">{c.results[0].label}</p>
                    <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-widest opacity-60">{[c.role, ...c.stack].join(" · ")}</p>
                  </div>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>

      {/* the statement that opens the About section below */}
      <div className="px-4 sm:px-6 lg:px-12 pt-28 lg:pt-40 pb-24 lg:pb-32">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60">About</p>
        <p className="mt-4 max-w-6xl font-display font-semibold tracking-tight leading-[1.08] text-[clamp(1.75rem,3.6vw,7rem)]">
          I design, build and grow web products, from the first sketch and motion pass to the APIs, payments and data behind them, and on to the people they were made for.
        </p>
      </div>
    </section>
  )
}
