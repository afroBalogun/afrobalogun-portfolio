"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import gsap from "gsap"
import Link from "next/link"
import { USE_MOCK, MOCK_PLAYGROUND } from "@/lib/mock"

interface PlaygroundWork {
  _id: string
  index: number
  img: string
  title?: string
  tags: string[]
  link?: string
}

const DRAG_THRESHOLD = 6 // px moved before a press counts as a drag, not a click

let cachedWorks: PlaygroundWork[] | null = USE_MOCK ? MOCK_PLAYGROUND : null

// the deck: each card sits this far (in card widths) right of and below the one before it
const STEP_X = 0.55, STEP_Y = 0.2

export default function Playground() {
  const containerRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previewImgRef = useRef<HTMLImageElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const swipeStartX = useRef(0)
  const swiped = useRef(false)

  const xTarget = useRef(0)
  const xCurrent = useRef(0)
  const maxScroll = useRef(0)
  const raf = useRef<number | null>(null)
  const dragging = useRef(false)
  const dragMoved = useRef(false)
  const dragStartX = useRef(0)
  const dragStartY = useRef(0)
  const dragBaseX = useRef(0)
  const isOpen = useRef(false)

  const [works, setWorks] = useState<PlaygroundWork[]>(cachedWorks ?? [])
  const [selected, setSelected] = useState<PlaygroundWork | null>(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    if (cachedWorks) return

    fetch("/api/playground")
      .then((r) => r.json())
      .then((data: PlaygroundWork[]) => {
        cachedWorks = data
        setWorks(data)
      })
  }, [])

  // scroll limit comes from the rendered track, so it follows the CSS card size at every viewport
  useEffect(() => {
    const track = trackRef.current!
    const measure = () => {
      const last = track.lastElementChild as HTMLElement | null
      const travel = last ? last.offsetLeft * 0.85 : 0
      maxScroll.current = -travel
      xTarget.current = Math.max(maxScroll.current, xTarget.current)
      setScrollable(travel > 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener("resize", measure)
    return () => { ro.disconnect(); window.removeEventListener("resize", measure) }
  }, [works])

  useEffect(() => {
    if (!works.length) return
    const id = setTimeout(() => {
      const cards = trackRef.current?.querySelectorAll<HTMLElement>(".card-inner")
      if (!cards?.length) return
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
      gsap.fromTo(cards,
        { x: (_, el: HTMLElement) => -el.offsetLeft, y: (_, el: HTMLElement) => -el.offsetTop, rotateY: 38, rotateZ: -4 },
        { x: 0, y: 0, rotateY: 0, rotateZ: 0, duration: 1.1, ease: "power4.out", stagger: 0.05, delay: 0.9 }
      )
    }, 50)
    return () => clearTimeout(id)
  }, [works])

  useEffect(() => {
    const tick = () => {
      if (!isOpen.current) {
        xCurrent.current += (xTarget.current - xCurrent.current) * 0.07
        if (trackRef.current) gsap.set(trackRef.current, { x: xCurrent.current, y: xCurrent.current * (STEP_Y / STEP_X) })
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current!)
  }, [])

  // wheel + pointer drag (pointer events cover mouse, pen and touch)
  useEffect(() => {
    const el = containerRef.current!
    const clamp = (v: number) => Math.min(0, Math.max(maxScroll.current, v))
    const moveCursor = cursorRef.current && {
      x: gsap.quickTo(cursorRef.current, "x", { duration: 0.35, ease: "power3.out" }),
      y: gsap.quickTo(cursorRef.current, "y", { duration: 0.35, ease: "power3.out" }),
    }

    const onWheel = (e: WheelEvent) => {
      if (isOpen.current) return
      e.preventDefault()
      xTarget.current = clamp(xTarget.current - (e.deltaX !== 0 ? e.deltaX : e.deltaY))
    }
    const onPointerMove = (e: PointerEvent) => {
      if (moveCursor) { moveCursor.x(e.clientX); moveCursor.y(e.clientY) }
      if (!dragging.current) return
      const dx = e.clientX - dragStartX.current + (e.clientY - dragStartY.current)
      if (Math.abs(dx) > DRAG_THRESHOLD) dragMoved.current = true
      xTarget.current = clamp(dragBaseX.current + dx)
    }
    const onPointerUp = () => { dragging.current = false }

    el.addEventListener("wheel", onWheel, { passive: false })
    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    window.addEventListener("pointercancel", onPointerUp)
    return () => {
      el.removeEventListener("wheel", onWheel)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
      window.removeEventListener("pointercancel", onPointerUp)
    }
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOpen.current) return
    dragging.current = true
    dragMoved.current = false
    dragStartX.current = e.clientX
    dragStartY.current = e.clientY
    dragBaseX.current = xTarget.current
  }

  const showCursor = (on: boolean) => {
    gsap.to(cursorRef.current, { scale: on ? 1 : 0, duration: 0.3, ease: "power3.out" })
  }

  const handleCardClick = useCallback((work: PlaygroundWork) => {
    if (isOpen.current || dragMoved.current) return
    isOpen.current = true
    lastFocus.current = document.activeElement as HTMLElement | null
    setSelected(work)
    gsap.to(cursorRef.current, { scale: 0, duration: 0.2 })

    // animate preview in, then move keyboard focus into it
    requestAnimationFrame(() => {
      if (!modalRef.current) return
      gsap.fromTo(modalRef.current, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" })
      closeRef.current?.focus()
    })
  }, [])

  const handleClose = useCallback(() => {
    if (!modalRef.current) return
    gsap.to(modalRef.current, {
      opacity: 0, duration: 0.25, ease: "power2.in",
      onComplete: () => {
        isOpen.current = false
        setSelected(null)
        lastFocus.current?.focus()
      },
    })
  }, [])

  const step = useCallback((dir: 1 | -1) => {
    setSelected((cur) => {
      if (!cur) return cur
      const i = works.findIndex((w) => w._id === cur._id)
      return works[(i + dir + works.length) % works.length]
    })
  }, [works])

  // keyboard: Esc closes, arrows flip through pieces
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!isOpen.current) return
      if (e.key === "Escape") handleClose()
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [handleClose, step])

  // soft fade/scale each time the shown piece changes
  useEffect(() => {
    if (!selected || !previewImgRef.current) return
    gsap.fromTo(previewImgRef.current, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" })
  }, [selected])

  // swipe left/right on the image area; a swipe must not also count as a click-to-close
  const onPreviewPointerDown = (e: React.PointerEvent) => { swipeStartX.current = e.clientX; swiped.current = false }
  const onPreviewPointerUp = (e: React.PointerEvent) => {
    const dx = e.clientX - swipeStartX.current
    if (Math.abs(dx) > 50) { swiped.current = true; step(dx < 0 ? 1 : -1) }
  }


  return (
    <>
      <main
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative w-screen h-screen overflow-hidden bg-cream text-ink font-mono select-none touch-none cursor-grab active:cursor-grabbing"
      >
        {/* the deck: rounded square cards cascading down to the right, each over the one before; a card lifts on hover
            and its tags show on a lime label above it */}
        <div
          ref={trackRef}
          className="absolute top-[12%] left-[22%] md:left-[30%] will-change-transform [perspective:1400px] [--s:clamp(8rem,22vh,15rem)]"
        >
          {works.map((work, i) => (
            <button
              type="button"
              key={work._id}
              onClick={() => handleCardClick(work)}
              onPointerEnter={() => showCursor(true)}
              onPointerLeave={() => showCursor(false)}
              aria-label={work.title ? `Open ${work.title}` : "Open playground piece"}
              className="card-inner group absolute z-(--z) hover:z-50 focus-visible:z-50 text-left outline-none pointer-fine:cursor-none"
              style={{ left: `calc(var(--s) * ${i * STEP_X})`, top: `calc(var(--s) * ${i * STEP_Y})`, ["--z" as string]: i }}
            >
              <span className="absolute bottom-full left-0 mb-2 max-w-[calc(var(--s)*1.4)] truncate bg-lime px-1.5 py-0.5 text-2xs tracking-widest uppercase opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                {work.tags?.join(" / ")}
              </span>
              <div className="size-(--s) overflow-hidden rounded-[1.1rem] bg-ink/10 shadow-[0_1.5rem_3rem_-1.5rem_rgb(0_0_0/0.45)] transition-transform duration-500 ease-[cubic-bezier(.34,1.5,.64,1)] group-hover:-translate-x-2 group-hover:-translate-y-4 group-focus-visible:-translate-y-4 group-focus-visible:ring-2 group-focus-visible:ring-violet">
                {work.img && (
                  <img src={work.img} alt="" draggable={false} className="size-full object-cover object-top" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* title + hint, in the home hero's language */}
        <div className="absolute bottom-[5%] left-4 sm:left-6 lg:left-12 flex flex-col gap-3 pointer-events-none">
          <p className="text-xs tracking-widest uppercase"><span className="text-[#FF8A3D]">/</span> playground</p>
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <h1 className="font-display font-extrabold [font-stretch:62%] uppercase leading-[0.82] text-[clamp(4rem,13vw,24rem)]">Playground</h1>
            <p className="pb-[1vw] font-inter font-black uppercase leading-[1.25] tracking-tight text-[clamp(0.9rem,1.5vw,2.5rem)]">
              <span className="relative inline-block bg-lime px-[0.2em] -rotate-2">Experiments<sup className="text-violet text-[0.8em]">*</sup></span><br />
              <span className="bg-violet text-cream px-[0.2em]">{scrollable ? "Drag or scroll →" : "Random & rejected"}</span>
            </p>
          </div>
        </div>

        {/* "view" cursor, mouse/pen only */}
        <div
          ref={cursorRef}
          aria-hidden
          className="hidden pointer-fine:flex fixed top-0 left-0 z-40 -ml-8 -mt-8 w-16 h-16 rounded-full bg-lime text-ink items-center justify-center text-2xs tracking-widest uppercase pointer-events-none scale-0"
        >
          view
        </div>
      </main>

      {/* Preview: full-screen, image fitted to the viewport whatever its shape */}
      {selected && (
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title ?? "Playground piece"}
          className="fixed inset-0 z-50 flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 bg-primary/95 backdrop-blur-sm font-mono select-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between text-2xs tracking-widest uppercase">
            <span className="text-[#FF8A3D]">/ playground</span>
            <button ref={closeRef} onClick={handleClose} className="opacity-60 hover:opacity-100 transition-opacity">
              close <span className="hidden pointer-fine:inline opacity-50">(esc)</span>
            </button>
          </div>

          <div
            className="flex-1 min-h-0 grid grid-cols-[auto_1fr_auto] items-center gap-2 sm:gap-6 touch-none"
            onPointerDown={onPreviewPointerDown}
            onPointerUp={onPreviewPointerUp}
          >
            {works.length > 1 ? (
              <button onClick={() => step(-1)} aria-label="Previous piece" className="p-2 text-lg opacity-40 hover:opacity-100 transition-opacity">←</button>
            ) : <span />}
            {/* clicking the empty area around the image closes, like a backdrop */}
            <div
              className="h-full min-h-0 flex items-center justify-center"
              onClick={(e) => { if (e.target === e.currentTarget && !swiped.current) handleClose() }}
            >
              {selected.img
                ? <img ref={previewImgRef} src={selected.img} alt={selected.title ?? ""} draggable={false} className="max-h-full max-w-full object-contain shadow-[0_1.5rem_4rem_-1.5rem_rgb(0_0_0/0.35)]" />
                : <div className="w-full h-full bg-secondary/10" />
              }
            </div>
            {works.length > 1 ? (
              <button onClick={() => step(1)} aria-label="Next piece" className="p-2 text-lg opacity-40 hover:opacity-100 transition-opacity">→</button>
            ) : <span />}
          </div>

          <div className="flex items-center justify-between gap-6 text-2xs tracking-widest uppercase">
            <span className="truncate">
              {selected.title && <span className="mr-3">{selected.title}</span>}
              <span className="bg-lime px-1.5 py-0.5">{selected.tags?.join(" / ")}</span>
            </span>
            {selected.link && (
              <Link
                href={selected.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 shrink-0 hover:opacity-60 transition-opacity"
              >
                <span className="underline underline-offset-4">visit</span>
                <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
