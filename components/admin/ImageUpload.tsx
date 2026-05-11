"use client"

import { useRef, useState } from "react"

interface Props {
  label: string
  value: string
  onChange: (url: string) => void
  folder?: string
}

export function ImageUpload({ label, value, onChange, folder = "portfolio" }: Props) {
  const inputRef  = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const upload = async (file: File) => {
    setLoading(true)
    const form = new FormData()
    form.append("file", file)
    form.append("folder", folder)
    const res  = await fetch("/api/admin/upload", { method: "POST", body: form })
    const data = await res.json()
    onChange(data.url)
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] tracking-widest uppercase opacity-40">{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-neutral-700 h-36 flex items-center justify-center cursor-pointer hover:border-neutral-500 transition-colors relative overflow-hidden"
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover grayscale" />
        ) : (
          <span className="text-[10px] opacity-30 tracking-widest">
            {loading ? "uploading..." : "click to upload"}
          </span>
        )}
        {loading && (
          <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center">
            <span className="text-[10px] tracking-widest opacity-60">uploading...</span>
          </div>
        )}
      </div>

      {value && (
        <input
          value={value}
          readOnly
          className="bg-transparent border border-neutral-800 px-3 py-2 text-[10px] opacity-40 outline-none"
        />
      )}

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