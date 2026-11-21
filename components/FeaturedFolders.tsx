"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { FEATURED, type Case } from "@/lib/featured"

gsap.registerPlugin(useGSAP, ScrollTrigger)

// folder colours from the site palette (lime, violet, ink); the back panel is the same colour, a touch darker
const TONE = ["#BCF975", "#7C4DFF", "#24201F"]

// Featured work as three folders, after the React Bits "Folder" (recreated in CSS, not installed). Hover: the papers
// peek out and the front tips open. Click: the folder opens and its three papers fan out above it, leaning toward the
// pointer; the front paper (the cover) then links to the case study.
export default function FeaturedFolders() {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return
    // clearProps so the finished folders carry no leftover transform
    gsap.from(".folder-cell", {
      opacity: 0, y: 30, duration: 0.8, stagger: 0.12, ease: "power3.out", clearProps: "opacity,transform",
      scrollTrigger: { trigger: ref.current, start: "top 70%", once: true },
    })
  }, { scope: ref })

  return (
    <section ref={ref} aria-labelledby="featured-title" className="bg-cream text-ink px-4 sm:px-6 lg:px-12 py-20 lg:py-24">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <h2 id="featured-title" className="scroll-mt-28 font-display uppercase leading-none text-[clamp(2.25rem,3.4vw,9rem)]">Featured case studies</h2>
        <Link href="/works" className="font-display uppercase text-lg tracking-wide whitespace-nowrap hover:text-violet transition-colors">[ View works ]</Link>
      </div>
      {/* the top padding leaves room for the papers to fan out above an open folder */}
      <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 justify-items-center gap-x-8 gap-y-6 pt-40">
        {FEATURED.map((c, i) => (
          <li key={c.slug} className="folder-cell flex flex-col items-center max-sm:pt-36 max-sm:first:pt-0">
            <Folder c={c} i={i} />
          </li>
        ))}
      </ul>
    </section>
  )
}

