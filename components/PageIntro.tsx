"use client"
import { usePathname } from "next/navigation"
import { useEffect } from "react"

// A short intro card for whichever page is being entered, on the first load and on every navigation: an ink panel
// names the page (a tilted lime tag, then the title in big condensed letters rising one by one) while an orange bar
// fills; then it slides up, and a lime band and a violet band behind it follow a beat apart, wiping the page in the
// palette. Keyed by the path, so each navigation remounts it and replays the CSS animation (keyframes in globals.css).
// It keeps the id "loader" so the hero waits for "site:landing" (sent as the ink panel starts to leave) before its intro.
const HOLD = 750 // ms until the ink panel starts to leave; matches 55% of .page-intro-band's 1.4s

export default function PageIntro() {
  const pathname = usePathname()

  useEffect(() => {
    // note when the panel lifts, so a hero that mounts late can tell it missed the signal (components/Hero.tsx)
    ;(window as unknown as { __introAt?: number }).__introAt = performance.now() + HOLD
    const t = setTimeout(() => window.dispatchEvent(new Event("site:landing")), HOLD)
    return () => clearTimeout(t)
  }, [pathname])

  if (pathname.includes("admin")) return null
  const parts = pathname.split("/").filter(Boolean)
  const title = parts.length ? parts[parts.length - 1].replace(/-/g, " ") : "afroBalogun"
  const over = parts.length > 1 ? parts[0] : parts.length ? "afroBalogun" : "Home"
  // sized so the longest word always fits the width (condensed caps run about half an em each); words never break
  const longest = Math.max(...title.split(" ").map((w) => w.length))
  const size = `min(30rem, 16vw, ${(86 / (longest * 0.52)).toFixed(2)}vw)`

  return (
    <div key={pathname} id="loader" aria-hidden className="fixed inset-0 z-[100] pointer-events-none">
      {/* the colour bands behind, each leaving a beat after the one in front */}
      <div className="page-intro-band absolute inset-0 bg-violet" style={{ animationDelay: "0.24s" }} />
      <div className="page-intro-band absolute inset-0 bg-lime" style={{ animationDelay: "0.12s" }} />
      <div className="page-intro-band absolute inset-0 flex flex-col justify-end gap-4 bg-ink text-cream px-4 sm:px-6 lg:px-12 pb-[12vh]">
        <p className="font-inter font-black uppercase tracking-tight text-[clamp(0.9rem,1.6vw,2.5rem)]">
          <span className="relative inline-block bg-lime text-ink px-[0.25em] -rotate-2">{over}<sup className="text-violet text-[0.8em]">*</sup></span>
        </p>
        <p className="flex flex-wrap gap-x-[0.25em] overflow-hidden font-display font-extrabold [font-stretch:62%] uppercase leading-[0.85] pt-[0.05em]" style={{ fontSize: size }}>
          {title.split(" ").map((word, w, words) => {
            const before = words.slice(0, w).join("").length
            return (
              <span key={w} className="inline-flex whitespace-nowrap">
                {word.split("").map((ch, i) => (
                  <span key={i} className="page-intro-letter inline-block" style={{ animationDelay: `${0.08 + (before + i) * 0.035}s` }}>{ch}</span>
                ))}
              </span>
            )
          })}
        </p>
        <span className="page-intro-bar absolute left-0 bottom-0 h-1.5 w-full origin-left bg-[#FF8A3D]" />
      </div>
    </div>
  )
}
