"use client"

import Link from "next/link"
import { useRef, useLayoutEffect } from "react"
import gsap from "gsap"

const contacts = [
  { id: "01", label: "hello@afrobalogun.com", href: "mailto:hello@afrobalogun.com", col: "col-start-1", row: "row-start-2" },
  { id: "02", label: "LinkedIn",              href: "https://www.linkedin.com/in/temiloluwa-obasa-786b7817b/", col: "md:col-start-2", row: "row-start-3 md:row-start-2" },
  { id: "03", label: "+234 706 967 5136",     href: "tel:+2347069675136",           col: "md:col-start-3", row: "row-start-4 md:row-start-3" },
  { id: "04", label: "github",                href: "https://github.com/afroBalogun",           col: "md:col-start-2", row: "row-start-5 md:row-start-4" },
]

export default function Contact() {
  const mainRef   = useRef<HTMLElement>(null)
  const ghostRef  = useRef<HTMLSpanElement>(null)
  const labelRef  = useRef<HTMLDivElement>(null)
  const itemRefs  = useRef<(HTMLDivElement | null)[]>([])
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorX   = useRef(0)
  const cursorY   = useRef(0)
  const raf       = useRef<number>(null)

  /* ── custom cursor lerp ── */
  useLayoutEffect(() => {
    const cursor = cursorRef.current!
    let mouseX = 0, mouseY = 0

    const onMove = (e: MouseEvent) => { mouseX = e.clientX; mouseY = e.clientY }
    window.addEventListener("mousemove", onMove)

    const tick = () => {
      cursorX.current += (mouseX - cursorX.current) * 0.12
      cursorY.current += (mouseY - cursorY.current) * 0.12
      gsap.set(cursor, { x: cursorX.current - 4, y: cursorY.current - 4 })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(raf.current!)
    }
  }, [])

  /* ── entrance animation ── */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // ghost text
      gsap.from(ghostRef.current, {
        opacity: 0, duration: 2.5, ease: "power2.out", delay: 0.2,
      })

      // label
      gsap.from(labelRef.current, {
        y: 16, opacity: 0, duration: 0.9, ease: "power3.out", delay: 0.3,
      })

      // staggered links
      gsap.from(itemRefs.current, {
        y: 24, opacity: 0, duration: 0.8, ease: "power3.out",
        stagger: 0.12, delay: 0.45,
      })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  /* ── magnetic hover ── */
  const handleMouseMove = (e: React.MouseEvent, i: number) => {
    const el = itemRefs.current[i]
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.28
    const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.28
    gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: "power2.out" })

    // cursor expands on link hover
    gsap.to(cursorRef.current, { scale: 4, duration: 0.3, ease: "power2.out" })
  }

  const handleMouseLeave = (i: number) => {
    gsap.to(itemRefs.current[i], { x: 0, y: 0, duration: 0.65, ease: "elastic.out(1, 0.4)" })
    gsap.to(cursorRef.current,   { scale: 1, duration: 0.3, ease: "power2.out" })
  }

  return (
    <>
      {/* custom cursor */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[100] w-2 h-2 rounded-full bg-current pointer-events-none mix-blend-difference"
        style={{ willChange: "transform" }}
      />

      <main
        ref={mainRef}
        className="relative min-h-screen font-mono p-8 md:p-20 flex flex-col justify-end text-neutral-800 overflow-hidden cursor-none"
      >
        {/* ghost background text */}
        <span
          ref={ghostRef}
          aria-hidden
          className="absolute bottom-0 left-0 leading-none font-mono font-bold text-[22vw] tracking-tighter text-current opacity-[0.04] pointer-events-none select-none whitespace-nowrap"
        >
          contact
        </span>

        <div className="relative grid grid-cols-1 md:grid-cols-3 grid-rows-6 md:grid-rows-4 gap-y-10 md:gap-y-16 items-start">

          {/* label */}
          <div ref={labelRef} className="col-start-1 row-start-1 flex flex-col gap-1">
            <p className="text-[9px] tracking-[0.2em] opacity-40 uppercase">(contact)</p>
            <p className="text-[9px] tracking-wide opacity-25 mt-2">— available for work</p>
          </div>

          {/* links */}
          {contacts.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => { itemRefs.current[i] = el }}
              className={`${c.col} ${c.row} flex flex-col gap-2`}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
              style={{ willChange: "transform" }}
            >
              <span className="text-[8px] tracking-widest opacity-30 leading-none">
                — {c.id}
              </span>
              <Link
                href={c.href}
                className="text-sm md:text-base underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity duration-200"
              >
                {c.label}
              </Link>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="relative mt-16 pt-5 border-t border-current/10 flex justify-between items-end">
          <span className="text-[8px] tracking-widest opacity-20">
            © {new Date().getFullYear()}
          </span>
          <span className="text-[8px] tracking-widest opacity-20">
            afroBalogun
          </span>
        </div>
      </main>
    </>
  )
}