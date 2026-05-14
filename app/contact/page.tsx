import { Metadata } from "next";
import Contact from "../../components/Contact";

export const metadata: Metadata = {
  title: "Contact — Obasa Temiloluwa",
  description: "Get in touch — open to work, collaborations, and interesting projects.",
  keywords: ["Obasa Temiloluwa", "contact", "hire", "freelance", "collaboration", "creative developer Nigeria"],
}

export default function Page(){
  return(
    <>
    <Contact/>
    </>
  )
}