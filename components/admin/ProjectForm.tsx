"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./ImageUpload"
import { ui } from "./ui"
import { STORY_PARTS } from "./caseStudy"

// The project editor, laid out in the order the case study reads (basics → story → the work → under the bonnet →
// results → closing → images), with a note under each section on what makes it result-oriented.

interface ProjectData {
  title: string
  client: string
  description: string
  year: number
  role: string
  body: string[]
  coverImg: string
  images: string[]
  ratio: 1 | 2 | 3
  link: string
  summary: string
  stack: string[]
  problem: { headline: string; body: string }
  highlights: { title: string; body: string }[]
  results: { value: string; label: string }[]
  outcome: string
}

const empty: ProjectData = {
  title: "", client: "", description: "",
  year: new Date().getFullYear(), role: "",
  body: [], coverImg: "", images: [],
  ratio: 1, link: "",
  summary: "", stack: [], problem: { headline: "", body: "" },
  highlights: [], results: [], outcome: "",
}

interface Props {
  initial?: Partial<ProjectData> & { slug?: string }
  mode: "create" | "edit"
}

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className={ui.section}>
      <div className="flex flex-col gap-1.5">
        <h2 className={ui.sectionTitle}>{title}</h2>
        {hint && <p className={ui.hint}>{hint}</p>}
      </div>
      {children}
    </section>
  )
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className={ui.label}>{label}</span>
      {children}
    </label>
  )
}

