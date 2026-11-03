import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Work from "../../../components/Work"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects/${slug}`)
  if (res.status === 404) notFound()
  const project = res.ok ? await res.json() : null

  return {
    title: `${project?.client} — Obasa Temiloluwa`,
    description: project?.description || "A project by Obasa Temiloluwa.",
    keywords: [
      project?.client,
      project?.role,
      "Obasa Temiloluwa",
      "creative developer",
      "portfolio project",
    ].filter(Boolean),
    openGraph: {
      title: `${project?.client} — Obasa Temiloluwa`,
      description: project?.description || "A project by Obasa Temiloluwa.",
      images: project?.coverImg ? [{ url: project.coverImg }] : [],
    },
  }
}

export default function Page() {
  return <Work />
}