import { Schema, model, models, Document } from "mongoose"

export interface IPlaygroundWork extends Document {
  index: number
  img: string
  tags?: string[]
  link: string
  createdAt: Date
}

const PlaygroundWorkSchema = new Schema<IPlaygroundWork>(
  {
    index: { type: Number, required: true, unique: true },
    img: { type: String, required: true },
    link: { type: String, required: true},
    tags: { type: [String], default: [] },
  },
  { timestamps: true }
)

export const PlaygroundWork =
  models.PlaygroundWork ||
  model<IPlaygroundWork>("PlaygroundWork", PlaygroundWorkSchema)