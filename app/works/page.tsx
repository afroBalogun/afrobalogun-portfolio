import { Metadata } from "next";
import Works from "../../components/Works";

export const metadata: Metadata = {
  title: "Works — Obasa Temiloluwa",
  description: "Selected projects spanning frontend development, fullstack engineering, and creative design.",
  keywords: ["Obasa Temiloluwa", "works", "projects", "portfolio", "frontend", "fullstack", "web design", "creative development"],
}

function page() {
  return (
    <>
      <Works/>
    </>
  )
}

export default page
