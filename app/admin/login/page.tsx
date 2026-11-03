"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {
  const router = useRouter()
  const [pw, setPw]       = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      body: JSON.stringify({ password: pw }),
      headers: { "Content-Type": "application/json" },
    })
    setLoading(false)
    if (res.ok) router.push("/admin")
    else setError("wrong password")
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-primary text-secondary flex items-center justify-center">
      <div className="flex flex-col gap-6 w-72">
        <p className="text-xs tracking-[0.2em] uppercase opacity-40">admin / login</p>

        <input
          type="password"
          placeholder="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="bg-transparent border border-secondary/15 px-4 py-3 text-sm outline-none focus:border-secondary/50 transition-colors"
        />

        {error && <p className="text-2xs text-red-700 tracking-widest">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="border border-secondary/25 px-4 py-3 text-xs tracking-[0.2em] uppercase hover:bg-secondary/5 transition-colors disabled:opacity-30"
        >
          {loading ? "..." : "enter"}
        </button>
      </div>
    </main>
  )
}