import Link from "next/link"
import { ProjectForm } from "@/components/admin/ProjectForm"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"
import { notFound } from "next/navigation"
import { ui } from "@/components/admin/ui"

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const project = await Project.findOne({ slug }).lean()
  if (!project) notFound()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/projects" className={ui.ghost}>← Projects</Link>
        <h1 className={ui.title}>{project.title}</h1>
      </div>
      {/* a plain JSON copy: database ids and dates aren't plain values a client component can take */}
      <ProjectForm mode="edit" initial={JSON.parse(JSON.stringify(project))} />
    </div>
  )
}
