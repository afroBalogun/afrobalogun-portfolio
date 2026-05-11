import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { PlaygroundWork } from "@/models/PlaygroundWork"

// GET /api/playground
export async function GET() {
  await connectDB()
  const works = await PlaygroundWork.find().sort({ index: 1 })
  return NextResponse.json(works)
}

// POST /api/playground
export async function POST(req: Request) {
  await connectDB()

  const body = await req.json()
  const { index, img, tags, link } = body

  if (index === undefined || !img || !link) {
    return NextResponse.json({ error: "index, img, and link are required" }, { status: 400 })
  }

  const work = await PlaygroundWork.create({ index, img, tags, link })
  return NextResponse.json(work, { status: 201 })
}

