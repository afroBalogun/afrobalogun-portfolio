import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"
import { PlaygroundWork } from "@/models/PlaygroundWork"
import Link from "next/link"

export default async function AdminDashboard() {
  let projectCount = 0
  let playgroundCount = 0
  let recent: any[] = []
  let dbError = false

  try {
    await connectDB()
    ;[projectCount, playgroundCount] = await Promise.all([
      Project.countDocuments(),
      PlaygroundWork.countDocuments(),
    ])
    recent = await Project.find().sort({ createdAt: -1 }).limit(3).lean()
  } catch (e) {
    dbError = true
  }

  return (
    <div className="flex flex-col gap-12">
      <p className="text-xs tracking-[0.2em] uppercase opacity-40">dashboard</p>

      {dbError && (
        <p className="text-[10px] text-red-400/60 tracking-widest border border-red-400/20 px-4 py-3">
          database unreachable — check your connection string and Atlas IP whitelist
        </p>
      )}
      {/* Stats */}
      <div className="flex gap-10">
        {[
          { label: "projects",   count: projectCount   },
          { label: "playground", count: playgroundCount },
        ].map(({ label, count }) => (
          <div key={label} className="flex flex-col gap-1">
            <span className="text-4xl font-mono font-semibold">{count}</span>
            <span className="text-[10px] tracking-widest uppercase opacity-30">{label}</span>
          </div>
        ))}
      </div>

      {/* Recent projects */}
      <div className="flex flex-col gap-4">
        <p className="text-[10px] tracking-widest uppercase opacity-30 border-b border-neutral-800 pb-3">
          recent
        </p>
        {recent.map((p) => (
          <Link
            key={p.slug}
            href={`/admin/projects/${p.slug}`}
            className="flex items-center gap-4 group"
          >
            {p.coverImg && (
              <img src={p.coverImg} alt="" className="w-8 h-8 object-cover grayscale opacity-50" />
            )}
            <div>
              <p className="text-xs group-hover:opacity-60 transition-opacity">{p.title}</p>
              <p className="text-[10px] opacity-30">{p.year}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="flex gap-4">
        <Link href="/admin/projects/new" className="text-[10px] tracking-widest border border-neutral-700 px-4 py-2.5 hover:bg-neutral-800 transition-colors">
          + new project
        </Link>
        <Link href="/admin/playground" className="text-[10px] tracking-widest border border-neutral-700 px-4 py-2.5 hover:bg-neutral-800 transition-colors">
          manage playground
        </Link>
      </div>
    </div>
  )
}