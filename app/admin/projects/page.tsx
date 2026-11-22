import Link from "next/link"
import { connection } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"
import { DeleteProject } from "./_components/DeleteProject"
import { ui } from "@/components/admin/ui"
import { missingParts } from "@/components/admin/caseStudy"

export default async function Projects() {
  await connection() // render per request so the list isn't frozen at build time
  await connectDB()
  const projects = await Project.find().sort({ year: -1 }).lean()

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className={ui.title}>Projects</h1>
        <Link href="/admin/projects/new" className={ui.primary}>+ New project</Link>
      </div>

      <ul className="flex flex-col gap-3">
        {projects.map((p) => {
          const missing = missingParts(p)
          return (
            <li key={p.slug} className="flex flex-wrap items-center gap-5 rounded-2xl bg-white/70 p-4 ring-1 ring-ink/10">
              {p.coverImg && <img src={p.coverImg} alt="" className="h-16 w-24 rounded-lg object-cover" />}
              <div className="flex-1 min-w-48">
                <Link href={`/admin/projects/${p.slug}`} className="font-medium hover:text-violet">{p.title}</Link>
                <p className="text-sm text-ink/55">{p.year} · {p.role} · {p.client}</p>
                <p className="mt-2 flex flex-wrap gap-1.5">
                  {missing.length === 0
                    ? <span className={`${ui.tag} bg-lime`}>Case study complete</span>
                    : missing.map((m) => <span key={m} className={`${ui.tag} bg-[#FF8A3D]/20`}>Needs {m.toLowerCase()}</span>)}
                </p>
              </div>
              <div className="flex items-center gap-5">
                <Link href={`/works/${p.slug}`} target="_blank" className={ui.ghost}>View ↗</Link>
                <Link href={`/admin/projects/${p.slug}`} className={ui.secondary}>Edit</Link>
                <DeleteProject slug={p.slug} />
              </div>
            </li>
          )
        })}
        {!projects.length && <li className="text-sm text-ink/55">No projects yet.</li>}
      </ul>
    </div>
  )
}
