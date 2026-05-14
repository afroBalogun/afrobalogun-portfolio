import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = req.cookies.get("admin_token")?.value
    const valid = token ? await verifyToken(token) : null

    if (!valid) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  }

  return NextResponse.next()
}

export const config = { matcher: ["/admin/:path*"] }