function Folder({ c, i }: { c: Case; i: number }) {
  const [open, setOpen] = useState(false)
  const [pull, setPull] = useState([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }])
  const ref = useRef<HTMLDivElement>(null)
  const r = c.results[0]
  const colour = TONE[i % TONE.length]

  const close = () => { setOpen(false); setPull([{ x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }]) }
  // close on a click elsewhere or Escape
  useEffect(() => {
    if (!open) return
    const away = (e: PointerEvent) => { if (!ref.current?.contains(e.target as Node)) close() }
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") close() }
    document.addEventListener("pointerdown", away)
    document.addEventListener("keydown", esc)
    return () => { document.removeEventListener("pointerdown", away); document.removeEventListener("keydown", esc) }
  }, [open])

  // an open folder's papers lean a little toward the pointer
  const lean = (k: number) => (e: React.PointerEvent<HTMLElement>) => {
    if (!open || e.pointerType !== "mouse") return
    const b = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - (b.left + b.width / 2)) * 0.15, y = (e.clientY - (b.top + b.height / 2)) * 0.15
    setPull((p) => p.map((v, n) => (n === k ? { x, y } : v)))
  }
  const unlean = (k: number) => () => setPull((p) => p.map((v, n) => (n === k ? { x: 0, y: 0 } : v)))

  // the three papers, back to front: size, colour, and the transform that fans them out when the folder is open
  const PAPER = [
    { size: "w-[70%] h-[80%]", bg: "#e4e1d9", fan: "translate(-120%,-70%) rotate(-15deg)" },
    { size: "w-[80%] h-[70%]", bg: "#efece5", fan: "translate(10%,-70%) rotate(15deg)" },
    { size: "w-[90%] h-[60%]", bg: "#ffffff", fan: "translate(-50%,-100%) rotate(5deg)" },
  ]
  return (
    <div ref={ref} className="flex flex-col items-center gap-6">
      <div className={`group relative transition-transform duration-200 ease-in ${open ? "" : "hover:-translate-y-2"}`}>
        <button type="button" aria-expanded={open} aria-label={`${open ? "Close" : "Open"} the ${c.title} folder`}
          onClick={() => (open ? close() : setOpen(true))}
          className="absolute inset-0 z-40 cursor-pointer rounded-[0.6rem] outline-none focus-visible:ring-2 focus-visible:ring-violet focus-visible:ring-offset-4 focus-visible:ring-offset-cream" />

        <div className="relative w-[12rem] h-[9.6rem]">
          {/* back panel and its tab, a touch darker than the front (own layers, so the filter doesn't reach the papers) */}
          <span aria-hidden className="absolute inset-0 rounded-[0_0.6rem_0.6rem_0.6rem] brightness-[0.92]" style={{ background: colour }} />
          <span aria-hidden className="absolute bottom-[98%] left-0 w-[30%] h-[12%] rounded-[0.3rem_0.3rem_0_0] brightness-[0.92]" style={{ background: colour }} />
          <span className="absolute left-[0.6rem] bottom-[101%] z-10 font-mono text-2xs leading-none">{String(i + 1).padStart(2, "0")}</span>

          {/* the three papers: role card, result card, then the cover in front */}
          {[0, 1, 2].map((k) => (
            <div key={k} onPointerMove={lean(k)} onPointerLeave={unlean(k)}
              className={`absolute bottom-[10%] left-1/2 z-20 overflow-hidden rounded-[0.6rem] shadow-[0_2px_6px_rgba(0,0,0,.12)] transition-[transform,translate] duration-300 ease-in-out ${PAPER[k].size} ${open ? "z-50 hover:scale-110" : "[transform:translate(-50%,10%)] group-hover:[transform:translate(-50%,0)]"}`}
              style={{ transform: open ? PAPER[k].fan : undefined, translate: `${pull[k].x}px ${pull[k].y}px`, background: PAPER[k].bg }}>
              {k === 0 && (
                <p className="p-2 font-mono text-[0.6rem] leading-snug opacity-70">{c.role}<br />{c.year}</p>
              )}
              {k === 1 && (
                <p className="flex h-full flex-col justify-end p-2 font-mono text-[0.6rem] uppercase leading-tight">
                  <span className="font-display text-2xl leading-none text-violet">{r.value}</span>{r.label}
                </p>
              )}
              {k === 2 && (
                <Link href={`/works/${c.slug}`} tabIndex={open ? 0 : -1} aria-hidden={!open} aria-label={`Read the ${c.title} case study`}
                  className="block size-full p-[0.35rem] outline-none focus-visible:ring-2 focus-visible:ring-violet">
                  <img src={c.cover} alt="" className="size-full rounded-[0.35rem] object-cover object-top" />
                </Link>
              )}
            </div>
          ))}

          {/* the front, in two halves that tip apart */}
          <span aria-hidden className={`absolute inset-0 z-30 origin-bottom rounded-[0.3rem_0.6rem_0.6rem_0.6rem] transition-transform duration-300 ease-in-out ${open ? "[transform:skew(15deg)_scaleY(0.6)]" : "group-hover:[transform:skew(15deg)_scaleY(0.6)]"}`} style={{ background: colour }} />
          <span aria-hidden className={`absolute inset-0 z-30 origin-bottom rounded-[0.3rem_0.6rem_0.6rem_0.6rem] transition-transform duration-300 ease-in-out ${open ? "[transform:skew(-15deg)_scaleY(0.6)]" : "group-hover:[transform:skew(-15deg)_scaleY(0.6)]"}`} style={{ background: colour }} />
        </div>
      </div>

      {/* the label under each folder */}
      <div className="text-center">
        <Link href={`/works/${c.slug}`} className="font-display uppercase text-2xl leading-none hover:text-violet transition-colors">{c.title}</Link>
        <p className="mt-1 font-mono text-2xs uppercase tracking-widest opacity-60">{c.role} · {c.year}</p>
        <p className="mt-1 font-mono text-xs font-bold text-violet">{r.value} {r.label}</p>
      </div>
    </div>
  )
}
