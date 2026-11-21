// shortcut: hand-written until the Project model gains featured/question/results/stack (plan §4); then read these from the DB
// goldenpages cover is a real screenshot; the other two covers, the stacks and the copy are placeholders for Temi to replace
export type Case = {
  slug: string
  title: string
  role: string
  year: number
  cover: string
  more?: string[] // extra screenshots shown beside the cover on the home page
  question: string
  results: { value: string; label: string }[]
  stack: string[]
}

export const FEATURED: Case[] = [
  {
    slug: "goldenpages",
    title: "EET Golden Pages",
    role: "Design & Fullstack",
    year: 2026,
    cover: "/cases/goldenpages.jpg",
    question: "How do members find each other's businesses?",
    results: [{ value: "226", label: "businesses listed" }, { value: "Live", label: "goldenpages.ng" }],
    stack: ["Next.js", "Node", "MongoDB"],
  },
  {
    slug: "true-life-ticketing",
    title: "True Life Tickets",
    role: "Fullstack · Freelance",
    year: 2025,
    cover: "/cases/truelife.jpg",
    question: "How do you stop overselling?",
    results: [{ value: "0", label: "tickets oversold" }, { value: "1", label: "path for every stock change" }],
    stack: ["Next.js", "Node", "SCAPA"],
  },
  {
    slug: "iss-document-pipeline",
    title: "Document Pipeline",
    role: "Software Developer · ISS",
    year: 2025,
    cover: "/cases/iss.jpg",
    question: "Who needs 10 hours back every week?",
    results: [{ value: "~10h", label: "saved every week" }, { value: "30%", label: "faster load time" }],
    stack: ["Python", "OCR", "React"],
  },
]
