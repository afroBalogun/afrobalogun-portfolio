import { MetadataRoute } from "next";

export const navLinks = [
  { title: "home",       href: "/",           angle: 0   },
  { title: "about",      href: "/about",       angle: 45  },
  { title: "works",      href: "/works",       angle: 135 },
  { title: "playground", href: "/playground",  angle: 225 },
  { title: "contact",    href: "/contact",     angle: 315 },
]
export default async function sitemap(): Promise<MetadataRoute.Sitemap>{
    const pageEntries = navLinks.slice(1).map((page) => {
        return {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}${page.href}`
        }
    })
    return [
        ...pageEntries
    ]
}