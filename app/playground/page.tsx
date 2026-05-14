import { Metadata } from "next";
import Playground from "../../components/Playground";

export const metadata: Metadata = {
  title: "Playground — Obasa Temiloluwa",
  description: "Explorations, experiments, and rejected ideas. A space for random designs and creative play.",
  keywords: ["Obasa Temiloluwa", "playground", "experiments", "explorations", "design explorations", "creative play", "rejected designs"],
}

export default function Page() {
  return (
    <>
      <Playground />
    </>
  )
}