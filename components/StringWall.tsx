"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/all"
import { Caveat } from "next/font/google"
import { useEffect, useRef, useState } from "react"
import { CANVAS, HUB, ITEMS, WEB, type Anchor, type Connection, type Edge, type WallItem } from "@/lib/stringWall"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const hand = Caveat({ subsets: ["latin"], weight: ["400", "600"] })

// A gallery-style evidence wall: prints and notes pinned in a loose cluster, taut thread tied corner to corner.
// Layers, back to front: wall, prints/notes, the thread SVG, then pin heads, so threads cross over the prints
// but go under the pins. Thread ends are recomputed every frame from each item's real layout box (offsetLeft/Top/
// Width/Height in canvas px) plus its live GSAP transform, so they stay tied through the intro, parallax and resizes.

type Pt = [number, number]
const COLOUR = { "red-web": "#7C4DFF", hub: "#1E2433" }
const byId = new Map(ITEMS.map((it) => [it.id, it]))
const nameOf = (id: string) => byId.get(id)?.alt ?? id
const isEdge = (t: string | Edge): t is Edge => typeof t !== "string"

// a ragged border for `torn` prints; fixed numbers so server and client render the same shape
const TORN = `polygon(${[
  ...[...Array(13)].map((_, i) => `${i * 8.33}% ${(i * 7) % 3}%`),
  ...[...Array(13)].map((_, i) => `${100 - ((i * 5) % 3)}% ${i * 8.33}%`),
  ...[...Array(13)].map((_, i) => `${100 - i * 8.33}% ${100 - ((i * 11) % 4)}%`),
  ...[...Array(13)].map((_, i) => `${(i * 3) % 3}% ${100 - i * 8.33}%`),
].join(",")})`

// where an item's anchor is right now: its centre, offset by GSAP x/y and the hover lift, then the local
// anchor point scaled and rotated (GSAP applies translate, then rotate, then scale, so this matches the render)
function anchorPoint(el: HTMLElement, a: Anchor, lift: number): Pt {
  const w = el.offsetWidth, h = el.offsetHeight
  const s = Number(gsap.getProperty(el, "scale")), r = (Number(gsap.getProperty(el, "rotation")) * Math.PI) / 180
  const cx = el.offsetLeft + w / 2 + Number(gsap.getProperty(el, "x")), cy = el.offsetTop + h / 2 + Number(gsap.getProperty(el, "y")) + lift
  const lx = (a.includes("l") ? -0.5 : a.includes("r") ? 0.5 : 0) * w * s
  const ly = (a.includes("t") ? -0.5 : a.includes("b") ? 0.5 : 0) * h * s
  return [cx + lx * Math.cos(r) - ly * Math.sin(r), cy + lx * Math.sin(r) + ly * Math.cos(r)]
}
const edgePoint = ({ edge, at }: Edge): Pt => {
  const far = 320 // well past the wall, so the thread visibly leaves the section
  if (edge === "left") return [-far, at * CANVAS.h]
  if (edge === "right") return [CANVAS.w + far, at * CANVAS.h]
  if (edge === "top") return [at * CANVAS.w, -far]
  return [at * CANVAS.w, CANVAS.h + far]
}
const CORNERS: Anchor[] = ["tl", "tr", "br", "bl"]

