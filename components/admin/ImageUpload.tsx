"use client"

import { useRef, useState } from "react"
import { ui } from "./ui"

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
  tall?: boolean
}

export function ImageUpload({ label, value, onChange, folder = "portfolio", tall }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const upload = async (file: File) => {
    setLoading(true)
    setError("")
    const form = new FormData()
    form.append("file", file)
    form.append("folder", folder)
    const res  = await fetch("/api/admin/upload", { method: "POST", body: form })
    const data = await res.json().catch(() => ({}))
    setLoading(false)
    if (!res.ok || !data.url) return setError(data.error ?? "Upload failed")
    onChange(data.url)
  }

  return (
    <div className="flex flex-col gap-2">
      <span className={ui.label}>{label}</span>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`group relative overflow-hidden rounded-xl bg-cream ring-1 ring-ink/15 transition hover:ring-2 hover:ring-violet ${tall ? "aspect-video" : "h-36"}`}
      >
        {value ? (
          <>
            <img src={value} alt="" className="size-full object-cover" />
            <span className="absolute inset-0 grid place-items-center bg-ink/50 font-mono text-2xs uppercase tracking-widest text-cream opacity-0 transition group-hover:opacity-100">Replace</span>
          </>
        ) : (
          <span className="grid size-full place-items-center font-mono text-2xs uppercase tracking-widest text-ink/40">
            {loading ? "Uploading…" : "+ Upload image"}
          </span>
        )}
        {loading && value && <span className="absolute inset-0 grid place-items-center bg-cream/80 font-mono text-2xs uppercase tracking-widest">Uploading…</span>}
      </button>

      {value && (
        <button type="button" onClick={() => onChange("")} className={`${ui.danger} self-start`}>Remove</button>
      )}
      {error && <p className="text-xs text-red-700">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
    </div>
  )
}
