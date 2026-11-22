import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"
import { PlaygroundWork } from "@/models/PlaygroundWork"
import Link from "next/link"
import { connection } from "next/server"
import { ui } from "@/components/admin/ui"
import { missingParts } from "@/components/admin/caseStudy"

export default async function AdminDashboard() {
  await connection() // render per request so counts aren't frozen at build time
  let projectCount = 0
  let playgroundCount = 0
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let recent: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let incomplete: any[] = []
  let dbError = false

  try {
    await connectDB()
    ;[projectCount, playgroundCount] = await Promise.all([Project.countDocuments(), PlaygroundWork.countDocuments()])
    recent = await Project.find().sort({ updatedAt: -1 }).limit(4).lean()
    incomplete = (await Project.find().lean()).filter((p) => missingParts(p).length > 0)
  } catch {
    dbError = true
  }

  return (
    <div className="flex flex-col gap-10 max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h1 className={ui.title}>Dashboard</h1>
        <div className="flex gap-3">
          <Link href="/admin/projects/new" className={ui.primary}>+ New project</Link>
          <Link href="/admin/playground" className={ui.secondary}>Playground</Link>
        </div>
      </div>

      {dbError && (
        <p className="rounded-xl bg-[#FF8A3D]/15 px-4 py-3 text-sm ring-1 ring-[#FF8A3D]/40">
          Database unreachable. Check the connection string in your environment and the Atlas IP allowlist.
        </p>
      )}

      {/* counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Projects", count: projectCount, tone: "bg-lime" },
          { label: "Playground pieces", count: playgroundCount, tone: "bg-violet text-cream" },
          { label: "Case studies to finish", count: incomplete.length, tone: "bg-[#FF8A3D]" },
        ].map(({ label, count, tone }) => (
          <div key={label} className={`flex flex-col gap-2 rounded-2xl p-6 ${tone}`}>
            <span className="font-display font-extrabold [font-stretch:62%] text-6xl leading-none">{count}</span>
            <span className="font-mono text-2xs uppercase tracking-widest">{label}</span>
          </div>
        ))}
      </div>

      {/* recently edited */}
      <section className={ui.section}>
        <h2 className={ui.sectionTitle}>Recently edited</h2>
        <ul className="flex flex-col">
          {recent.map((p) => (
            <li key={p.slug} className="border-b border-ink/10 last:border-0">
              <Link href={`/admin/projects/${p.slug}`} className="group flex items-center gap-4 py-3">
                {p.coverImg && <img src={p.coverImg} alt="" className="size-12 rounded-lg object-cover" />}
                <span className="flex-1">
                  <span className="block font-medium group-hover:text-violet">{p.title}</span>
                  <span className="block text-sm text-ink/55">{p.year} · {p.role}</span>
                </span>
                {missingParts(p).length > 0 && <span className={`${ui.tag} bg-[#FF8A3D]/20`}>{missingParts(p).length} to finish</span>}
                <span className="text-ink/40 group-hover:text-ink">→</span>
              </Link>
            </li>
          ))}
          {!recent.length && !dbError && <li className="text-sm text-ink/55">No projects yet.</li>}
        </ul>
      </section>
    </div>
  )
}
