import Link from "next/link"
import { connection } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"
import { DeleteProject } from "./_components/DeleteProject"

export default async function Projects() {
  await connection() // render per request so the list isn't frozen at build time
  await connectDB()
  const projects = await Project.find().sort({ year: -1 }).lean()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <p className="text-xs tracking-[0.2em] uppercase opacity-40">projects</p>
        <Link href="/admin/projects/new" className="text-2xs tracking-widest border border-secondary/25 px-4 py-2 hover:bg-secondary/5 transition-colors">
          + new
        </Link>
      </div>

      <div className="flex flex-col gap-0">
        {projects.map((p) => (
          <div key={p.slug} className="flex items-center justify-between py-4 border-b border-secondary/15 group">
            <div className="flex items-center gap-6">
              {p.coverImg && <img src={p.coverImg} alt="" className="w-10 h-10 object-cover grayscale opacity-60" />}
              <div>
                <p className="text-xs font-medium">{p.title}</p>
                <p className="text-2xs opacity-30 mt-0.5">{p.year} · {p.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <Link href={`/admin/projects/${p.slug}`} className="text-2xs tracking-widest hover:opacity-60">edit</Link>
              <DeleteProject slug={p.slug} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}