export default function StringWall({ variant = "red-web" }: { variant?: "red-web" | "hub" }) {
  const sectionRef = useRef<HTMLElement>(null)
  const fitRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState<string | null>(null)
  const activeRef = useRef<string | null>(null)
  // the per-frame thread update reads the hovered item from here (a ref, so it needs no re-render)
  useEffect(() => { activeRef.current = active }, [active])

  const connections: Connection[] = variant === "hub" ? HUB : WEB
  const colour = COLOUR[variant]
  const linked = (id: string) => connections.filter((c) => c.from === id || c.to === id)
  const neighbours = new Set(active ? linked(active).flatMap((c) => [c.from, isEdge(c.to) ? "" : c.to]) : [])

  useGSAP(() => {
    const section = sectionRef.current!, fit = fitRef.current!, canvas = canvasRef.current!, svg = svgRef.current!
    const els = new Map([...canvas.querySelectorAll<HTMLElement>("[data-item]")].map((el) => [el.dataset.item!, el]))
    const lines = [...svg.querySelectorAll<SVGLineElement>(".thread")]
    const knots = [...svg.querySelectorAll<SVGGElement>(".knots")]
    const pins = [...svg.querySelectorAll<SVGGElement>(".pin")]
    els.forEach((el, id) => gsap.set(el, { rotation: byId.get(id)!.rotate }))

    // scale the fixed design canvas to the space it has: full width from 640px up, a 1100px scrollable strip below
    const resize = () => {
      const width = innerWidth < 640 ? 1100 : section.clientWidth
      const k = width / CANVAS.w
      fit.style.width = `${width}px`
      fit.style.height = `${CANVAS.h * k}px`
      canvas.style.transform = `scale(${k})`
      update()
    }

    const lift = (id: string) => (activeRef.current === id ? -3 : 0)
    const visible = (id: string) => (els.get(id)?.offsetWidth ?? 0) > 0
    function update() {
      connections.forEach((c, i) => {
        const line = lines[i], a = els.get(c.from)!
        const show = visible(c.from) && (isEdge(c.to) || visible(c.to))
        line.style.display = knots[i].style.display = show ? "" : "none"
        if (!show) return
        let p: Pt, q: Pt
        if (isEdge(c.to)) {
          q = edgePoint(c.to)
          p = c.fromAnchor ? anchorPoint(a, c.fromAnchor, lift(c.from))
            : CORNERS.map((k) => anchorPoint(a, k, lift(c.from))).reduce((m, x) => (Math.hypot(x[0] - q[0], x[1] - q[1]) < Math.hypot(m[0] - q[0], m[1] - q[1]) ? x : m))
        } else {
          const b = els.get(c.to)!
          if (c.fromAnchor && c.toAnchor) { p = anchorPoint(a, c.fromAnchor, lift(c.from)); q = anchorPoint(b, c.toAnchor, lift(c.to)) }
          else {
            // pick the closest pair among the allowed anchors (any corner when an end isn't specified)
            const pa = c.fromAnchor ? [c.fromAnchor] : CORNERS, qa = c.toAnchor ? [c.toAnchor] : CORNERS
            let best = Infinity; p = q = [0, 0]
            for (const x of pa) for (const y of qa) {
              const P = anchorPoint(a, x, lift(c.from)), Q = anchorPoint(b, y, lift(c.to)), d = Math.hypot(P[0] - Q[0], P[1] - Q[1])
              if (d < best) { best = d; p = P; q = Q }
            }
          }
        }
        line.setAttribute("x1", `${p[0]}`); line.setAttribute("y1", `${p[1]}`)
        line.setAttribute("x2", `${q[0]}`); line.setAttribute("y2", `${q[1]}`)
        const [k1, k2] = knots[i].children
        k1.setAttribute("cx", `${p[0]}`); k1.setAttribute("cy", `${p[1]}`)
        k2.setAttribute("cx", `${q[0]}`); k2.setAttribute("cy", `${q[1]}`)
        k2.setAttribute("visibility", isEdge(c.to) ? "hidden" : "visible")
      })
      // pin heads: top centre, or both top corners, pressed slightly into the paper
      pins.forEach((pin) => {
        const id = pin.dataset.of!, el = els.get(id)!, item = byId.get(id)!
        pin.style.display = visible(id) ? "" : "none"
        const heads = [...pin.children] as SVGGElement[]
        const spots: Anchor[] = item.pin === "top" ? ["t"] : ["tl", "tr"]
        heads.forEach((h, n) => {
          const [x, y] = anchorPoint(el, spots[n], lift(id))
          const inX = item.pin === "top" ? 0 : spots[n] === "tl" ? 7 : -7
          h.setAttribute("transform", `translate(${x + inX} ${y + 7})`)
        })
      })
    }

    const ro = new ResizeObserver(resize)
    ro.observe(section)
    resize()

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    let stopParallax = () => {}
    // follow the items every frame, but only while the wall is on screen
    const tick = () => update()
    ScrollTrigger.create({ trigger: section, start: "top bottom", end: "bottom top", onToggle: (st) => (st.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)) })

    if (!reduce) {
      // pinned one by one, then the thread drawn in (hub threads start at the hub, so they draw outward)
      const items = [...els.values()]
      gsap.timeline({ scrollTrigger: { trigger: section, start: "top 65%", once: true }, onComplete: startParallax })
        .from(items, { opacity: 0, scale: 1.04, y: -8, duration: 0.6, stagger: 0.06, ease: "power3.out" })
        .from(pins.flatMap((p) => [...p.children]), { scale: 0, transformOrigin: "50% 50%", duration: 0.3, stagger: 0.06, ease: "back.out(3)" }, 0.18)
        .fromTo(lines, { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.03, ease: "power2.inOut", clearProps: "strokeDasharray,strokeDashoffset" }, ">-0.2")
        .from(knots, { opacity: 0, duration: 0.3, stagger: 0.03 }, "<0.5")
    }

    // idle parallax: items drift 2–6px with the pointer, by their depth
    function startParallax() {
      if (!matchMedia("(pointer: fine)").matches) return
      const movers = [...els.entries()].map(([id, el]) => ({ d: byId.get(id)!.depth, x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }), y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }) }))
      const onMove = (e: PointerEvent) => {
        const r = section.getBoundingClientRect()
        const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = ((e.clientY - r.top) / r.height) * 2 - 1
        movers.forEach((m) => { m.x(-nx * m.d); m.y(-ny * m.d) })
      }
      section.addEventListener("pointermove", onMove)
      stopParallax = () => section.removeEventListener("pointermove", onMove)
    }

    return () => { ro.disconnect(); gsap.ticker.remove(tick); stopParallax() }
  }, { scope: sectionRef, dependencies: [variant] })

  const pinOf = (it: WallItem) => (
    <g key={it.id} className="pin" data-of={it.id}>
      {(it.pin === "top" ? [0] : [0, 1]).map((n) => (
        <g key={n}>
          <circle r="4" fill="#24211d" />
          <circle cx="-1.2" cy="-1.3" r="1.3" fill="#d9d4ca" />
        </g>
      ))}
    </g>
  )

  return (
    <section ref={sectionRef} aria-labelledby="wall-title" className="relative min-h-[120vh] flex flex-col justify-center overflow-hidden bg-[#EEECE7] py-24">
      <h2 id="wall-title" className="sr-only">The string wall</h2>
      {/* faint plaster grain, and a drywall seam */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.04] bg-[url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E&quot;)]" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-[70%] w-px bg-black/[0.06]" />

      {/* phones: the wall becomes a strip you scroll sideways */}
      <div className="relative max-sm:overflow-x-auto max-sm:snap-x [scrollbar-width:none]">
        <p aria-hidden className={`${hand.className} sm:hidden sticky left-4 mb-3 w-fit -rotate-2 text-xl text-[#3a3530]`}>drag to explore →</p>
        <div ref={fitRef} className="relative mx-auto">
          <div ref={canvasRef} className="absolute left-0 top-0 origin-top-left" style={{ width: CANVAS.w, height: CANVAS.h }}>
            {ITEMS.map((it) => {
              const on = active === it.id, near = neighbours.has(it.id) && !on
              return (
                <button key={it.id} type="button" data-item={it.id}
                  aria-label={it.type === "note" ? `Note: ${it.text?.replace(/\n/g, " ")}` : it.alt}
                  aria-pressed={on}
                  onPointerEnter={() => setActive(it.id)} onPointerLeave={() => setActive(null)}
                  onFocus={() => setActive(it.id)} onBlur={() => setActive(null)}
                  onClick={() => setActive(on ? null : it.id)}
                  className={`absolute block p-0 text-left cursor-pointer outline-none snap-center transition-[translate,box-shadow,filter] duration-300
                    ${on ? "-translate-y-[3px] shadow-[0_2px_4px_rgba(0,0,0,.16),0_14px_28px_rgba(0,0,0,.16)]" : "shadow-[0_1px_2px_rgba(0,0,0,.12),0_6px_14px_rgba(0,0,0,.08)]"}
                    ${near ? "brightness-110 ring-2 ring-[#7C4DFF]/25" : ""}
                    focus-visible:ring-2 focus-visible:ring-[#7C4DFF] focus-visible:ring-offset-4 focus-visible:ring-offset-[#EEECE7]
                    ${it.minor ? "sm:max-lg:hidden" : ""} ${it.type === "note" ? "bg-[#FBF8EE]" : "bg-[#e9e6df]"}`}
                  style={{ left: `${it.x}%`, top: `${it.y}%`, width: it.w, aspectRatio: it.ratio, clipPath: it.torn ? TORN : undefined }}>
                  {it.type === "photo" ? (
                    <>
                      <img src={it.src} alt="" draggable={false} className={`block size-full object-cover ${it.mono ? "grayscale contrast-[1.05]" : ""}`} />
                      {it.worn && <span aria-hidden className="absolute inset-0 shadow-[inset_0_0_28px_rgba(48,32,16,.45)]" />}
                    </>
                  ) : (
                    // px, not rem: the canvas is already scaled as a whole, and the site grows rem on big screens
                    <span className={`${hand.className} block whitespace-pre-line px-[12px] pt-[18px] pb-[12px] text-[17px] leading-[1.15] text-[#2b2723]`}>{it.text}</span>
                  )}
                </button>
              )
            })}

            {/* threads over the prints, knots where they are tied, pin heads on top; all in canvas px */}
            <svg ref={svgRef} aria-hidden className="pointer-events-none absolute inset-0 overflow-visible" width={CANVAS.w} height={CANVAS.h}>
              {connections.map((c, i) => {
                const lit = active !== null && (c.from === active || c.to === active)
                return (
                  <line key={i} className="thread transition-[opacity,stroke-width] duration-300" stroke={colour} strokeLinecap="round" pathLength={1}
                    strokeWidth={lit ? 2 : 1.35} opacity={active === null ? 0.85 : lit ? 1 : 0.25} />
                )
              })}
              {connections.map((_, i) => (
                <g key={i} className="knots" fill={colour}><circle r="2.5" /><circle r="2.5" /></g>
              ))}
              {ITEMS.map(pinOf)}
            </svg>
          </div>
        </div>
      </div>

      <ul className="sr-only">
        {connections.map((c, i) => (
          <li key={i}>{nameOf(c.from)} is connected to {isEdge(c.to) ? `a thread leaving the wall on the ${c.to.edge}` : nameOf(c.to)}.</li>
        ))}
      </ul>
    </section>
  )
}
