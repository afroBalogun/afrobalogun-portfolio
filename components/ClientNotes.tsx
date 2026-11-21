import { Courier_Prime } from "next/font/google"

// Kind words from past clients.
// Desktop (1024px+): an open kraft folder of papers, full width at one screen's height: a large lined sheet held by a paperclip on
//   the left page, a green spine panel carrying the section title, a pale sheet with a binder clip on the right, and
//   lavender sticky notes overlapping both. Every piece is placed in % of the box, measured from the reference; text
//   and spacing are in cqh so they follow the screen's height and the papers widen with the screen.
// Smaller screens: the same papers, without the folder: a green header block, then the papers in a sideways-swipe strip.
// Every sheet carries a faint paper grain; the writing is typewriter type.
//
// shortcut: these quotes are SAMPLE wording with placeholder names; replace them with real client feedback (and real
// names, roles and companies) before this goes live.

const typewriter = Courier_Prime({ subsets: ["latin"], weight: ["400", "700"] })

type Note = { quote: string; name: string; role: string; company: string }
const LINED: Note = {
  quote: "Temi came in to build us a website and ended up fixing how we sell. Every ticket now runs through one path and confirms itself, so we stopped refunding people for seats we never had.\n\nWhat stood out was how much he cared about the boring parts: refunds, the door on the night, what happens when the network drops. He asked about all of it before we did.\n\nAlso: answer his questions properly. They save you weeks.",
  name: "Client name", role: "Role", company: "Company",
}
const RIGHT: Note = {
  quote: "We came with a rough idea and a deadline. He came back with sharper questions than ours, then designed it and built it himself, so nothing got lost between the mock-up and the real site. It moves the way it looked in the designs, and it still loads fast on a bad connection. It made our work better, and it made launch day boring, which is the best kind of launch day.",
  name: "Client name", role: "Role", company: "Company",
}
const STICKIES: (Note & { box: string })[] = [
  { quote: "Clear, quick and calm under pressure. He tells you what he'll do, then does it.", name: "Client name", role: "Role", company: "Company", box: "left-[21%] top-[64.5%] w-[22%] h-[34.5%] -rotate-[0.6deg]" },
  { quote: "Hours of manual work a week, gone. The team still talks about it.", name: "Client name", role: "Role", company: "Company", box: "left-[41.5%] top-[46%] w-[18%] h-[32.5%] rotate-[0.8deg]" },
  { quote: "Design and engineering in one person, so changes took minutes instead of meetings. Take the time to walk him through how your team really works; it shows up in what he builds.", name: "Client name", role: "Role", company: "Company", box: "left-[63.5%] top-[61%] w-[34.5%] h-[29%] rotate-[0.3deg]" },
]

// paper grain: SVG noise multiplied over each sheet's colour
const GRAIN = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .32 0 0 0 0 .27 0 0 0 0 .2 0 0 0 .5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"
function Grain({ strength = 0.3 }: { strength?: number }) {
  return <span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ backgroundImage: GRAIN, opacity: strength }} />
}

const KRAFT = "#C8A06A", PAGE = "#E2E8C5", LINED_PAPER = "#F5F3EB", SPINE = "#4FB25B", RIGHT_PAPER = "#E4EACB", LAVENDER = "#B7B4E6"
const PAPER_SHADOW = "shadow-[0_1px_2px_rgba(0,0,0,.18),0_4px_12px_rgba(0,0,0,.12)]"
const NOTE_SHADOW = "shadow-[0_2px_3px_rgba(0,0,0,.2),0_10px_22px_rgba(0,0,0,.18)]"
const INK = "text-[#232323]"
// lined-paper rules: one every line of text (the desktop folder uses 3.09cqh lines, the strip uses 1.45rem lines)
const RULES_CQH = "bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(3.09cqh-1px),#C6CED6_calc(3.09cqh-1px),#C6CED6_3.09cqh)] bg-[position:0_4.64cqh]"
const RULES_REM = "bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_calc(1.45rem-1px),#C6CED6_calc(1.45rem-1px),#C6CED6_1.45rem)] bg-[position:0_1.75rem]"

