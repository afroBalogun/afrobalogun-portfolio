// Sample data for previewing /works and /playground without the database.
// Used only when the build sets NEXT_PUBLIC_USE_MOCK=1, so the real site never shows it.
// shortcut: placeholder content (titles, roles, images from /public); delete once the DB is reachable locally.
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "1"

export const MOCK_PROJECTS = [
  { _id: "m1", slug: "goldenpages", title: "EET Golden Pages", role: "Design & fullstack", coverImg: "/cases/goldenpages.jpg", year: 2026, ratio: 2 as const },
  { _id: "m2", slug: "solana-students", title: "Solana Students Africa", role: "Design & frontend", coverImg: "/expertise-design.jpg", year: 2026, ratio: 1 as const },
  { _id: "m3", slug: "scout", title: "Scout", role: "Fullstack · personal", coverImg: "/desk.jpg", year: 2026, ratio: 3 as const },
  { _id: "m4", slug: "true-life-ticketing", title: "True Life Tickets", role: "Fullstack · freelance", coverImg: "/cases/truelife.jpg", year: 2025, ratio: 3 as const },
  { _id: "m5", slug: "iss-document-pipeline", title: "Document Pipeline", role: "Software developer · ISS", coverImg: "/cases/iss.jpg", year: 2025, ratio: 2 as const },
  { _id: "m6", slug: "coverage-cat", title: "Coverage Cat redesign", role: "Concept · growth", coverImg: "/expertise-engineering.jpg", year: 2025, ratio: 1 as const },
  { _id: "m7", slug: "plant-twin", title: "Plant digital twin", role: "Research", coverImg: "/expertise-motion.jpg", year: 2024, ratio: 2 as const },
]

export const MOCK_PLAYGROUND = [
  { img: "/cases/goldenpages.jpg", title: "Directory hero", tags: ["web", "ui"] },
  { img: "/sticker.jpg", title: "Halftone sticker", tags: ["image", "print"] },
  { img: "/expertise-design.jpg", title: "Editorial grid", tags: ["layout"] },
  { img: "/cases/truelife.jpg", title: "Ticket flow", tags: ["web", "flow"] },
  { img: "/desk.jpg", title: "Desk study", tags: ["photo"] },
  { img: "/expertise-motion.jpg", title: "Motion blur", tags: ["photo", "motion"] },
  { img: "/cases/iss.jpg", title: "Pipeline dashboard", tags: ["data", "ui"] },
  { img: "/lib.jpg", title: "Library", tags: ["photo"] },
  { img: "/expertise-engineering.jpg", title: "Engineering", tags: ["photo"] },
  { img: "/sticker-halftone.png", title: "Dot study", tags: ["print"] },
].map((w, i) => ({ _id: `p${i}`, index: i, link: undefined as string | undefined, ...w }))

// a full project, for /works/[slug]: the list entry plus a case study. True Life carries the draft write-up (to be
// confirmed by Temi); the others reuse a generic one.
export function mockProject(slug: string) {
  const i = Math.max(0, MOCK_PROJECTS.findIndex((p) => p.slug === slug))
  const p = MOCK_PROJECTS[i], next = MOCK_PROJECTS[(i + 1) % MOCK_PROJECTS.length]
  const base = {
    ...p,
    client: p.title,
    images: ["/expertise-design.jpg", "/expertise-engineering.jpg", "/desk.jpg", "/expertise-motion.jpg"],
    link: "https://example.com",
    nextProject: { slug: next.slug, title: next.title },
  }
  if (p.slug === "true-life-ticketing") return {
    ...base,
    client: "True Life Productions",
    summary: "A ticketing site for a production house that can't oversell a seat.",
    description: "True Life Productions makes film, theatre and live events in Lagos. The site is both their portfolio and their box office.",
    stack: ["Next.js", "Node", "MongoDB", "SCAPA"],
    problem: {
      headline: "Sell-out shows, one shared stock count.",
      body: "Tickets were sold across more than one channel, and on busy nights the last seats could be sold twice. That meant refunds, awkward conversations at the door, and a team that didn't trust its own numbers.",
    },
    body: [
      "I put every change to ticket stock through one path on the server, so a seat is reserved, paid for or released in exactly one place, in order.",
      "Payment is only confirmed when SCAPA's webhook says so, never when the browser says it went through, so a closed tab or a dropped connection can't leave a ghost sale.",
      "Around that, the site sells the work: video-led pages for each production, share previews for every show, and a checkout short enough to finish on a phone in a queue.",
    ],
    highlights: [
      { title: "One path for every stock change", body: "Reserve, pay and release all run through a single server-side function, so two buyers can't take the last seat." },
      { title: "Payments confirmed by webhook", body: "A sale only counts when SCAPA confirms it, not when the browser redirects." },
      { title: "Share previews for every show", body: "Each production gets its own Open Graph card, so links look like posters in WhatsApp and on X." },
      { title: "Video-first, still fast", body: "Hero clips load after the page is usable, so the first view is quick on mobile data." },
    ],
    results: [
      { value: "0", label: "tickets oversold" },
      { value: "1", label: "path for every stock change" },
      { value: "100%", label: "of sales confirmed by webhook" },
    ],
    outcome: "The team runs ticketing themselves; the site just sells out.",
  }
  return {
    ...base,
    description: "A members' directory where a whole community finds, books and pays its own businesses, designed and built end to end.",
    body: [
      "The brief was simple to say and hard to do: help members find each other's businesses, then make booking one feel as easy as sending a message.",
      "I started in the browser rather than in a mock-up, so search, filters and the booking flow were tested with real listings from the first week.",
    ],
    stack: [] as string[],
    highlights: [] as { title: string; body: string }[],
    results: [] as { value: string; label: string }[],
  }
}
