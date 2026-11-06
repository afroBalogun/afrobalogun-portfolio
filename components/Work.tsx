"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GoArrowUpRight } from "react-icons/go"

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface Project {
  _id: string; slug: string; title: string; client: string
  description: string; year: number; role: string; body: string[]
  coverImg: string; images: string[]; ratio: 1 | 2 | 3; link: string
  nextProject: { slug: string; title: string }
}

// photo with the curtain reveal: a page-coloured mask slides off it on scroll
function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img src={src} alt={alt} className="block w-full h-full object-cover" />
      <div className="img-mask absolute inset-0 z-10 bg-primary" />
    </div>
  )
}

// page numbers sit in the outer corners of each spread, like a printed magazine
function Folio({ left, right }: { left: number; right: number }) {
  return (
    <div className="md:col-span-8 flex justify-between font-mono text-2xs tracking-widest opacity-50">
      <span>{String(left).padStart(2, "0")}</span>
      <span>{String(right).padStart(2, "0")}</span>
    </div>
  )
}

export default function Work() {
  const { slug } = useParams<{ slug: string }>()
  const mainRef = useRef<HTMLElement>(null)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    fetch(`/api/projects/${slug}`).then(r => r.ok ? r.json() : null).then(setProject)
  }, [slug])

  useGSAP(() => {
    if (!project) return

    // photos: curtain slides down off each image as it enters
    gsap.utils.toArray<HTMLElement>(".img-mask", mainRef.current).forEach((mask) => {
      gsap.to(mask, {
        yPercent: 100, duration: 1.3, ease: "power4.inOut",
        scrollTrigger: { trigger: mask.parentElement, start: "top 85%" },
      })
    })

    // text blocks fade up as each spread arrives
    gsap.utils.toArray<HTMLElement>(".spread-text", mainRef.current).forEach((el) => {
      gsap.from(el, {
        opacity: 0, y: 14, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" },
      })
    })
  }, { scope: mainRef, dependencies: [project] })

  if (!project) return null

  const [pairA, pairB, wide, ...extra] = project.images.filter(Boolean)
  // body copy is split across the two spreads; with no body, the description carries spread one
  const body = project.body.length ? project.body : [project.description]
  const half = Math.ceil(body.length / 2)
  const bodyA = body.slice(0, half)
  const bodyB = body.slice(half)

  return (
    <main ref={mainRef} className="min-h-screen px-4 sm:px-6 lg:px-12 pt-28 pb-16 flex flex-col gap-16 font-serif">

      {/* ── Spread 1 (pp. 01–02): meta + standfirst column, cover across the fold, body in columns ── */}
      {/* the spread is an 8-column grid: columns 1–4 are the left page, 5–8 the right; the line is the fold */}
      <section className="relative grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-10 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-px md:before:bg-secondary/15">
        <div className="spread-text md:col-span-2 flex flex-col gap-5 text-sm leading-snug">
          <p className="font-mono text-2xs uppercase tracking-widest opacity-60">{project.year} · {project.role} · {project.client}</p>
          <p className="text-justify hyphens-auto">{project.description}</p>
        </div>
        <Photo src={project.coverImg} alt={project.title} className="md:col-span-6 aspect-16/10" />

        <div className="spread-text md:col-span-8 columns-1 sm:columns-2 md:columns-4 gap-6 text-[0.8rem] leading-snug text-justify hyphens-auto">
          {bodyA.map((para, i) => <p key={i} className="mb-3 break-inside-avoid-column">{para}</p>)}
        </div>
        <Folio left={1} right={2} />
      </section>

      {/* ── Spread 2 (pp. 03–04): headline + captioned pair on the left page, wide photo and body on the right ── */}
      <section className="relative grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-10 md:before:absolute md:before:inset-y-0 md:before:left-1/2 md:before:w-px md:before:bg-secondary/15">
        <div className="spread-text md:col-span-4 md:pr-8 flex flex-col items-center gap-4 text-center self-center">
          <h1 className="font-bold uppercase leading-tight text-2xl sm:text-3xl">{project.title}</h1>
          <p className="italic text-sm leading-snug max-w-md">{project.description}</p>
        </div>
        {wide && <Photo src={wide} className="md:col-span-4 aspect-16/10" />}

        {(pairA || pairB) && (
          <div className="md:col-span-4 md:pr-8 grid grid-cols-2 gap-4">
            {[pairA, pairB].filter(Boolean).map((src, i) => (
              <figure key={src} className="flex flex-col gap-2">
                <figcaption className="spread-text text-xs leading-tight">
                  Photo — {String(i + 1).padStart(2, "0")}<br /><span className="font-bold">{project.client}</span>
                </figcaption>
                <Photo src={src} className="aspect-3/4" />
              </figure>
            ))}
          </div>
        )}
        {bodyB.length > 0 && (
          <div className="spread-text md:col-start-5 md:col-span-4 columns-1 sm:columns-2 gap-6 text-[0.8rem] leading-snug text-justify hyphens-auto self-start">
            {bodyB.map((para, i) => <p key={i} className="mb-3 break-inside-avoid-column">{para}</p>)}
          </div>
        )}
        <Folio left={3} right={4} />
      </section>

      {/* any further images run full width */}
      {extra.map((src) => <Photo key={src} src={src} className="w-full aspect-16/9" />)}

      {/* ── Back matter: visit + next project ── */}
      <footer className="flex items-end justify-between gap-6 border-t border-secondary/15 pt-6 font-mono text-xs uppercase tracking-widest">
        {project.link ? (
          <Link href={project.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 underline underline-offset-4 hover:opacity-50 transition-opacity">
            visit <GoArrowUpRight />
          </Link>
        ) : <span />}
        <Link href={`/works/${project.nextProject.slug}`} className="flex flex-col items-end gap-1 hover:opacity-50 transition-opacity text-right">
          <span className="text-2xs opacity-50">next</span>
          <span className="flex items-center gap-1 font-semibold">{project.nextProject.title} <GoArrowUpRight /></span>
        </Link>
      </footer>
    </main>
  )
}
