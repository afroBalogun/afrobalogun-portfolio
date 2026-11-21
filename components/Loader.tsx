"use client"
import gsap from "gsap"
import { useEffect, useRef, useState } from "react"
import { FEATURED } from "@/lib/featured"

const FRAMES = FEATURED.map((c) => c.cover)

// Every full page load: work covers flip behind a halftone sticker that resolves to colour,
// then the sticker flies onto the page's portrait (any element marked data-loader-target), dissolves into it, and the
// site takes over. With no target on screen the loader simply fades away.
export default function Loader() {
  const rootRef = useRef<HTMLDivElement>(null)
  const finishRef = useRef<() => void>(() => {})
  const [frame, setFrame] = useState(0)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    const html = document.documentElement
    const root = rootRef.current!
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches
    const flip = reduce ? 0 : window.setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 180)
    html.style.overflow = "hidden"

    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearInterval(flip); clearTimeout(cap)
      const say = (name: string) => () => window.dispatchEvent(new Event(name))
      const tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = ""
          say("site:loaded")() // the page's own portrait shows in this same frame, under the sticker
          setGone(true)
        },
      })
      tl.to(".loader-colour", { opacity: 1, duration: reduce ? 0.2 : 0.7, ease: "power2.inOut" })

      // land on the page's portrait, if this page has one on screen
      const target = [...document.querySelectorAll<HTMLElement>("[data-loader-target]")].find((el) => el.offsetWidth)
      const b = target?.getBoundingClientRect()
      if (target && b && !reduce && b.bottom > 0 && b.top < innerHeight) {
        // morph, not scale: pin the sticker where it is, then tween its box and corner radius onto the target's
        const sticker = root.querySelector<HTMLElement>(".loader-sticker")!
        const a = sticker.getBoundingClientRect()
        const radius = Math.min(parseFloat(getComputedStyle(target).borderRadius) || 0, b.height / 2)
        tl.set(sticker, { position: "fixed", left: a.left, top: a.top, width: a.width, height: a.height, margin: 0, borderRadius: a.width * 0.06 }, "+=0.15")
          .call(say("site:landing")) // the page starts assembling around the sticker while it flies
          .to(sticker, { left: b.left, top: b.top, width: b.width, height: b.height, borderRadius: radius, boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 1.1, ease: "expo.inOut" })
          .to(".loader-bg", { opacity: 0, duration: 0.8, ease: "power2.inOut" }, "<0.1")
          .to(".loader-caption", { opacity: 0, duration: 0.3 }, "<")
          // the photo dissolves into whatever it landed on
          .to(sticker, { opacity: 0, duration: 0.6, ease: "power1.inOut" })
      } else {
        tl.call(say("site:landing"), [], "+=0.15").to(root, { opacity: 0, duration: 0.5 })
      }
    }
    finishRef.current = finish

    // wait for fonts + page load, but show the resolve for at least 1.5s and never trap anyone past 4s
    const t0 = performance.now()
    const cap = window.setTimeout(finish, 4000)
    const loaded = new Promise((r) => (document.readyState === "complete" ? r(0) : addEventListener("load", r, { once: true })))
    Promise.all([document.fonts.ready, loaded]).then(() => setTimeout(finish, Math.max(0, 1500 - (performance.now() - t0))))

    return () => { clearInterval(flip); clearTimeout(cap); html.style.overflow = "" }
  }, [])

  if (gone) return null
  return (
    <div id="loader" ref={rootRef} onClick={() => finishRef.current()} aria-hidden className="fixed inset-0 z-[100] grid place-items-center cursor-pointer">
      <div className="loader-bg absolute inset-0 bg-secondary">
        {FRAMES.map((src, i) => (
          <img key={src} src={src} alt="" className={`absolute inset-0 size-full object-cover ${i === frame ? "" : "opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative flex flex-col items-center gap-4">
        <div className="loader-sticker relative w-[min(62vw,22rem)] aspect-square rounded-[6%] overflow-hidden bg-white shadow-2xl">
          <img src="/sticker-halftone.png" alt="" className="absolute inset-0 size-full object-cover" />
          <img src="/sticker.jpg" alt="" className="loader-colour absolute inset-0 size-full object-cover opacity-0" />
        </div>
        <p className="loader-caption bg-secondary px-2 py-1 font-mono text-2xs uppercase tracking-widest text-primary">afroBalogun — tap to skip</p>
      </div>
    </div>
  )
}
