"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { USE_MOCK, mockProject } from "@/lib/mock"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A case study, in the home hero's language: a header with the title huge in the tall condensed letters,
// role / year / client on lime, violet and orange tags and the description beside them; the cover full width; the
// write-up in two columns; the rest of the images in a grid; then a visit pill and a big link to the next project.
// Photos keep the curtain reveal (a cream cover slides off as each scrolls in; none with reduced motion).

interface Project {
  _id: string; slug: string; title: string; client: string
  description: string; year: number; role: string; body: string[]
  coverImg: string; images: string[]; ratio: 1 | 2 | 3; link: string
  nextProject: { slug: string; title: string }
}

const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase leading-[0.82]"
const TAG = "inline-block px-[0.45em] py-[0.15em] font-mono text-xs uppercase tracking-widest"

function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-ink/10 ${className}`}>
      <img src={src} alt={alt} className="block size-full object-cover" />
      <div className="img-mask absolute inset-0 z-10 bg-cream motion-reduce:hidden" />
    </div>
  )
}

export default function Work() {
  const { slug } = useParams<{ slug: string }>()
  const mainRef = useRef<HTMLElement>(null)
  const [project, setProject] = useState<Project | null>(USE_MOCK ? (mockProject(slug) as Project) : null)

  useEffect(() => {
    if (USE_MOCK) return
    fetch(`/api/projects/${slug}`).then(r => r.ok ? r.json() : null).then(setProject)
  }, [slug])

  useGSAP(() => {
    if (!project || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.utils.toArray<HTMLElement>(".img-mask", mainRef.current).forEach((mask) => {
      gsap.to(mask, { yPercent: 100, duration: 1.3, ease: "power4.inOut", scrollTrigger: { trigger: mask.parentElement, start: "top 85%" } })
    })
    gsap.utils.toArray<HTMLElement>(".rise-in", mainRef.current).forEach((el) => {
      gsap.from(el, { opacity: 0, y: 16, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } })
    })
  }, { scope: mainRef, dependencies: [project] })

  if (!project) return null

  const images = project.images.filter(Boolean)
  const body = project.body.length ? project.body : [project.description]

  return (
    <main ref={mainRef} className="min-h-screen bg-cream text-ink">
      {/* header */}
      <header className="relative overflow-hidden px-4 sm:px-6 lg:px-12 pt-32 md:pt-40 pb-12 md:pb-16">
        <div className="relative flex flex-col gap-8">
          <p className="font-mono text-xs uppercase tracking-widest">
            <Link href="/works" className="hover:text-violet transition-colors"><span className="text-[#FF8A3D]">/</span> works</Link>
            <span className="opacity-60"> / {project.client}</span>
          </p>
          <h1 className={`rise-in ${POSTER} text-[clamp(3.5rem,11vw,22rem)]`}>{project.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6 items-start">
            <p className="rise-in flex flex-wrap gap-2">
              <span className={`${TAG} bg-lime -rotate-2`}>{project.role}</span>
              <span className={`${TAG} bg-violet text-cream`}>{project.year}</span>
              <span className={`${TAG} bg-[#FF8A3D]`}>{project.client}</span>
            </p>
            <p className="rise-in max-w-[48ch] font-inter font-medium leading-snug text-lg md:text-xl">{project.description}</p>
          </div>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-12 pb-16 flex flex-col gap-16 md:gap-24">
        {/* cover */}
        <Photo src={project.coverImg} alt={project.title} className="w-full aspect-16/9" />

        {/* the write-up */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-6">
          <h2 className="md:col-span-3 font-mono text-xs uppercase tracking-widest"><span className="bg-lime px-1.5 py-0.5">The work</span></h2>
          <div className="rise-in md:col-span-9 columns-1 md:columns-2 gap-10 font-inter text-base md:text-lg leading-relaxed">
            {body.map((para, i) => <p key={i} className="mb-5 break-inside-avoid">{para}</p>)}
          </div>
        </section>

        {/* the rest of the images: a pair, then wide ones */}
        {images.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {images.map((src, i) => (
              <Photo key={src} src={src} className={i < 2 ? "aspect-[4/5]" : "md:col-span-2 aspect-16/9"} />
            ))}
          </section>
        )}

        {/* back matter: visit + next project */}
        <footer className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-t-2 border-ink pt-8">
          {project.link ? (
            <Link href={project.link} target="_blank" rel="noopener noreferrer" className="w-fit rounded-full bg-[#FF8A3D] px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-transform hover:-rotate-2">
              Visit the live site ↗
            </Link>
          ) : <span />}
          <Link href={`/works/${project.nextProject.slug}`} className="group flex flex-col md:items-end gap-2">
            <span className="w-fit bg-violet text-cream px-2 py-0.5 font-mono text-xs uppercase tracking-widest">Next →</span>
            <span className={`${POSTER} text-[clamp(2.5rem,6vw,10rem)] transition-colors group-hover:text-violet`}>{project.nextProject.title}</span>
          </Link>
        </footer>
      </div>
    </main>
  )
}
