"use client"
import { useEffect, useState } from "react"

// Live date + time in Lagos; empty until mounted so the build-time HTML doesn't bake in a stale time
const fmt = new Intl.DateTimeFormat("en-US", { timeZone: "Africa/Lagos", month: "2-digit", day: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, hourCycle: "h23" })

export default function LagosStamp({ className = "" }: { className?: string }) {
  const [now, setNow] = useState<Record<string, string> | null>(null)
  useEffect(() => {
    const tick = () => setNow(Object.fromEntries(fmt.formatToParts(new Date()).map((p) => [p.type, p.value])))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  const h = Number(now?.hour ?? 0), m = Number(now?.minute ?? 0), s = Number(now?.second ?? 0)
  const hand = (deg: number) => ({ transform: `rotate(${deg}deg)`, transformOrigin: "12px 12px" })
  return (
    <p className={`flex flex-col ${className}`}>
      <span>Lagos</span>
      <time className="tabular-nums">{now ? `${now.month}/${now.day}/${now.year}` : " "}</time>
      <span className="inline-flex items-center gap-1.5 tabular-nums">
        {/* tiny analogue clock (violet second hand) beside the time */}
        <svg aria-hidden viewBox="0 0 24 24" className={`w-4 h-4 transition-opacity ${now ? "" : "opacity-0"}`}>
          <line x1="12" y1="13.5" x2="12" y2="6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" style={hand((h % 12) * 30 + m * 0.5)} />
          <line x1="12" y1="13.5" x2="12" y2="2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" style={hand(m * 6 + s * 0.1)} />
          <line x1="12" y1="15" x2="12" y2="2" stroke="#7C4DFF" strokeWidth="1.1" strokeLinecap="round" style={hand(s * 6)} />
          <circle cx="12" cy="12" r="1.6" fill="#7C4DFF" />
        </svg>
        {now ? `${String(h % 12 || 12).padStart(2, "0")}:${now.minute} ${h < 12 ? "AM" : "PM"}` : " "}
      </span>
    </p>
  )
}
