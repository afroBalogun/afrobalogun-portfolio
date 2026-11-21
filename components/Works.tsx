"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { USE_MOCK, MOCK_PROJECTS } from "@/lib/mock"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Works, in the home hero's language: a header with WORKS in the tall condensed letters, a tilted lime tag
// and a violet bar; then the projects by year, each year big and condensed, each card in full colour with its title on
// a highlight bar (lime / violet / orange in turn) that tilts on hover.

interface Project {
  _id: string
  slug: string
  title: string
  role: string
  coverImg: string
  year: number
  ratio: 1 | 2 | 3
}

// card shapes: portrait, landscape, square
const ratioSize: Record<1 | 2 | 3, string> = {
  1: "w-[clamp(11rem,20vw,24rem)] aspect-[3/4]",
  2: "w-[clamp(15rem,30vw,36rem)] aspect-[4/3]",
  3: "w-[clamp(12rem,22vw,26rem)] aspect-square",
}
// each card's highlight colour, in turn
const ACCENTS = ["bg-lime text-ink", "bg-violet text-cream", "bg-[#FF8A3D] text-ink"]
const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase leading-[0.82]"

const groupByYear = (projects: Project[]) => {
  const map = new Map<string, Project[]>()
  for (const p of projects) {
    const y = String(p.year)
    if (!map.has(y)) map.set(y, [])
    map.get(y)!.push(p)
  }
  return Array.from(map.entries()).map(([year, items]) => ({ year, items }))
}

let cachedGroups: { year: string; items: Project[] }[] | null = USE_MOCK ? groupByYear(MOCK_PROJECTS) : null

export default function Works() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [groups, setGroups] = useState<{ year: string; items: Project[] }[]>(cachedGroups ?? [])
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (cachedGroups) return  // already fetched, skip

    fetch("/api/projects")
      // a failed API (e.g. DB down) returns an error page, not JSON; show a message instead of an endless skeleton
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`projects ${r.status}`))))
      .then((projects: Project[]) => {
        cachedGroups = groupByYear(projects)
        setGroups(cachedGroups)
      })
      .catch(() => setFailed(true))
  }, [])

  useGSAP(() => {
    if (!groups.length || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.utils.toArray<HTMLElement>(".year-label").forEach((el) => {
      gsap.from(el, { opacity: 0, y: 24, duration: 0.7, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
    })
    gsap.utils.toArray<HTMLElement>(".year-line").forEach((el) => {
      gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 90%" } })
    })
    gsap.utils.toArray<HTMLElement>(".card-mask").forEach((mask, i) => {
      gsap.to(mask, { yPercent: 100, duration: 1.1, ease: "power4.inOut", scrollTrigger: { trigger: mask.parentElement, start: "top 85%" }, delay: (i % 3) * 0.12 })
    })
  }, { scope: mainRef, dependencies: [groups] })

  let n = 0 // running card count, for the accent colours
  return (
    <main ref={mainRef} className="min-h-screen bg-cream text-ink">
      {/* header */}
      <header className="relative overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="relative flex flex-col gap-6">
          <p className="font-mono text-xs uppercase tracking-widest"><span className="text-[#FF8A3D]">/</span> works</p>
          <div className="relative w-fit">
            <h1 className={`${POSTER} text-[clamp(5rem,22vw,40rem)]`}>Works</h1>
            <p aria-hidden className="absolute -right-[4%] top-[8%] translate-x-full max-md:hidden font-inter font-black uppercase leading-[1.25] tracking-tight text-[clamp(1rem,1.7vw,3rem)]">
              <span className="relative inline-block bg-lime px-[0.2em] -rotate-2">Selected<sup className="absolute -right-[0.55em] -top-[0.15em] text-violet text-[0.8em]">*</sup></span><br />
              <span className="bg-violet text-cream px-[0.2em]">Design · build · ship</span>
            </p>
          </div>
          <p className="max-w-[52ch] font-inter font-medium leading-snug text-base md:text-lg">Things I&apos;ve designed and built, for clients, for teams and for myself. Open one to see the problem, what I did and what changed.</p>
        </div>
      </header>

      <div className="px-4 sm:px-6 md:px-8 lg:px-12 pb-24 flex flex-col gap-20">
        {failed ? (
          <p className="w-fit bg-[#FF8A3D] px-3 py-2 font-mono text-xs uppercase tracking-widest">Projects couldn&apos;t load. Try again in a moment.</p>
        ) : !groups.length ? <WorksSkeleton /> : groups.map((group) => (
          <section key={group.year} className="w-full flex flex-col gap-4">
            <div className="flex items-end justify-between gap-6">
              <h2 className={`year-label ${POSTER} text-[clamp(3rem,7vw,12rem)]`}>{group.year}</h2>
              <p className="pb-2 font-mono text-xs uppercase tracking-widest opacity-60">
                {group.items.length} {group.items.length === 1 ? "project" : "projects"}
              </p>
            </div>
            <div className="year-line h-0.5 bg-ink" />

            <div className="flex mt-8 gap-6 md:gap-10 flex-wrap items-end">
              {group.items.map((project) => {
                const accent = ACCENTS[n++ % ACCENTS.length]
                return (
                  <Link key={project._id} href={`/works/${project.slug}`} className="group flex flex-col gap-3 outline-none">
                    <article className={`${ratioSize[project.ratio]} relative overflow-hidden bg-ink/10`}>
                      <img src={project.coverImg} alt={project.title} className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                      {/* a cream cover that slides off as the card scrolls in; never shown with reduced motion, where nothing would move it */}
                      <div className="card-mask absolute inset-0 z-10 bg-cream motion-reduce:hidden" style={{ transformOrigin: "top center" }} />
                    </article>
                    <div className="flex flex-col items-start gap-1">
                      <p className="font-inter font-black uppercase tracking-tight text-[clamp(0.95rem,1.3vw,2rem)]">
                        <span className={`inline-block px-[0.3em] transition-transform duration-300 ease-[cubic-bezier(.34,1.8,.64,1)] group-hover:-rotate-2 group-focus-visible:-rotate-2 ${accent}`}>{project.title}</span>
                      </p>
                      <p className="font-mono text-2xs uppercase tracking-widest opacity-60">{project.role}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  )
}

function WorksSkeleton() {
  return (
    <>
      {[3, 2].map((count, si) => (
        <section key={si} className="w-full flex flex-col gap-4 animate-[flicker_4s_infinite]">
          <div className="h-12 w-40 bg-ink/10" />
          <div className="h-0.5 bg-ink/10" />
          <div className="flex mt-8 gap-6 md:gap-10 flex-wrap items-end">
            {Array.from({ length: count + 1 }, (_, i) => (
              <div key={i} className={`${ratioSize[((i % 3) + 1) as 1 | 2 | 3]} bg-ink/10`} />
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
