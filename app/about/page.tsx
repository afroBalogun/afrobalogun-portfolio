import About from "@/components/About"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About — Obasa Temiloluwa",
  description: "Hi, I'm Temi, a designer and developer in Lagos. I design digital products (sites, apps, pipelines) and build them myself, from the first sketch to launch.",
  keywords: ["Obasa Temiloluwa", "about", "designer and developer", "frontend developer", "fullstack developer", "Nigeria"],
}

export default function Page(){
  return(
    <>
    <About/>
    </>
  )
}