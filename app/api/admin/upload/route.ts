import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File
  const folder = (formData.get("folder") as string) || "portfolio"

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())

  const result = await new Promise<{ secure_url: string; public_id: string }>(
    (resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (err, res) => {
          if (err || !res) return reject(err)
          resolve(res)
        })
        .end(buffer)
    }
  )

  return NextResponse.json({ url: result.secure_url, publicId: result.public_id })
}