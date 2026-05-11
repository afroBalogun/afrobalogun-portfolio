"use client"

import { useRouter } from "next/navigation"

export function DeleteProject({ slug }: { slug: string }) {
  const router = useRouter()

  const del = async () => {
    if (!confirm(`delete ${slug}?`)) return
    await fetch(`/api/projects/${slug}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <button onClick={del} className="text-[10px] tracking-widest text-red-400/60 hover:text-red-400 transition-colors">
      delete
    </button>
  )
}