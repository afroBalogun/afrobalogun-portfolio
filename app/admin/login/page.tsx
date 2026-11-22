"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ui } from "@/components/admin/ui"

export default function Login() {
  const router = useRouter()
  const [pw, setPw]       = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password: pw }),
      headers: { "Content-Type": "application/json" },
    })
    setLoading(false)
    if (res.ok) router.push("/admin")
    else setError("Wrong password")
  }

  return (
    <div className="min-h-[80svh] w-full grid place-items-center">
      <form onSubmit={submit} className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex flex-col gap-3">
          <span className="w-fit -rotate-2 bg-lime px-1.5 font-inter text-sm font-black uppercase">Admin</span>
          <h1 className={ui.title}>Welcome back</h1>
        </div>
        <label className="flex flex-col gap-2">
          <span className={ui.label}>Password</span>
          <input type="password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} className={ui.field} />
        </label>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={loading || !pw} className={`${ui.primary} self-start`}>{loading ? "Checking…" : "Enter →"}</button>
      </form>
    </div>
  )
}
