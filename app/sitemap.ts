import { MetadataRoute } from "next";
import { navLinks } from "../components/Navbar";

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