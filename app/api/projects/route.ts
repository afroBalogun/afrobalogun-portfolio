import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { Project } from "@/models/Project"

// GET /api/projects?year=2026
export async function GET(req: Request) {
  await connectDB()

  const { searchParams } = new URL(req.url)
  const year = searchParams.get("year")

  const filter = year ? { year: Number(year) } : {}
  const projects = await Project.find(filter).sort({ year: -1, createdAt: -1 })

  return NextResponse.json(projects)
}

// POST /api/projects
export async function POST(req: Request) {
  await connectDB()

  const { title, year, role, coverImg, images, ratio, link, description, client, body } = await req.json()
  if (!title || !year || !role || !coverImg || !ratio || !description || !client) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

  const existing = await Project.findOne({ slug })
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 })
  }

  const project = await Project.create({ title, slug, year, role, coverImg, images, ratio, link, description, client, body })
  return NextResponse.json(project, { status: 201 })
}