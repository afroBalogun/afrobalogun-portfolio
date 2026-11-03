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
    <button onClick={del} className="text-2xs tracking-widest text-red-700/70 hover:text-red-700 transition-colors">
      delete
    </button>
  )
}