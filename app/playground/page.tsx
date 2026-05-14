"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import gsap from "gsap"
import Link from "next/link"

interface PlaygroundWork {
  _id: string
  index: number
  img: string
  tags: string[]
  link: string
}

const CARD_W = 100
const CARD_H = 120
const GAP    = 64

const staticTags = [
  { label: "(random designs)",    left: "8%",  top: "72%" },
  { label: "(explorations)",      left: "30%", top: "76%" },
  { label: "(rejected versions)", left: "54%", top: "72%" },
]

export default function Playground() {
  const containerRef  = useRef<HTMLDivElement>(null)
  const trackRef      = useRef<HTMLDivElement>(null)
  const modalRef      = useRef<HTMLDivElement>(null)

  const xTarget    = useRef(0)
  const xCurrent   = useRef(0)
  const maxScroll  = useRef(0)
  const raf        = useRef<number | null>(null)
  const dragging   = useRef(false)
  const dragStartX = useRef(0)
  const dragBaseX  = useRef(0)
  const isOpen     = useRef(false)

  const [works, setWorks]       = useState<PlaygroundWork[]>([])
  const [rows, setRows]         = useState<PlaygroundWork[][]>([[], [], []])
  const [selected, setSelected] = useState<PlaygroundWork | null>(null)

  useEffect(() => {
    fetch("/api/playground")
      .then((r) => r.json())
      .then((data: PlaygroundWork[]) => {
        setWorks(data)
        setRows([
          data.filter((_, i) => i % 3 === 0),
          data.filter((_, i) => i % 3 === 1),
          data.filter((_, i) => i % 3 === 2),
        ])
      })
  }, [])

  useEffect(() => {
    const longestRow = Math.max(...rows.map((r) => r.length), 0)
    maxScroll.current = -(longestRow * (CARD_W + GAP) - window.innerWidth * 0.66)
  }, [rows])

  useEffect(() => {
    if (!works.length) return
    const id = setTimeout(() => {
      const cards = trackRef.current?.querySelectorAll<HTMLElement>(".card-inner")
      if (!cards?.length) return
      gsap.fromTo(cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: { amount: 0.2, from: "start" } }
      )
    }, 50)
    return () => clearTimeout(id)
  }, [works])

  useEffect(() => {
    const tick = () => {
      if (!isOpen.current) {
        xCurrent.current += (xTarget.current - xCurrent.current) * 0.07
        if (trackRef.current) gsap.set(trackRef.current, { x: xCurrent.current })
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current!)
  }, [])

  useEffect(() => {
    const el = containerRef.current!
    const clamp = (v: number) => Math.min(0, Math.max(maxScroll.current, v))

    const onWheel = (e: WheelEvent) => {
      if (isOpen.current) return
      e.preventDefault()
      xTarget.current = clamp(xTarget.current - (e.deltaX !== 0 ? e.deltaX : e.deltaY))
    }
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return
      xTarget.current = clamp(dragBaseX.current + (e.pageX - dragStartX.current))
    }
    const onMouseUp = () => { dragging.current = false }

    el.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
    return () => {
      el.removeEventListener("wheel", onWheel)
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
  }, [])

  // close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isOpen.current) return
    dragging.current   = true
    dragStartX.current = e.pageX
    dragBaseX.current  = xTarget.current
  }

  const handleCardClick = useCallback((e: React.MouseEvent, work: PlaygroundWork) => {
    e.stopPropagation()
    if (isOpen.current) return
    isOpen.current = true
    setSelected(work)

    // animate modal in
    requestAnimationFrame(() => {
      if (!modalRef.current) return
      gsap.fromTo(modalRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }
      )
    })
  }, [])

  const handleClose = useCallback(() => {
    if (!modalRef.current) return
    gsap.to(modalRef.current, {
      opacity: 0, y: 16, duration: 0.3, ease: "power2.in",
      onComplete: () => {
        isOpen.current = false
        setSelected(null)
      },
    })
  }, [])

  return (
    <main
      ref={containerRef}
      onMouseDown={handleMouseDown}
      className="relative w-screen h-screen overflow-hidden font-mono select-none cursor-grab active:cursor-grabbing"
    >
      {/* Track */}
      <div
        ref={trackRef}
        className="absolute top-[14%] h-[55%] flex flex-col justify-between py-2 will-change-transform"
        style={{ left: "33%", width: "max-content" }}
      >
        {rows.map((row, ri) => (
          <div key={ri} className="flex items-end" style={{ gap: GAP }}>
            {row.map((work) => (
              <div
                key={work._id}
                className="flex flex-col gap-2 cursor-pointer"
                onClick={(e) => handleCardClick(e, work)}
              >
                <span className="text-[9px] tracking-widest text-neutral-400 leading-none pointer-events-none">
                  {String(work.index).padStart(2, "0")}
                </span>
                <div
                  className="card-inner overflow-hidden bg-neutral-800 hover:bg-neutral-700 transition-colors duration-200"
                  style={{ width: CARD_W, height: CARD_H, opacity: 0 }}
                >
                  {work.img && (
                    <img src={work.img} alt="" className="w-full h-full object-cover pointer-events-none" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Label */}
      <div className="absolute bottom-[22%] left-10 pointer-events-none">
        <span className="text-2xl tracking-[0.16em] text-neutral-500">playground</span>
      </div>

      {/* Static tags */}
      {staticTags.map((tag) => (
        <span
          key={tag.label}
          className="absolute text-[9px] tracking-wide text-neutral-400 whitespace-nowrap pointer-events-none"
          style={{ left: tag.left, top: tag.top }}
        >
          {tag.label}
        </span>
      ))}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60" onClick={handleClose} />

          {/* Panel */}
          <div
            ref={modalRef}
            className="relative z-10 flex flex-col w-[min(900px,90vw)] h-[min(720px,85vh)] bg-primary border border-neutral-800"
            style={{ opacity: 0 }}
          >
            {/* Meta */}
            <div className="flex  justify-between items-start p-8 md:p-16 w-full gap-10">
              <div className="flex flex-col gap-6">
                {/* index */}

                {/* tags */}
                {selected.tags?.length > 0 && (
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[9px] tracking-[0.2em] uppercase text-neutral-600">tags</p>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selected.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] tracking-widest uppercase border border-neutral-700 px-2 py-1 text-neutral-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col-reverse gap-6">
                {/* visit link */}
                {selected.link && (
                  <Link
                    href={selected.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-secondary hover:text-secondary/60 transition-colors w-fit"
                  >
                    <span className="underline underline-offset-4">visit</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                  </Link>
                )}

                {/* close */}
                <button
                  onClick={handleClose}
                  className="text-[9px] tracking-[0.2em] uppercase text-neutral-600 hover:text-neutral-300 transition-colors text-left"
                >
                  close
                </button>
              </div>
            </div>

            {/* Image */}
            <div className="w-full shrink-0 overflow-hidden flex justify-center px-8 md:px-16">
              {selected.img
                ? <img src={selected.img} alt="" className="w-full h-auto object-contain" />
                : <div className="w-full h-full bg-neutral-800" />
              }
            </div>

            
          </div>
        </div>
      )}
    </main>
  )
}