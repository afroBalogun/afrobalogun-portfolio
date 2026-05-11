import { Schema, model, models, Document } from "mongoose"

export interface IProject extends Document {
  title: string        // "EET Yellow Pages"  →  used as page heading
  slug: string         // "eet-yellow-pages"  →  URL param
  client: string       // "EET / CGCC"        →  client name display
  description: string  // client bio paragraph (client-desc)
  year: number
  role: string         // "Fullstack Engineer"
  body: string[]       // the body copy paragraphs (body-text[])
  coverImg: string     // hero image URL
  images: string[]     // all img-mask slots in order
  ratio: 1 | 2 | 3     // card aspect ratio on /works listing
  link?: string        // external live link
  createdAt: Date
}

const ProjectSchema = new Schema<IProject>(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true, lowercase: true },
    client:      { type: String, required: true },
    description: { type: String, required: true },
    year:        { type: Number, required: true },
    role:        { type: String, required: true },
    body:        { type: [String], default: [] },
    coverImg:    { type: String, required: true },
    images:      { type: [String], default: [] },
    ratio:       { type: Number, enum: [1, 2, 3], required: true },
    link:        { type: String },
  },
  { timestamps: true }
)

export const Project = models.Project || model<IProject>("Project", ProjectSchema)