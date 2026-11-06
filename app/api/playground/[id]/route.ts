import { NextResponse } from "next/server"
import { isValidObjectId, Error as MongooseError } from "mongoose"
import { connectDB } from "@/lib/mongodb"
import { PlaygroundWork, cleanTags } from "@/models/PlaygroundWork"

type Ctx = { params: Promise<{ id: string }> }

export async function PUT(req: Request, { params }: Ctx) {
  const { id } = await params
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await connectDB()
  const body = await req.json()
  try {
    const updated = await PlaygroundWork.findByIdAndUpdate(
      id,
      { $set: { img: body.img, title: body.title, tags: cleanTags(body.tags), link: body.link } },
      { new: true, runValidators: true }
    )
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e) {
    if (e instanceof MongooseError.ValidationError) return NextResponse.json({ error: e.message }, { status: 400 })
    throw e
  }
}

export async function DELETE(_: Request, { params }: Ctx) {
  const { id } = await params
  if (!isValidObjectId(id)) return NextResponse.json({ error: "Invalid id" }, { status: 400 })

  await connectDB()
  const deleted = await PlaygroundWork.findByIdAndDelete(id)
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ deleted: true })
}
