"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

const nav = [
  { label: "Dashboard",  href: "/admin"            },
  { label: "Projects",   href: "/admin/projects"   },
  { label: "Playground", href: "/admin/playground" },
]

export function AdminNav() {
  const pathname = usePathname()
  const router   = useRouter()

  if (pathname === "/admin/login") return null

  const logout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" })
    router.push("/admin/login")
  }
  const active = (href: string) => (href === "/admin" ? pathname === href : pathname.startsWith(href))

  return (
    <aside className="sticky top-0 h-svh w-56 shrink-0 bg-ink text-cream flex flex-col justify-between p-6">
      <div className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <Link href="/" className="font-display text-lg font-bold tracking-tight"><span className="text-[#FF8A3D]">/</span>afroBalogun</Link>
          <span className="w-fit -rotate-2 bg-lime px-1.5 font-inter text-xs font-black uppercase text-ink">Admin</span>
        </div>
        <nav className="flex flex-col gap-1.5">
          {nav.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active(href) ? "bg-lime text-ink" : "text-cream/70 hover:bg-cream/10 hover:text-cream"}`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex flex-col gap-3">
        <Link href="/" className="font-mono text-2xs uppercase tracking-widest text-cream/50 hover:text-cream">View site ↗</Link>
        <button onClick={logout} className="w-fit font-mono text-2xs uppercase tracking-widest text-cream/50 hover:text-[#FF8A3D]">Log out</button>
      </div>
    </aside>
  )
}
