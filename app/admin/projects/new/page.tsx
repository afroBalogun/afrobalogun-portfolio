import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProject() {
  return (
    <div className="flex flex-col gap-8">
      <p className="text-xs tracking-[0.2em] uppercase opacity-40">new project</p>
      <ProjectForm mode="create" />
    </div>
  )
}