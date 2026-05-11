"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const nav = [
  { label: "dashboard",  href: "/admin"            },
  { label: "projects",   href: "/admin/projects"   },
  { label: "playground", href: "/admin/playground" },
]

export function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()

  if (pathname === "/admin/login") return null

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }

  return (
    <aside className="w-52 border-r border-neutral-800 flex flex-col justify-between py-10 px-6 shrink-0">
      <div className="flex flex-col gap-8">
        <p className="text-[10px] tracking-[0.2em] uppercase opacity-30">afroBalogun</p>
        <nav className="flex flex-col gap-3">
          {nav.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-xs tracking-widest transition-opacity ${
                pathname === href ? "opacity-100" : "opacity-30 hover:opacity-60"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <button
        onClick={logout}
        className="text-[10px] tracking-widest uppercase opacity-20 hover:opacity-60 text-left transition-opacity"
      >
        logout
      </button>
    </aside>
  )
}