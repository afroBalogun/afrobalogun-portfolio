import About from "@/components/About"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About — Obasa Temiloluwa",
  description: "Creative developer from Nigeria. I build and design thoughtful digital experiences across frontend, fullstack, and interactive web.",
  keywords: ["Obasa Temiloluwa", "about", "creative developer", "frontend developer", "fullstack developer", "Nigeria"],
}

export default function Page(){
  return(
    <>
    <About/>
    </>
  )
}