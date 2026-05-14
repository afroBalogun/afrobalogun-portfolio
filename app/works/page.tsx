"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import { useRef, useEffect, useState } from "react"
import Link from "next/link"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

interface Project {
  _id: string
  slug: string
  title: string
  role: string
  coverImg: string
  year: number
  ratio: 1 | 2 | 3
}

const ratioSize: Record<1 | 2 | 3, string> = {
  1: "w-36 h-48",   // portrait
  2: "w-52 h-36",   // landscape
  3: "w-40 h-40",   // square
}

export default function Works() {
  const mainRef = useRef<HTMLDivElement>(null)
  const [groups, setGroups] = useState<{ year: string; items: Project[] }[]>([])
  const titleAnimatedRef = useRef(false)

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((projects: Project[]) => {
        const map = new Map<string, Project[]>()
        for (const p of projects) {
          const y = String(p.year)
          if (!map.has(y)) map.set(y, [])
          map.get(y)!.push(p)
        }
        setGroups(Array.from(map.entries()).map(([year, items]) => ({ year, items })))
      })
  }, [])

  useGSAP(() => {
    if (!groups.length) return

    if (!titleAnimatedRef.current) {
      const split = new SplitText(".works-title", { type: "chars" })
      gsap.from(split.chars, { opacity: 0, y: 16, duration: 0.6, ease: "power3.out", stagger: 0.06 })
      titleAnimatedRef.current = true
    }
    gsap.utils.toArray<HTMLElement>(".year-label").forEach((el) => {
      gsap.from(el, { opacity: 0, x: -16, duration: 0.6, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
    })

    gsap.utils.toArray<HTMLElement>(".year-line").forEach((el) => {
      gsap.from(el, { scaleX: 0, transformOrigin: "left center", duration: 0.9, ease: "power4.inOut", scrollTrigger: { trigger: el, start: "top 90%" } })
    })

    gsap.utils.toArray<HTMLElement>(".card-mask").forEach((mask, i) => {
      gsap.to(mask, {
        yPercent: 100, duration: 1.1, ease: "power4.inOut",
        scrollTrigger: { trigger: mask.parentElement, start: "top 85%" },
        delay: (i % 3) * 0.12,
      })
    })

    gsap.utils.toArray<HTMLElement>(".card-meta").forEach((el, i) => {
      gsap.from(el, {
        opacity: 0, y: 8, duration: 0.5, ease: "power3.out",
        scrollTrigger: { trigger: el.closest("article"), start: "top 85%" },
        delay: 0.7 + (i % 3) * 0.12,
      })
    })
  }, { scope: mainRef, dependencies: [groups] })

  // if (!groups.length) return <WorksSkeleton />

  return (
    <main ref={mainRef} className="min-h-screen py-8 sm:py-12 md:py-15 px-4 sm:px-6 md:px-8 lg:px-12 flex flex-col justify-end gap-20">
      <div className="h-[40vh] flex items-end">
        <h2 className="works-title font-semibold font-mono text-4xl tracking-[0.2em] opacity-20">works</h2>
      </div>

      {!groups.length ? <WorksSkeleton /> : groups.map((group) => (
        <section key={group.year} className="w-full flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="year-label font-medium font-mono text-sm tracking-[0.2em]">{group.year}</h3>
            <p className="font-medium uppercase text-xs opacity-20">
              {group.items.length} {group.items.length === 1 ? "project" : "projects"}
            </p>
          </div>
          <div className="year-line h-px bg-current opacity-10" />

          <div className="flex mt-10 gap-5 flex-wrap items-end">
            {group.items.map((project) => (
              <Link key={project._id} href={`/works/${project.slug}`}>
                <article className={`${ratioSize[project.ratio]} relative overflow-hidden bg-neutral-300 cursor-pointer group`}>
                  <img
                    src={project.coverImg}
                    alt={project.title}
                    className="absolute inset-0 w-full h-full object-cover grayscale transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="card-mask absolute inset-0 z-10 bg-neutral-300" style={{ transformOrigin: "top center" }} />
                  <div className="absolute inset-0 z-20 flex flex-col justify-end p-3 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                    <p className="card-meta text-[9px] font-mono uppercase tracking-widest opacity-60 mb-1">{project.role}</p>
                    <p className="card-meta text-xs font-mono font-medium leading-snug">{project.title}</p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  )
}

function WorksSkeleton() {
  const cards = [
    { w: "w-36", h: "h-48" },
    { w: "w-52", h: "h-36" },
    { w: "w-40", h: "h-40" },
    { w: "w-40", h: "h-40" },
    { w: "w-36", h: "h-48" },
  ]

  return (
    <>
      {[3, 2].map((count, si) => (
        <section key={si} className="w-full flex flex-col gap-4 animate-[flicker_4s_infinite]">
          <div className="flex items-center justify-between">
            <div className="h-2.5 w-10 bg-current opacity-10" />
            <div className="h-2 w-16 bg-current opacity-5" />
          </div>
          <div className="h-px bg-current opacity-10" />
          <div className="flex mt-10 gap-5 flex-wrap items-end">
            {cards.slice(0, count + 1).map((c, i) => (
              <div key={i} className={`${c.w} ${c.h} relative bg-current opacity-10 overflow-hidden flex-shrink-0`}>
                <div
                  className="absolute inset-0 animate-[scan_0.9s_linear_infinite]"
                  style={{ background: "repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.04) 3px,rgba(0,0,0,.04) 4px)" }}
                />
                <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1 opacity-20">
                  <div className="h-1.5 w-3/5 bg-white" />
                  <div className="h-2 w-4/5 bg-white" />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}