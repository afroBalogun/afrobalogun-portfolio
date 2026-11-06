import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { PlaygroundWork, cleanTags } from "@/models/PlaygroundWork"

// GET /api/playground
export async function GET() {
  await connectDB()
  const works = await PlaygroundWork.find().sort({ index: 1 })
  return NextResponse.json(works)
}

// POST /api/playground
export async function POST(req: Request) {
  const { img, title, tags, link } = await req.json()

  if (!img || typeof img !== "string") {
    return NextResponse.json({ error: "An image is required" }, { status: 400 })
  }

  await connectDB()

  // server picks the next slot so additions never collide with gaps left by deletions
  const last = await PlaygroundWork.findOne().sort({ index: -1 }).select("index").lean<{ index: number }>()
  const index = (last?.index ?? 0) + 1

  const work = await PlaygroundWork.create({ index, img, title, tags: cleanTags(tags), link })
  return NextResponse.json(work, { status: 201 })
}
