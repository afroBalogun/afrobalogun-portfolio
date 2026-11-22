import { Schema, model, models, Document } from "mongoose"

// A case study. The story fields (summary → problem → highlights → results → outcome) are optional so older projects
// keep working; the case-study page shows each section only when it has content.
export interface IProject extends Document {
  title: string        // "EET Yellow Pages"  →  used as page heading
  slug: string         // "eet-yellow-pages"  →  URL param
  client: string       // "EET / CGCC"        →  client name display
  description: string  // about the client / the project in a paragraph
  year: number
  role: string         // "Fullstack Engineer"
  body: string[]       // "the work": what I did, in paragraphs
  coverImg: string     // hero image URL
  images: string[]     // gallery images, in order
  ratio: 1 | 2 | 3     // card aspect ratio on /works listing
  link?: string        // external live link
  summary?: string     // the outcome in one line, under the title
  stack: string[]      // "Next.js", "Node", "SCAPA"
  problem?: { headline: string; body: string }
  highlights: { title: string; body: string }[] // "under the bonnet": the technical wins
  results: { value: string; label: string }[]  // big numbers: "0" / "tickets oversold"
  outcome?: string     // the closing line
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
    summary:     { type: String, trim: true },
    stack:       { type: [String], default: [] },
    problem:     { type: new Schema({ headline: String, body: String }, { _id: false }) },
    highlights:  { type: [new Schema({ title: String, body: String }, { _id: false })], default: [] },
    results:     { type: [new Schema({ value: String, label: String }, { _id: false })], default: [] },
    outcome:     { type: String, trim: true },
  },
  { timestamps: true }
)

export const Project = models.Project || model<IProject>("Project", ProjectSchema)
