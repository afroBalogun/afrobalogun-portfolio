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
    <main className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center font-mono">
      <div className="flex flex-col gap-6 w-72">
        <p className="text-xs tracking-[0.2em] uppercase opacity-40">admin / login</p>

        <input
          type="password"
          placeholder="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="bg-transparent border border-neutral-800 px-4 py-3 text-sm outline-none focus:border-neutral-500 transition-colors"
        />

        {error && <p className="text-[10px] text-red-400 tracking-widest">{error}</p>}

        <button
          onClick={submit}
          disabled={loading}
          className="border border-neutral-700 px-4 py-3 text-xs tracking-[0.2em] uppercase hover:bg-neutral-800 transition-colors disabled:opacity-30"
        >
          {loading ? "..." : "enter"}
        </button>
      </div>
    </main>
  )
}