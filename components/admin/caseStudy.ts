// Which parts of a case study are filled in, so the admin can show what's missing.
type Story = { summary?: string; problem?: { headline?: string }; highlights?: unknown[]; results?: unknown[]; outcome?: string }

export const STORY_PARTS: { key: string; label: string; done: (p: Story) => boolean }[] = [
  { key: "summary", label: "Outcome line", done: (p) => !!p.summary?.trim() },
  { key: "problem", label: "Problem", done: (p) => !!p.problem?.headline?.trim() },
  { key: "highlights", label: "Under the bonnet", done: (p) => (p.highlights?.length ?? 0) > 0 },
  { key: "results", label: "Results", done: (p) => (p.results?.length ?? 0) > 0 },
  { key: "outcome", label: "Closing line", done: (p) => !!p.outcome?.trim() },
]

export const missingParts = (p: Story) => STORY_PARTS.filter((s) => !s.done(p)).map((s) => s.label)
