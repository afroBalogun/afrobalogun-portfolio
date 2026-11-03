"use client"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { useRef, useEffect, useState } from "react"

gsap.registerPlugin(useGSAP)

export default function Home() {
  const homeRef = useRef<HTMLDivElement>(null)
  const mask1Ref = useRef<HTMLDivElement>(null)
  const mask2Ref = useRef<HTMLDivElement>(null)
  const lbl1Ref = useRef<HTMLHeadingElement>(null)
  const lbl2Ref = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline()

    // 1. Brush-stroke reveal: masks wipe from right → left over images
    tl.to(mask1Ref.current, {
      scaleX: 0,
      duration: 1.1,
      ease: "power4.inOut",
      transformOrigin: "right center",
    })
      .to(mask2Ref.current, {
        scaleX: 0,
        duration: 1.1,
        ease: "power4.inOut",
        transformOrigin: "right center",
      }, "-=0.75") // overlap so both wipe in quick succession

      // 2. Typewriter for name labels
      .call(() => typeOut(lbl1Ref.current!, "Obasa\nTemiloluwa", 55), [], "+=0.05")
      .call(() => typeOut(lbl2Ref.current!, "afroBalogun", 65), [], "+=0.4")

      // 3. Hero paragraphs fade + drift up
      .from("#topname, #botname", {
        opacity: 0,
        y: 12,
        duration: 0.8,
        stagger: 0.18,
        ease: "power3.out",
      }, "+=0.6")

      // 4. Quotes cascade in
      .from(".quote-text", {
        opacity: 0,
        y: 10,
        duration: 0.9,
        stagger: 0.2,
        ease: "power3.out",
      }, "-=0.3")

      // 5. Footer meta floats up last
      .from(".meta-item", {
        opacity: 0,
        y: 8,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      }, "-=0.4")

      // 6. A beat after everything settles, the images come alive (CSS animations gated on .alive)
      .call(() => homeRef.current?.classList.add("alive"), [], "+=1.2")

    // from() has applied its start states above, so it's now safe to show the SSR-hidden page
    gsap.set(homeRef.current, { visibility: "visible" })
  }, { scope: homeRef })

  return (
    <main className="min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-12 flex flex-col justify-between" ref={homeRef} style={{ visibility: "hidden" }}>

      {/* Quotes */}
      <div className="flex max-sm:flex-col justify-between max-sm:w-full mt-10 max-lg:mb-12">
        <div className="lg:absolute lg:top-1/5 max-sm:mt-5">
          <p className="quote-text text-2xs lg:text-xs font-extralight uppercase md:w-65 max-md:w-56">
            "Put your name on everything you do."<br />
            <span className="font-semibold">— Mark Perrett</span>
          </p>
        </div>
        <div className="mt-6 sm:mt-8 lg:mt-0 lg:absolute lg:right-20 lg:bottom-1/3 max-sm:flex max-sm:justify-end">
          <p className="quote-text text-2xs lg:text-xs font-extralight uppercase md:w-65 max-md:w-56 text-right">
            "Every great design begins with an even better story."<br />
            <span className="font-semibold">— Lorinda Mamo</span>
          </p>
        </div>
      </div>

      {/* Hero */}
      <section className="w-full flex-1 flex flex-col justify-center-safe max-md:items-center gap-5 lg:gap-8 relative">

        <p id="topname" className="text-xs lg:text-sm font-light uppercase text-center">
          <span className="font-semibold">Temiloluwa Obasa,</span> (he/him) <br />
          content writer, music enthusiast.
        </p>

        <div className="font-mono w-full flex flex-row flex-nowrap items-start justify-center gap-1 relative py-8 sm:py-16">

          {/* Image 1 */}
          <article className="relative w-fit flex items-center justify-center">
            <h4 className="z-10 absolute top-0 text-xs left-2 max-sm:left-4 max-sm:top-3 font-semibold" ref={lbl1Ref} style={{ whiteSpace: "pre" }} />
            <div className="relative overflow-hidden">
              {/* tail box measured from neko.png (215x309): x 78–132, y ≥ 216, where the PNG is transparent around it */}
              <div className="relative pointer-events-none scale-90 max-sm:scale-80">
                <img src="neko.png" alt="cat" className="block w-[13.4375rem]" style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 61.4% 100%, 61.4% 70.6%, 36.3% 70.6%, 36.3% 100%, 0 100%)" }} />
                <img
                  src="neko.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full motion-safe:in-[.alive]:animate-tail-sway"
                  style={{ clipPath: "inset(69.9% 38.6% 0 36.3%)", transformOrigin: "50.2% 69.9%" }}
                />
                {/* ears: a grey patch hides the original ear tip (not the base, so tilting shows no seam) and the copy flattens toward its base */}
                <div className="absolute bg-[#D9D9D9]" style={{ inset: "27.8% 54.9% 68.6% 36.3%" }} />
                <img
                  src="neko.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full motion-safe:in-[.alive]:animate-ear-twitch-l"
                  style={{ clipPath: "inset(27.8% 54.9% 67.6% 36.3%)", transformOrigin: "42.3% 32.4%", animationDelay: "1.6s" }}
                />
                <div className="absolute bg-[#D9D9D9]" style={{ inset: "27.2% 40.9% 69.3% 51.2%" }} />
                <img
                  src="neko.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full motion-safe:in-[.alive]:animate-ear-twitch-r"
                  style={{ clipPath: "inset(27.2% 40.9% 68.3% 51.2%)", transformOrigin: "54% 31.7%", animationDelay: "3.4s" }}
                />
              </div>
              {/* Brush mask — covers image, animates to scaleX(0) */}
              <div
                ref={mask1Ref}
                className="absolute inset-0 bg-white dark:bg-black"
                style={{ transformOrigin: "right center" }}
              />
            </div>
          </article>

          {/* Image 2 */}
          <article className="relative w-fit flex items-center justify-center pt-2 sm:pt-1">
            <h4 className="z-10 absolute bottom-3 text-xs right-3 max-sm:right-4 max-sm:bottom-4 font-semibold text-[#C1C1C1]" ref={lbl2Ref} />
            <div className="relative overflow-hidden">
              <div className="relative pointer-events-none scale-90 max-sm:scale-80">
                <img src="balo.png" alt="afrobalogun silhouette" className="block w-[13.4375rem]" />
                {/* figure starts at y=62 of 215; clipping above it keeps the moving top edge inside flat background */}
                <img
                  src="balo.png"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full origin-bottom motion-safe:in-[.alive]:animate-breathe"
                  style={{ clipPath: "inset(20% 0 0 0)", animationDelay: "0.8s" }}
                />
              </div>
              <div
                ref={mask2Ref}
                className="absolute inset-0 bg-white dark:bg-black"
                style={{ transformOrigin: "right center" }}
              />
            </div>
          </article>

        </div>

        <p id="botname" className="text-xs lg:text-sm font-light uppercase text-center">
          <span className="font-semibold">afroBalogun</span>, creative developer and <br />
          full-stack engineer.
        </p>

      </section>

      {/* Meta */}
      <div className="flex flex-col sm:flex-row justify-around items-end gap-6 mt-8">
        <p className="meta-item text-xs hidden md:block">
          Based in Nigeria · <WatClock /> WAT.<br />
          <span className="ml-5">Available for work.</span>
        </p>
        <div className="meta-item hidden md:block">
          <h6 className="font-semibold text-xs mb-1">Inquiries & Proposals.</h6>
          <p className="text-2xs opacity-80">Reach out to start a technical consultation.</p>
        </div>
      </div>

    </main>
  )
}

// Live time in Lagos; empty until mounted so the build-time HTML doesn't bake in a stale time
const watFormat = new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit" })
function WatClock() {
  const [time, setTime] = useState("")
  useEffect(() => {
    const tick = () => setTime(watFormat.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return <time className="tabular-nums">{time}</time>
}

// Typewriter utility
function typeOut(el: HTMLElement, text: string, speed: number) {
  el.textContent = ""
  let i = 0
  const tick = () => {
    el.textContent += text[i++]
    if (i < text.length) setTimeout(tick, speed)
  }
  tick()
}