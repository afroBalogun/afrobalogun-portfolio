import { NextResponse } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { PlaygroundWork } from "@/models/PlaygroundWork"

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  await connectDB()
  const { id } = await params
  await PlaygroundWork.findByIdAndDelete(id)
  return NextResponse.json({ deleted: true })
}