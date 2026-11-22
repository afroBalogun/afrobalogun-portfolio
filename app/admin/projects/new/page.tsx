import Link from "next/link"
import { ProjectForm } from "@/components/admin/ProjectForm"
import { ui } from "@/components/admin/ui"

export default function NewProject() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <Link href="/admin/projects" className={ui.ghost}>← Projects</Link>
        <h1 className={ui.title}>New project</h1>
      </div>
      <ProjectForm mode="create" />
    </div>
  )
}
