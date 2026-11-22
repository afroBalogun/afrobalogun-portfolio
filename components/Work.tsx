"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { USE_MOCK, mockProject } from "@/lib/mock"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// A case study, result first: the title and the outcome in one line; a facts row (client, role, stack, year, visit);
// the cover; the problem as a big tension line; the work; "under the bonnet" (the technical wins); the results as big
// numbers; the closing line; the gallery; the next project. Any section without content is left out, so older
// projects (description + body only) still read well. Photos keep the curtain reveal (none with reduced motion).

interface Project {
  _id: string; slug: string; title: string; client: string
  description: string; year: number; role: string; body: string[]
  coverImg: string; images: string[]; ratio: 1 | 2 | 3; link: string
  summary?: string; stack?: string[]
  problem?: { headline?: string; body?: string }
  highlights?: { title: string; body: string }[]
  results?: { value: string; label: string }[]
  outcome?: string
  nextProject: { slug: string; title: string }
}

const POSTER = "font-display font-extrabold [font-stretch:62%] uppercase leading-[0.82]"
const LABEL = "font-mono text-xs uppercase tracking-widest"
const BARS = ["bg-lime", "bg-violet", "bg-[#FF8A3D]", "bg-ink"]

function Photo({ src, alt = "", className = "" }: { src: string; alt?: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-ink/10 ${className}`}>
      <img src={src} alt={alt} className="block size-full object-cover" />
      <div className="img-mask absolute inset-0 z-10 bg-cream motion-reduce:hidden" />
    </div>
  )
}

// a section label on a small highlight, like the rest of the site
const Tag = ({ children, tone = "bg-lime" }: { children: React.ReactNode; tone?: string }) => (
  <p className={LABEL}><span className={`${tone} px-1.5 py-0.5 ${tone.includes("violet") ? "text-cream" : ""}`}>{children}</span></p>
)

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
  const body = project.body.filter(Boolean)
  const stack = project.stack ?? []
  const highlights = (project.highlights ?? []).filter((h) => h.title)
  const results = (project.results ?? []).filter((r) => r.value)
  const problem = project.problem?.headline ? project.problem : null
  const facts = [
    { k: "Client", v: project.client },
    { k: "Role", v: project.role },
    ...(stack.length ? [{ k: "Stack", v: stack.join(" · ") }] : []),
    { k: "Year", v: String(project.year) },
  ]

  return (
    <main ref={mainRef} className="min-h-screen bg-cream text-ink">
      {/* header: title, the outcome in one line, the facts */}
      <header className="px-4 sm:px-6 lg:px-12 pt-32 md:pt-40 pb-12 md:pb-16 flex flex-col gap-8">
        <p className={LABEL}>
          <Link href="/works" className="hover:text-violet transition-colors"><span className="text-[#FF8A3D]">/</span> works</Link>
          <span className="opacity-60"> / {project.client}</span>
        </p>
        <h1 className={`rise-in ${POSTER} text-[clamp(3.5rem,11vw,22rem)]`}>{project.title}</h1>
        <p className="rise-in max-w-[30ch] font-display font-semibold tracking-tight leading-[1.1] text-[clamp(1.5rem,3vw,4.5rem)]">
          {project.summary || project.description}
        </p>
        <div className="rise-in grid grid-cols-2 md:grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-x-8 gap-y-5 border-t-2 border-ink pt-5 items-end">
          {facts.map((f) => (
            <div key={f.k} className="flex flex-col gap-1">
              <p className="font-mono text-2xs uppercase tracking-widest opacity-60">{f.k}</p>
              <p className="font-medium">{f.v}</p>
            </div>
          ))}
          {project.link && (
            <Link href={project.link} target="_blank" rel="noopener noreferrer" className="w-fit rounded-full bg-[#FF8A3D] px-4 py-2 font-mono text-xs uppercase tracking-widest transition-transform hover:-rotate-2">
              Visit site ↗
            </Link>
          )}
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-12 pb-16 flex flex-col gap-20 md:gap-28">
        <Photo src={project.coverImg} alt={project.title} className="w-full aspect-16/9" />

        {/* the problem, as a tension */}
        {problem && (
          <section className="rise-in grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-6">
            <div className="md:col-span-3"><Tag tone="bg-[#FF8A3D]">The problem</Tag></div>
            <div className="md:col-span-9 flex flex-col gap-6">
              <h2 className="font-display font-semibold tracking-tight leading-[1.02] text-[clamp(2.25rem,5vw,8rem)]">{problem.headline}</h2>
              {problem.body && <p className="max-w-[60ch] font-inter text-lg leading-relaxed text-ink/80">{problem.body}</p>}
            </div>
          </section>
        )}

        {/* the work */}
        {(body.length > 0 || (project.summary && project.description)) && (
          <section className="rise-in grid grid-cols-1 md:grid-cols-12 gap-x-10 gap-y-6">
            <div className="md:col-span-3"><Tag>The work</Tag></div>
            <div className="md:col-span-9 columns-1 md:columns-2 gap-10 font-inter text-base md:text-lg leading-relaxed">
              {project.summary && project.description && <p className="mb-5 break-inside-avoid">{project.description}</p>}
              {body.map((para, i) => <p key={i} className="mb-5 break-inside-avoid">{para}</p>)}
            </div>
          </section>
        )}

        {/* under the bonnet: the technical wins */}
        {highlights.length > 0 && (
          <section className="rise-in flex flex-col gap-8">
            <Tag tone="bg-violet">Under the bonnet</Tag>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {highlights.map((h, i) => (
                <article key={h.title} className="flex flex-col gap-3 rounded-2xl bg-white/70 p-6 md:p-8 ring-1 ring-ink/10">
                  <span aria-hidden className={`h-1.5 w-12 rounded-full ${BARS[i % BARS.length]}`} />
                  <h3 className="font-display font-semibold tracking-tight text-[clamp(1.4rem,2vw,2.75rem)] leading-tight">{h.title}</h3>
                  {h.body && <p className="font-inter leading-relaxed text-ink/75">{h.body}</p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* results, as big numbers */}
        {results.length > 0 && (
          <section className="rise-in flex flex-col gap-8">
            <Tag>Results</Tag>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-t-2 border-ink pt-8">
              {results.map((r) => (
                <div key={r.label + r.value} className="flex flex-col gap-2">
                  <p className={`${POSTER} text-[clamp(4.5rem,10vw,16rem)]`}>{r.value}</p>
                  <p className="font-inter font-medium text-lg">{r.label}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* the closing line */}
        {project.outcome && (
          <p className="rise-in max-w-[24ch] font-display font-semibold tracking-tight leading-[1.05] text-[clamp(2rem,4.5vw,7rem)]">
            <span className="bg-no-repeat bg-bottom bg-[length:100%_30%] bg-[linear-gradient(#BCF975,#BCF975)]">{project.outcome}</span>
          </p>
        )}

        {/* gallery: a pair, then wide ones */}
        {images.length > 0 && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {images.map((src, i) => (
              <Photo key={src} src={src} className={i < 2 ? "aspect-[4/5]" : "md:col-span-2 aspect-16/9"} />
            ))}
          </section>
        )}

        {/* next project */}
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
