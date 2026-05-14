import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { PlaygroundWork } from "@/models/PlaygroundWork"

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  await connectDB()
  const { id } = await params
  const body = await req.json()
  const updated = await PlaygroundWork.findByIdAndUpdate(
    id,
    { $set: { img: body.img, tags: body.tags, link: body.link } },
    { new: true }
  )
  return NextResponse.json(updated)
}

export async function DELETE(_: Request, { params }: Ctx) {
  await connectDB()
  const { id } = await params
  await PlaygroundWork.findByIdAndDelete(id)
  return NextResponse.json({ deleted: true })
}