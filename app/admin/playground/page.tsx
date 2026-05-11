"use client"

import { useEffect, useRef, useState } from "react"
import { ImageUpload } from "@/components/admin/ImageUpload"

interface Work { _id: string; index: number; img: string; link: string; tags: string[] }

export default function Playground() {
  const [works, setWorks] = useState<Work[]>([])
  const [img, setImg] = useState("")
  const [tags, setTags] = useState("")
  const [link, setLink] = useState("")
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch("/api/playground")
    setWorks(await res.json())
  }

  useEffect(() => { load() }, [])

  const add = async () => {
    if (!img) return
    setSaving(true)
    const index = works.length + 1
    await fetch("/api/playground", {
      method: "POST",
      body: JSON.stringify({ index, img, tags: tags.split(",").map(t => t.trim()).filter(Boolean), link }),
      headers: { "Content-Type": "application/json" },
    })
    setImg("")
    setTags("")
    setLink("")
    setSaving(false)
    load()
  }

  const remove = async (id: string) => {
    if (!confirm("remove?")) return
    await fetch(`/api/playground/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="flex flex-col gap-10">
      <p className="text-xs tracking-[0.2em] uppercase opacity-40">playground</p>

      {/* Add new */}
      <div className="flex flex-col gap-4 max-w-sm border border-neutral-800 p-6">
        <p className="text-[10px] tracking-widest uppercase opacity-30">add work</p>
        <ImageUpload label="image" value={img} onChange={setImg} folder="portfolio/playground" />
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] tracking-widest uppercase opacity-40">tags (comma separated)</label>
          <input
            className="bg-transparent border border-neutral-800 px-3 py-2.5 text-xs outline-none focus:border-neutral-500 transition-colors"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="design, motion, 3d"
          />

          <label className="text-[10px] tracking-widest uppercase opacity-40">Link</label>
          <input
            className="bg-transparent border border-neutral-800 px-3 py-2.5 text-xs outline-none focus:border-neutral-500 transition-colors"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <button onClick={add} disabled={saving || !img} className="border border-neutral-700 px-4 py-2.5 text-[10px] tracking-widest uppercase hover:bg-neutral-800 transition-colors disabled:opacity-30">
          {saving ? "adding..." : "add"}
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 gap-3">
        {works.map((w) => (
          <div key={w._id} className="group relative aspect-square">
            <img src={w.img} alt="" className="w-full h-full object-cover grayscale opacity-70" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <span className="text-[9px] tracking-widest opacity-60">{String(w.index).padStart(2, "0")}</span>
              <button onClick={() => remove(w._id)} className="text-[9px] text-red-400/80 tracking-widest hover:text-red-400">
                remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}