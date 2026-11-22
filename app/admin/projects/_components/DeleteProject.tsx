"use client"

import { useRouter } from "next/navigation"
import { ui } from "@/components/admin/ui"

export function DeleteProject({ slug }: { slug: string }) {
  const router = useRouter()

  const del = async () => {
    if (!confirm(`Delete "${slug}"? This can't be undone.`)) return
    await fetch(`/api/projects/${slug}`, { method: "DELETE" })
    router.refresh()
  }

  return <button onClick={del} className={ui.danger}>Delete</button>
}
