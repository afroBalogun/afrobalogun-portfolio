import { ProjectForm } from "@/components/admin/ProjectForm"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"
import { notFound } from "next/navigation"

export default async function EditProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  await connectDB()
  const project = await Project.findOne({ slug }).lean()
  if (!project) notFound()

  return (
    <div className="flex flex-col gap-8">
      <p className="text-xs tracking-[0.2em] uppercase opacity-40">edit / {slug}</p>
      <ProjectForm mode="edit" initial={project as any} />
    </div>
  )
}