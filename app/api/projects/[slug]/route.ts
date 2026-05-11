import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"

// GET /api/projects/[project]
export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB()
  const { slug } = await params

  const all = await Project.find().sort({ year: -1, createdAt: -1 }).lean()
  const index = all.findIndex((p) => p.slug === slug)
  if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const project = all[index]
  const next = all[(index + 1) % all.length]

  return NextResponse.json({ ...project, nextProject: { slug: next.slug, title: next.title } })
}

export async function PATCH(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB()
  const { slug } = await params
  const body = await req.json()
  const project = await Project.findOneAndUpdate({ slug }, { $set: body }, { new: true, runValidators: true })
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(project)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  await connectDB()
  const { slug } = await params
  await Project.findOneAndDelete({ slug })
  return NextResponse.json({ deleted: true })
}