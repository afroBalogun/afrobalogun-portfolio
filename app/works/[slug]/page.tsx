"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger, SplitText } from "gsap/all"
import Link from "next/link"
import { useRef, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { GoArrowDownRight } from "react-icons/go"

gsap.registerPlugin(useGSAP, SplitText, ScrollTrigger)

interface Project {
  _id: string; slug: string; title: string; client: string
  description: string; year: number; role: string; body: string[]
  coverImg: string; images: string[]; ratio: 1 | 2 | 3; link: string
  nextProject: { slug: string; title: string }
}

export default function Work() {
  const { slug } = useParams<{ slug: string }>()
  const mainRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    fetch(`/api/projects/${slug}`).then(r => r.json()).then(setProject)
  }, [slug])

  useGSAP(() => {
    if (!project) return

    // Panel items stagger up
    gsap.to(".panel-item", {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power3.out",
      stagger: 0.08,
    })

    // Images — drool-down curtain on scroll
    gsap.utils.toArray<HTMLElement>(".img-mask", mainRef.current).forEach((mask) => {
      gsap.to(mask, {
        yPercent: 100, duration: 1.3, ease: "power4.inOut",
        scrollTrigger: { trigger: mask.parentElement, start: "top 85%" },
      })
    })

    // Body text line reveal
    gsap.utils.toArray<HTMLElement>(".body-text", mainRef.current).forEach((el) => {
      const split = new SplitText(el, { type: "lines" })
      gsap.from(split.lines, {
        opacity: 0, y: 14, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%" },
      })
    })

    // Next project
    const nextSplit = new SplitText(".next-label", { type: "chars" })
    gsap.from(nextSplit.chars, {
      opacity: 0, y: 8, duration: 0.4, ease: "power3.out", stagger: 0.025,
      scrollTrigger: { trigger: ".next-label", start: "top 90%" },
    })

  }, { scope: mainRef, dependencies: [project] })

  if (!project) return null

  const [leftTop, leftBottom, midSingle, fullWidth1, fullWidth2] = project.images

  return (
    <main ref={mainRef} className="flex min-h-screen">

      {/* ── Left sticky panel ── */}
      <aside
        ref={panelRef}
        className="hidden md:flex w-[30vw] shrink-0 sticky top-0 h-screen flex-col justify-between px-8 lg:px-12 py-20 border-r border-secondary/10"
      >
        {/* Top — identity */}
        <div className="flex flex-col gap-6">
          <p className="panel-item text-[10px] font-mono tracking-[0.2em] uppercase opacity-30" style={{ opacity: 0 }}>
            {project.year}
          </p>
          <h1 className="panel-item font-mono font-semibold text-xl leading-snug" style={{ opacity: 0 }}>
            {project.client}
          </h1>
          <div className="panel-item h-px bg-current opacity-10 w-full" style={{ opacity: 0 }} />
          <p className="panel-item text-xs text-secondary/50 leading-relaxed max-w-56" style={{ opacity: 0 }}>
            {project.description}
          </p>
        </div>

        {/* Mid — meta */}
        <div className="flex flex-col gap-5">
          <div className="panel-item flex flex-col gap-1" style={{ opacity: 0 }}>
            <p className="text-[9px] font-mono tracking-[0.2em] uppercase opacity-30">role</p>
            <p className="text-xs capitalize">{project.role}</p>
          </div>

          {project.link && (
            <Link
              href={project.link}
              target="_blank"
              className="panel-item flex items-center gap-1.5 text-xs font-semibold uppercase underline underline-offset-4 hover:opacity-50 transition-opacity w-fit"
              style={{ opacity: 0 }}
            >
              visit
              <GoArrowDownRight className="text-base" />
            </Link>
          )}
        </div>

        {/* Bottom — next */}
        <div className="flex flex-col gap-2">
          <p className="next-label text-[9px] font-mono tracking-[0.2em] uppercase opacity-30">
            next
          </p>
          <Link
            href={`/works/${project.nextProject.slug}`}
            className="next-label flex items-center gap-1 text-xs font-mono font-medium hover:opacity-50 transition-opacity"
          >
            {project.nextProject.title}
            <GoArrowDownRight className="text-sm" />
          </Link>
        </div>
      </aside>

      {/* ── Right scrolling images ── */}
      <div className="flex-1 flex flex-col gap-2">

        {/* Cover */}
        <div className="relative w-full overflow-hidden">
          <img src={project.coverImg} alt={project.title} className="w-full h-auto block" />
          <div className="img-mask absolute inset-0 z-10 bg-background" />
        </div>

        {/* Body copy — appears between images */}
        {project.body.length > 0 && (
          <div className="px-8 lg:px-12 py-16 md:py-20 flex flex-col gap-8 max-w-xl">
            {project.body.map((para, i) => (
              <p key={i} className="body-text text-xs text-secondary/50 leading-relaxed">{para}</p>
            ))}
          </div>
        )}

        {/* Left stack */}
        {[leftTop, leftBottom].filter(Boolean).map((img, i) => (
          <div key={i} className="relative w-full md:w-2/3 overflow-hidden">
            <img src={img} alt="" className="w-full h-auto block" />
            <div className="img-mask absolute inset-0 z-10 bg-background" />
          </div>
        ))}

        {/* Mid single */}
        {midSingle && (
          <div className="relative w-full md:w-1/2 overflow-hidden self-end">
            <img src={midSingle} alt="" className="w-full h-auto block" />
            <div className="img-mask absolute inset-0 z-10 bg-background" />
          </div>
        )}

        {/* Full-width images */}
        {[fullWidth1, fullWidth2].filter(Boolean).map((img, i) => (
          <div key={i} className="relative w-full overflow-hidden">
            <img src={img} alt="" className="w-full h-auto block" />
            <div className="img-mask absolute inset-0 z-10 bg-background" />
          </div>
        ))}

        {/* Mobile-only next project */}
        <div className="md:hidden flex items-center justify-between px-6 py-12 border-t border-secondary/10">
          <span className="text-[9px] font-mono uppercase tracking-widest opacity-30">next</span>
          <Link
            href={`/works/${project.nextProject.slug}`}
            className="flex items-center gap-1 text-xs font-mono font-medium hover:opacity-50 transition-opacity"
          >
            {project.nextProject.title}
            <GoArrowDownRight className="text-sm" />
          </Link>
        </div>

      </div>
    </main>
  )
}