export default function ClientNotes() {
  return (
    <section aria-labelledby="notes-title" className={`bg-ink lg:min-h-svh lg:flex lg:items-center py-20 lg:py-12 ${typewriter.className}`}>
      <h2 id="notes-title" className="sr-only">Kind words from past clients</h2>
      <Folder />
      <Strip />
    </section>
  )
}

// ── desktop: the open folder, full width at one screen's height; sizes inside are in cqh (height of the box) ──
function Folder() {
  const body = `text-[max(0.75rem,2.11cqh)] leading-[3.09cqh] ${INK}`
  const by = (n: Note) => (
    <figcaption className={`relative mt-[2.25cqh] font-inter text-[max(0.6875rem,1.48cqh)] leading-[1.97cqh] ${INK}`}>
      <b className="block font-semibold">{n.name}</b><i className="block">{n.role}</i>{n.company}
    </figcaption>
  )
  return (
    <div className="hidden lg:block w-full px-6 lg:px-12">
      <div className="relative w-full [container-type:size]" style={{ height: "min(calc(100svh - 6rem), calc((100vw - 6rem) / 1.25))" }}>
        {/* the kraft folder behind everything, open, with its fold */}
        <div aria-hidden className={`absolute left-[3.2%] top-[4%] w-[94.4%] h-[93.5%] rounded-[0.84cqh] ${PAPER_SHADOW}`} style={{ background: KRAFT }}>
          <Grain strength={0.55} />
          <span className="absolute inset-y-0 left-[49.6%] w-[0.7cqh] bg-linear-to-r from-black/0 via-black/20 to-black/0" />
        </div>
        {/* left page, under the lined sheet */}
        <div aria-hidden className={`absolute left-[4.6%] top-[6.5%] w-[44.6%] h-[88.5%] ${PAPER_SHADOW}`} style={{ background: PAGE }}>
          <Grain />
          <span className={`absolute left-[4%] bottom-[2.4%] uppercase tracking-[0.08em] text-[max(0.6875rem,1.48cqh)] ${INK}`}>afroBalogun · kind words</span>
        </div>
        {/* the lined sheet, with a paperclip over its top edge */}
        <figure className={`absolute left-[3%] top-[1.5%] w-[36.5%] h-[79.5%] px-[3.65cqh] pt-[5.06cqh] pb-[2.81cqh] ${PAPER_SHADOW} ${RULES_CQH}`} style={{ backgroundColor: LINED_PAPER }}>
          <Grain strength={0.22} />
          <Paperclip className="left-[6%] -top-[3.37cqh] w-[3.23cqh]" />
          <blockquote className={`relative whitespace-pre-line ${body}`}>&ldquo;{LINED.quote}&rdquo;</blockquote>
          {by(LINED)}
        </figure>
        {/* the right-hand page is green; its left strip carries the section title, the pale sheet lies on the rest */}
        <div aria-hidden className={`absolute left-[51.4%] top-[7%] w-[45.4%] h-[88%] flex flex-col justify-between p-[2.25cqh] ${PAPER_SHADOW}`} style={{ background: SPINE }}>
          <Grain strength={0.25} />
          <p className={`relative uppercase tracking-[0.08em] text-[max(0.6875rem,1.62cqh)] ${INK}`}>Section 03</p>
          <p className="relative font-inter text-[#1d2a1d] leading-none text-[4.78cqh] [writing-mode:vertical-rl] rotate-180 self-start ml-[0.56cqh] mt-[2.25cqh] mb-auto">Kind words</p>
          <p className={`relative uppercase tracking-[0.08em] text-[max(0.6875rem,1.48cqh)] ${INK}`}>afroBalogun · kind words</p>
        </div>
        {/* the right sheet, with a binder clip */}
        <figure className={`absolute left-[65%] top-[2.5%] w-[32%] h-[83%] px-[3.37cqh] pt-[4.22cqh] ${PAPER_SHADOW}`} style={{ background: RIGHT_PAPER }}>
          <Grain />
          <BinderClip className="right-[5%] -top-[3.09cqh] w-[6.18cqh]" />
          <blockquote className={`relative ${body}`}>{RIGHT.quote}</blockquote>
          {by(RIGHT)}
        </figure>
        {/* lavender sticky notes over both pages */}
        {STICKIES.map((n) => (
          <figure key={n.quote} className={`absolute p-[2.53cqh] ${NOTE_SHADOW} ${n.box}`} style={{ background: LAVENDER }}>
            <Grain strength={0.28} />
            <blockquote className={`relative ${body}`}>{n.quote}</blockquote>
            {by(n)}
          </figure>
        ))}
      </div>
    </div>
  )
}

