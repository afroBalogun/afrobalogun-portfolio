"use client"

import { useEffect, useState } from "react"
import { ImageUpload } from "@/components/admin/ImageUpload"
import { PiX } from "react-icons/pi"
import { ui } from "@/components/admin/ui"

interface Work { _id: string; index: number; img: string; title?: string; link?: string; tags: string[] }

const errorOf = async (res: Response) => (await res.json().catch(() => null))?.error ?? `failed (${res.status})`

export default function Playground() {
  const [works, setWorks] = useState<Work[]>([])
  const [error, setError] = useState("")

  // add form
  const [img, setImg] = useState("")
  const [title, setTitle] = useState("")
  const [tags, setTags] = useState("")
  const [link, setLink] = useState("")
  const [saving, setSaving] = useState(false)

  // edit drawer
  const [editing, setEditing] = useState<Work | null>(null)
  const [editImg, setEditImg] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editTags, setEditTags] = useState("")
  const [editLink, setEditLink] = useState("")
  const [updating, setUpdating] = useState(false)
  const [editError, setEditError] = useState("")

  const load = async () => {
    const res = await fetch("/api/playground")
    if (res.ok) setWorks(await res.json())
    else setError(await errorOf(res))
  }

  useEffect(() => { load() }, [])

  const openEdit = (w: Work) => {
    setEditing(w)
    setEditImg(w.img)
    setEditTitle(w.title ?? "")
    setEditTags(w.tags.join(", "))
    setEditLink(w.link ?? "")
    setEditError("")
  }

  const closeEdit = () => {
    setEditing(null)
    setEditImg("")
    setEditTitle("")
    setEditTags("")
    setEditLink("")
    setEditError("")
  }

  // the server assigns the index, so no number is sent from here
  const add = async () => {
    if (!img) return
    setSaving(true)
    setError("")
    const res = await fetch("/api/playground", {
      method: "POST",
      body: JSON.stringify({
        img,
        title,
        tags: tags.split(",").map(t => t.trim()).filter(Boolean),
        link,
      }),
      headers: { "Content-Type": "application/json" },
    })
    setSaving(false)
    if (!res.ok) return setError(await errorOf(res)) // keep the form so the upload isn't lost
    setImg(""); setTitle(""); setTags(""); setLink("")
    load()
  }

  const update = async () => {
    if (!editing) return
    setUpdating(true)
    setEditError("")
    const res = await fetch(`/api/playground/${editing._id}`, {
      method: "PUT",
      body: JSON.stringify({
        img: editImg,
        title: editTitle,
        tags: editTags.split(",").map(t => t.trim()).filter(Boolean),
        link: editLink,
      }),
      headers: { "Content-Type": "application/json" },
    })
    setUpdating(false)
    if (!res.ok) return setEditError(await errorOf(res))
    closeEdit()
    load()
  }

  const remove = async (id: string) => {
    if (!confirm("remove?")) return
    setError("")
    const res = await fetch(`/api/playground/${id}`, { method: "DELETE" })
    if (!res.ok) setError(await errorOf(res))
    load()
  }

  // one labelled input, in the admin style
  const input = (label: string, value: string, onChange: (v: string) => void, placeholder = "") => (
    <label className="flex flex-col gap-1.5">
      <span className={ui.label}>{label}</span>
      <input className={ui.field} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </label>
  )

  return (
    <div className="flex flex-col gap-10 max-w-6xl">
      <h1 className={ui.title}>Playground</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[20rem_1fr] gap-8 items-start">
        {/* add a piece */}
        <section className={ui.section}>
          <h2 className={ui.sectionTitle}>Add a piece</h2>
          <ImageUpload label="Image" value={img} onChange={setImg} folder="portfolio/playground" />
          {input("Title (optional)", title, setTitle, "Shown in the preview, and used as alt text")}
          {input("Tags (comma separated)", tags, setTags, "design, motion, 3d")}
          {input("Link (optional)", link, setLink, "https://")}
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button onClick={add} disabled={saving || !img} className={`${ui.primary} self-start`}>{saving ? "Adding…" : "Add piece"}</button>
        </section>

        {/* the pieces */}
        <section className={ui.section}>
          <h2 className={ui.sectionTitle}>On the page <span className="font-mono text-xs font-normal text-ink/50">({works.length})</span></h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {works.map((w) => (
              <div key={w._id} className="flex flex-col gap-2">
                <img src={w.img} alt="" className="aspect-square w-full rounded-xl object-cover object-top ring-1 ring-ink/10" />
                <p className="truncate text-sm font-medium">{w.title || <span className="text-ink/40">Untitled</span>}</p>
                {w.tags.length > 0 && <p className="truncate font-mono text-2xs uppercase tracking-widest text-ink/55">{w.tags.join(" / ")}</p>}
                <div className="flex gap-4">
                  <button onClick={() => openEdit(w)} className={ui.ghost}>Edit</button>
                  <button onClick={() => remove(w._id)} className={ui.danger}>Remove</button>
                </div>
              </div>
            ))}
            {!works.length && <p className="col-span-full text-sm text-ink/55">Nothing here yet.</p>}
          </div>
        </section>
      </div>

      {/* edit drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/40" onClick={closeEdit} />
          <div role="dialog" aria-modal="true" aria-label="Edit piece" className="relative z-10 flex h-full w-full max-w-md flex-col overflow-y-auto bg-cream">
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h2 className={ui.sectionTitle}>Edit piece</h2>
              <button onClick={closeEdit} aria-label="Close" className="text-ink/50 hover:text-ink"><PiX size={16} /></button>
            </div>
            <div className="flex flex-1 flex-col gap-5 p-6">
              <ImageUpload label="Image" value={editImg} onChange={setEditImg} folder="portfolio/playground" />
              {input("Title (optional)", editTitle, setEditTitle)}
              {input("Tags (comma separated)", editTags, setEditTags, "design, motion, 3d")}
              {input("Link (optional)", editLink, setEditLink, "https://")}
              {editError && <p className="text-sm text-red-700">{editError}</p>}
            </div>
            <div className="border-t border-ink/10 px-6 py-5">
              <button onClick={update} disabled={updating || !editImg} className={`${ui.primary} w-full`}>{updating ? "Saving…" : "Save changes"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
