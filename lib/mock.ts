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

// a full project, for /works/[slug]: the list entry plus a write-up, images and the next project
export function mockProject(slug: string) {
  const i = Math.max(0, MOCK_PROJECTS.findIndex((p) => p.slug === slug))
  const p = MOCK_PROJECTS[i], next = MOCK_PROJECTS[(i + 1) % MOCK_PROJECTS.length]
  return {
    ...p,
    client: p.title,
    description: "A members' directory where a whole community finds, books and pays its own businesses, designed and built end to end.",
    body: [
      "The brief was simple to say and hard to do: help members find each other's businesses, then make booking one feel as easy as sending a message.",
      "I started in the browser rather than in a mock-up, so search, filters and the booking flow were tested with real listings from the first week.",
      "The back end runs on Next.js and Node with MongoDB, with payments and confirmations handled server-side so nothing double-books.",
      "It launched with 226 businesses listed, and the community now books through it without anyone walking them through it.",
    ],
    images: ["/expertise-design.jpg", "/expertise-engineering.jpg", "/desk.jpg", "/expertise-motion.jpg"],
    link: "https://example.com",
    nextProject: { slug: next.slug, title: next.title },
  }
}
