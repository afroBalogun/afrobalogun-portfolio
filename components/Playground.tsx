"use client"
import { useRef, useEffect, useState, useCallback } from "react"
import gsap from "gsap"
import Link from "next/link"

interface PlaygroundWork {
  _id: string
  index: number
  img: string
  title?: string
  tags: string[]
  link?: string
}

const DRAG_THRESHOLD = 6 // px moved before a press counts as a drag, not a click

let cachedWorks: PlaygroundWork[] | null = null

function buildRows(data: PlaygroundWork[]): PlaygroundWork[][] {
  return [
    data.filter((_, i) => i % 2 === 0),
    data.filter((_, i) => i % 2 === 1),
  ]
}

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
  const dragBaseX = useRef(0)
  const isOpen = useRef(false)

  const [works, setWorks] = useState<PlaygroundWork[]>(cachedWorks ?? [])
  const [rows, setRows] = useState<PlaygroundWork[][]>(
    cachedWorks ? buildRows(cachedWorks) : [[], []]
  )
  const [selected, setSelected] = useState<PlaygroundWork | null>(null)
  const [scrollable, setScrollable] = useState(false)

  useEffect(() => {
    if (cachedWorks) return

    fetch("/api/playground")
      .then((r) => r.json())
      .then((data: PlaygroundWork[]) => {
        cachedWorks = data
        setWorks(data)
        setRows(buildRows(data))
      })
  }, [])

  // scroll limit comes from the rendered track, so it follows the CSS card size at every viewport
  useEffect(() => {
    const track = trackRef.current!
    const measure = () => {
      const overflow = track.scrollWidth + 2 * track.offsetLeft - window.innerWidth
      maxScroll.current = -Math.max(0, overflow)
      xTarget.current = Math.max(maxScroll.current, xTarget.current)
      setScrollable(overflow > 0)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(track)
    window.addEventListener("resize", measure)
    return () => { ro.disconnect(); window.removeEventListener("resize", measure) }
  }, [rows])

  useEffect(() => {
    if (!works.length) return
    const id = setTimeout(() => {
      const cards = trackRef.current?.querySelectorAll<HTMLElement>(".card-inner")
      if (!cards?.length) return
      gsap.fromTo(cards,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power3.out", stagger: { amount: 0.3, from: "start" } }
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
      const dx = e.clientX - dragStartX.current
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

  const selectedIndex = selected ? works.findIndex((w) => w._id === selected._id) : -1

  return (
    <>
      <main
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative w-screen h-screen overflow-hidden font-mono select-none touch-none cursor-grab active:cursor-grabbing"
      >
        {/* Track: card height follows the viewport; 16:10 suits site screenshots */}
        <div
          ref={trackRef}
          className="absolute top-[15%] left-4 sm:left-6 lg:left-12 flex flex-col gap-8 will-change-transform [--card-h:clamp(7rem,24vh,15rem)]"
          style={{ width: "max-content" }}
        >
          {rows.map((row, ri) => (
            // second row is offset by half a card so the grid reads as a scattered collection
            <div key={ri} className={`flex gap-10 ${ri === 1 ? "ml-[calc(var(--card-h)*0.8)]" : ""}`}>
              {row.map((work) => (
                <button
                  type="button"
                  key={work._id}
                  onClick={() => handleCardClick(work)}
                  onPointerEnter={() => showCursor(true)}
                  onPointerLeave={() => showCursor(false)}
                  aria-label={work.title ? `Open ${work.title}` : `Open playground piece ${works.indexOf(work) + 1}`}
                  className="card-inner group flex flex-col gap-2 text-left pointer-fine:cursor-none"
                  style={{ opacity: 0 }}
                >
                  <div className="h-(--card-h) aspect-16/10 overflow-hidden bg-secondary/10">
                    {work.img && (
                      <img
                        src={work.img}
                        alt=""
                        draggable={false}
                        className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="flex justify-between gap-4 text-2xs tracking-widest uppercase">
                    <span className="opacity-40">{String(works.indexOf(work) + 1).padStart(2, "0")}</span>
                    <span className="opacity-0 group-hover:opacity-60 group-focus-visible:opacity-60 transition-opacity duration-300 truncate">
                      {work.tags?.join(" / ")}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ))}
        </div>

        {/* Title + hint, styled like /works */}
        <div className="absolute bottom-[8%] left-4 sm:left-6 lg:left-12 flex flex-col gap-3 pointer-events-none">
          <h2 className="font-semibold text-4xl tracking-[0.2em] opacity-20">playground</h2>
          <p className="text-2xs tracking-widest uppercase opacity-50">
            {works.length > 0 && `${String(works.length).padStart(2, "0")} pieces`}
            {scrollable && " · drag or scroll →"}
          </p>
        </div>

        {/* "view" cursor, mouse/pen only */}
        <div
          ref={cursorRef}
          aria-hidden
          className="hidden pointer-fine:flex fixed top-0 left-0 z-40 -ml-8 -mt-8 w-16 h-16 rounded-full bg-secondary text-primary items-center justify-center text-2xs tracking-widest uppercase pointer-events-none scale-0"
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
          aria-label={selected.title ?? `Playground piece ${selectedIndex + 1}`}
          className="fixed inset-0 z-50 flex flex-col gap-4 sm:gap-6 px-4 sm:px-6 lg:px-12 py-6 sm:py-8 bg-primary/95 backdrop-blur-sm font-mono select-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between text-2xs tracking-widest uppercase">
            <span className="opacity-50 tabular-nums">
              {String(selectedIndex + 1).padStart(2, "0")} / {String(works.length).padStart(2, "0")}
            </span>
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
              <span className="opacity-60">{selected.tags?.join(" / ")}</span>
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
