"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ImageUpload } from "./ImageUpload"

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
}

const empty: ProjectData = {
  title: "", client: "", description: "",
  year: new Date().getFullYear(), role: "",
  body: [], coverImg: "",
  images: ["", "", "", "", ""],
  ratio: 1, link: "",
}

interface Props {
  initial?: Partial<ProjectData> & { slug?: string }
  mode: "create" | "edit"
}

const field = "bg-transparent border border-neutral-800 px-3 py-2.5 text-xs outline-none focus:border-neutral-500 transition-colors w-full"
const label = "text-[10px] tracking-widest uppercase opacity-40"

export function ProjectForm({ initial, mode }: Props) {
  const router = useRouter()
  const [data, setData] = useState<ProjectData>({ ...empty, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const set = (key: keyof ProjectData, value: unknown) =>
    setData((d) => ({ ...d, [key]: value }))

  const setBody = (i: number, v: string) =>
    setData((d) => { const b = [...d.body]; b[i] = v; return { ...d, body: b } })

  const setImage = (i: number, url: string) =>
    setData((d) => { const imgs = [...d.images]; imgs[i] = url; return { ...d, images: imgs } })

  const save = async () => {
    setSaving(true)
    setError("")

    const slug = initial?.slug
    const url = mode === "create" ? "/api/projects" : `/api/projects/${slug}`
    const method = mode === "create" ? "POST" : "PATCH"

    const slug_gen = data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
    const body = mode === "create" ? { ...data, slug: slug_gen } : data

    const res = await fetch(url, {
      method,
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    })

    setSaving(false)
    if (res.ok) router.push("/admin/projects")
    else setError((await res.json()).error || "something went wrong")
  }

  const imageLabels = ["Left stack — top", "Left stack — bottom", "Mid single", "Full width 1", "Full width 2"]

  return (
    <div className="flex flex-col gap-10 max-w-2xl">

      {/* Basic info */}
      <section className="flex flex-col gap-5">
        <p className="text-[10px] tracking-[0.2em] uppercase opacity-30 border-b border-neutral-800 pb-3">info</p>

        <div className="grid grid-cols-2 gap-4">
          {([["title", "title"], ["client", "client name"], ["role", "role"], ["link", "live link (optional)"]] as const).map(([key, lbl]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <label className={label}>{lbl}</label>
              <input className={field} value={(data as any)[key]} onChange={(e) => set(key as any, e.target.value)} />
            </div>
          ))}

          <div className="flex flex-col gap-1.5">
            <label className={label}>year</label>
            <input className={field} type="number" value={data.year} onChange={(e) => set("year", Number(e.target.value))} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={label}>ratio (card size on /works)</label>
            <select className={`${field} bg-neutral-950`} value={data.ratio} onChange={(e) => set("ratio", Number(e.target.value) as 1 | 2 | 3)}>
              <option value={1}>1 — portrait</option>
              <option value={2}>2 — landscape</option>
              <option value={3}>3 — square</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={label}>client description</label>
          <textarea className={`${field} resize-none`} rows={3} value={data.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </section>

      {/* Body paragraphs */}
      <section className="flex flex-col gap-5">
        <p className="text-[10px] tracking-[0.2em] uppercase opacity-30 border-b border-neutral-800 pb-3">body copy</p>

        {data.body.length === 0 && (
          <p className="text-[10px] opacity-20 tracking-widest">no paragraphs yet</p>
        )}

        {data.body.map((para, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className={label}>paragraph {i + 1}</label>
              <button
                onClick={() => setData((d) => ({ ...d, body: d.body.filter((_, j) => j !== i) }))}
                className="text-[9px] tracking-widest text-red-400/50 hover:text-red-400 transition-colors"
              >
                remove
              </button>
            </div>
            <textarea
              className={`${field} resize-none`}
              rows={4}
              value={para}
              onChange={(e) => setBody(i, e.target.value)}
            />
          </div>
        ))}

        <button
          onClick={() => setData((d) => ({ ...d, body: [...d.body, ""] }))}
          className="text-[10px] tracking-widest border border-dashed border-neutral-700 px-4 py-2.5 hover:border-neutral-500 transition-colors self-start"
        >
          + add paragraph
        </button>
      </section>

      {/* Images */}
      <section className="flex flex-col gap-5">
        <p className="text-[10px] tracking-[0.2em] uppercase opacity-30 border-b border-neutral-800 pb-3">images</p>
        <ImageUpload label="cover image (hero)" value={data.coverImg} onChange={(url) => set("coverImg", url)} folder="portfolio/covers" />
        <div className="grid grid-cols-2 gap-4 mt-2">
          {data.images.map((img, i) => (
            <ImageUpload key={i} label={imageLabels[i]} value={img} onChange={(url) => setImage(i, url)} folder="portfolio/projects" />
          ))}
        </div>
      </section>

      {error && <p className="text-[10px] text-red-400 tracking-widest">{error}</p>}

      <button onClick={save} disabled={saving} className="border border-neutral-700 px-6 py-3 text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-30 self-start">
        {saving ? "saving..." : mode === "create" ? "create project" : "save changes"}
      </button>
    </div>
  )
}