export function ProjectForm({ initial, mode }: Props) {
  const router = useRouter()
  const [data, setData] = useState<ProjectData>({
    ...empty,
    ...initial,
    problem: { ...empty.problem, ...initial?.problem },
    images: (initial?.images ?? []).filter(Boolean),
  })
  const [stackText, setStackText] = useState((initial?.stack ?? []).join(", "))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const set = <K extends keyof ProjectData>(key: K, value: ProjectData[K]) => setData((d) => ({ ...d, [key]: value }))
  // edit one item of a list field
  const setItem = <K extends "body" | "images" | "highlights" | "results">(key: K, i: number, value: ProjectData[K][number]) =>
    setData((d) => ({ ...d, [key]: d[key].map((v, j) => (j === i ? value : v)) }))
  const removeItem = (key: "body" | "images" | "highlights" | "results", i: number) =>
    setData((d) => ({ ...d, [key]: d[key].filter((_, j) => j !== i) }))

  const save = async () => {
    setSaving(true)
    setError("")
    const payload = {
      ...data,
      stack: stackText.split(",").map((s) => s.trim()).filter(Boolean),
      body: data.body.filter((p) => p.trim()),
      images: data.images.filter(Boolean),
      highlights: data.highlights.filter((h) => h.title.trim()),
      results: data.results.filter((r) => r.value.trim()),
    }
    const res = await fetch(mode === "create" ? "/api/projects" : `/api/projects/${initial?.slug}`, {
      method: mode === "create" ? "POST" : "PATCH",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    })
    setSaving(false)
    if (res.ok) router.push("/admin/projects")
    else setError((await res.json().catch(() => ({}))).error || "Something went wrong")
  }

  const done = STORY_PARTS.filter((s) => s.done(data)).length

  return (
    <div className="flex flex-col gap-6 max-w-4xl pb-28">
      {/* basics */}
      <Section title="Basics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title"><input className={ui.field} value={data.title} onChange={(e) => set("title", e.target.value)} placeholder="True Life Productions" /></Field>
          <Field label="Client"><input className={ui.field} value={data.client} onChange={(e) => set("client", e.target.value)} /></Field>
          <Field label="Role"><input className={ui.field} value={data.role} onChange={(e) => set("role", e.target.value)} placeholder="Fullstack engineer" /></Field>
          <Field label="Year"><input className={ui.field} type="number" value={data.year} onChange={(e) => set("year", Number(e.target.value))} /></Field>
          <Field label="Stack (comma separated)"><input className={ui.field} value={stackText} onChange={(e) => setStackText(e.target.value)} placeholder="Next.js, Node, SCAPA" /></Field>
          <Field label="Live link (optional)"><input className={ui.field} value={data.link} onChange={(e) => set("link", e.target.value)} placeholder="https://" /></Field>
          <Field label="Card shape on /works">
            <select className={ui.field} value={data.ratio} onChange={(e) => set("ratio", Number(e.target.value) as 1 | 2 | 3)}>
              <option value={1}>Portrait</option>
              <option value={2}>Landscape</option>
              <option value={3}>Square</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* the story */}
      <Section title="The outcome, in one line" hint="What changed because of this work, not what the site has. Shown big under the title. e.g. “A ticketing site for a production house that can't oversell a seat.”">
        <input className={ui.field} value={data.summary} onChange={(e) => set("summary", e.target.value)} />
      </Section>

      <Section title="The problem" hint="Frame it as a tension the work had to resolve. A short headline (e.g. “Sell-out shows, one shared stock count.”), then a paragraph on what was going wrong and who it hurt.">
        <Field label="Headline"><input className={ui.field} value={data.problem.headline} onChange={(e) => set("problem", { ...data.problem, headline: e.target.value })} /></Field>
        <Field label="Paragraph"><textarea rows={4} className={`${ui.field} resize-y`} value={data.problem.body} onChange={(e) => set("problem", { ...data.problem, body: e.target.value })} /></Field>
      </Section>

      <Section title="About the project" hint="A short paragraph on the client and the project, for context.">
        <textarea rows={3} className={`${ui.field} resize-y`} value={data.description} onChange={(e) => set("description", e.target.value)} />
      </Section>

      <Section title="The work" hint="What you did and the decisions you made, a paragraph each. Lead with the decision and why, not the feature list.">
        {data.body.map((para, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between"><span className={ui.label}>Paragraph</span><button type="button" onClick={() => removeItem("body", i)} className={ui.danger}>Remove</button></div>
            <textarea rows={4} className={`${ui.field} resize-y`} value={para} onChange={(e) => setItem("body", i, e.target.value)} />
          </div>
        ))}
        <button type="button" onClick={() => set("body", [...data.body, ""])} className={`${ui.secondary} self-start`}>+ Add paragraph</button>
      </Section>

      <Section title="Under the bonnet" hint="Three or four technical wins, each a short title and one sentence. e.g. “Payments confirmed by webhook, not the browser.”">
        {data.highlights.map((h, i) => (
          <div key={i} className="grid grid-cols-1 md:grid-cols-[1fr_2fr_auto] gap-3 items-start">
            <input className={ui.field} placeholder="Title" value={h.title} onChange={(e) => setItem("highlights", i, { ...h, title: e.target.value })} />
            <textarea rows={2} className={`${ui.field} resize-y`} placeholder="One sentence" value={h.body} onChange={(e) => setItem("highlights", i, { ...h, body: e.target.value })} />
            <button type="button" onClick={() => removeItem("highlights", i)} className={`${ui.danger} md:pt-3`}>Remove</button>
          </div>
        ))}
        {data.highlights.length < 4 && <button type="button" onClick={() => set("highlights", [...data.highlights, { title: "", body: "" }])} className={`${ui.secondary} self-start`}>+ Add highlight</button>}
      </Section>

      <Section title="Results" hint="Two or three numbers, shown big. A value and what it counts: “0” / “tickets oversold”, “~10h” / “saved every week”, “226” / “businesses listed”.">
        {data.results.map((r, i) => (
          <div key={i} className="grid grid-cols-[7rem_1fr_auto] gap-3 items-center">
            <input className={`${ui.field} font-display font-bold text-lg`} placeholder="226" value={r.value} onChange={(e) => setItem("results", i, { ...r, value: e.target.value })} />
            <input className={ui.field} placeholder="businesses listed" value={r.label} onChange={(e) => setItem("results", i, { ...r, label: e.target.value })} />
            <button type="button" onClick={() => removeItem("results", i)} className={ui.danger}>Remove</button>
          </div>
        ))}
        {data.results.length < 4 && <button type="button" onClick={() => set("results", [...data.results, { value: "", label: "" }])} className={`${ui.secondary} self-start`}>+ Add result</button>}
      </Section>

      <Section title="Closing line" hint="One sentence on where it left the client. e.g. “The team runs ticketing themselves; the site just sells out.”">
        <input className={ui.field} value={data.outcome} onChange={(e) => set("outcome", e.target.value)} />
      </Section>

      {/* images */}
      <Section title="Images" hint="The cover leads the page; the rest run as a gallery (the first two side by side, then full width).">
        <ImageUpload label="Cover" value={data.coverImg} onChange={(url) => set("coverImg", url)} folder="portfolio/covers" tall />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.images.map((img, i) => (
            <ImageUpload key={i} label="Gallery image" value={img} onChange={(url) => (url ? setItem("images", i, url) : removeItem("images", i))} folder="portfolio/projects" />
          ))}
        </div>
        <button type="button" onClick={() => set("images", [...data.images, ""])} className={`${ui.secondary} self-start`}>+ Add image</button>
      </Section>

      {/* save bar */}
      <div className="fixed bottom-0 left-56 right-0 z-20 flex items-center justify-between gap-4 bg-cream/90 backdrop-blur px-6 md:px-12 py-4 ring-1 ring-ink/10">
        <p className="text-sm text-ink/60">
          Case study <span className="font-semibold text-ink">{done}/{STORY_PARTS.length}</span> complete
          {error && <span className="ml-4 text-red-700">{error}</span>}
        </p>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push("/admin/projects")} className={ui.ghost}>Cancel</button>
          <button type="button" onClick={save} disabled={saving || !data.title || !data.client || !data.role || !data.coverImg || !data.description} className={ui.primary}>
            {saving ? "Saving…" : mode === "create" ? "Create project" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  )
}