// ── smaller screens: a green header block, then the papers in a sideways-swipe strip ──
function Strip() {
  const body = `text-[0.85rem] leading-[1.45rem] ${INK}`
  const by = (n: Note) => (
    <figcaption className={`relative mt-4 font-inter text-[0.72rem] leading-snug ${INK}`}>
      <b className="block font-semibold">{n.name}</b><i className="block">{n.role}</i>{n.company}
    </figcaption>
  )
  const card = "relative shrink-0 snap-start w-[min(80vw,22rem)] p-5"
  return (
    <div className="lg:hidden">
      <div className="px-4 sm:px-6">
        <div aria-hidden className={`relative flex items-end justify-between gap-4 p-5 ${PAPER_SHADOW}`} style={{ background: SPINE }}>
          <Grain strength={0.25} />
          <div className="relative">
            <p className={`uppercase tracking-[0.08em] text-[0.72rem] ${INK}`}>Section 03</p>
            <p className="mt-3 font-inter text-[#1d2a1d] leading-none text-4xl">Kind words</p>
          </div>
          <p className={`relative uppercase tracking-[0.08em] text-[0.72rem] ${INK}`}>Swipe →</p>
        </div>
      </div>
      <ul className="mt-6 flex items-start gap-4 overflow-x-auto snap-x snap-mandatory scroll-pl-4 sm:scroll-pl-6 px-4 sm:px-6 pt-5 pb-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <li className="contents">
          <figure className={`${card} -rotate-1 pt-7 ${PAPER_SHADOW} ${RULES_REM}`} style={{ backgroundColor: LINED_PAPER }}>
            <Grain strength={0.22} />
            <Paperclip className="left-[8%] -top-5 w-5" />
            <blockquote className={`relative whitespace-pre-line ${body}`}>&ldquo;{LINED.quote}&rdquo;</blockquote>
            {by(LINED)}
          </figure>
        </li>
        <li className="contents">
          <figure className={`${card} rotate-1 pt-7 ${PAPER_SHADOW}`} style={{ background: RIGHT_PAPER }}>
            <Grain />
            <BinderClip className="right-[8%] -top-4 w-10" />
            <blockquote className={`relative ${body}`}>{RIGHT.quote}</blockquote>
            {by(RIGHT)}
          </figure>
        </li>
        {STICKIES.map((n, i) => (
          <li key={n.quote} className="contents">
            <figure className={`${card} ${i % 2 ? "rotate-1" : "-rotate-1"} ${NOTE_SHADOW}`} style={{ background: LAVENDER }}>
              <Grain strength={0.28} />
              <blockquote className={`relative ${body}`}>{n.quote}</blockquote>
              {by(n)}
            </figure>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Paperclip({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 22 80" className={`absolute z-10 h-auto drop-shadow-[1px_1px_1px_rgba(0,0,0,.3)] ${className}`}>
      <path d="M7 24 V64 a4 4 0 0 0 8 0 V12 a7 7 0 0 0 -14 0 V58" fill="none" stroke="#8E949B" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  )
}

function BinderClip({ className }: { className: string }) {
  return (
    <svg aria-hidden viewBox="0 0 44 40" className={`absolute z-10 h-auto drop-shadow-[1px_2px_1px_rgba(0,0,0,.35)] ${className}`}>
      <path d="M13 17 L8 2 h5 l4 15 M31 17 l5 -15 h-5 l-4 15" fill="none" stroke="#A9AEB4" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M3 17 h38 l-4 21 h-30 Z" fill="#141414" />
      <path d="M6 21 h32" stroke="#3a3a3a" strokeWidth="1.5" />
    </svg>
  )
}
