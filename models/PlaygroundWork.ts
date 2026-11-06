import { Schema, model, models, Document } from "mongoose"

export interface IPlaygroundWork extends Document {
  index: number        // sort order; assigned by the API, never shown (the UI shows position)
  img: string
  title?: string       // preview heading + image alt text
  tags?: string[]
  link?: string        // optional: sketches and rejected versions often have nowhere to go
  createdAt: Date
}

const PlaygroundWorkSchema = new Schema<IPlaygroundWork>(
  {
    index: { type: Number, required: true, unique: true },
    img: { type: String, required: true },
    title: { type: String, trim: true },
    link: { type: String, trim: true },
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
)

// request bodies are untrusted: keep only non-empty strings
export function cleanTags(tags: unknown): string[] {
  return Array.isArray(tags) ? tags.filter((t): t is string => typeof t === "string" && t.trim() !== "").map((t) => t.trim()) : []
}

export const PlaygroundWork =
  models.PlaygroundWork ||
  model<IPlaygroundWork>("PlaygroundWork", PlaygroundWorkSchema)
