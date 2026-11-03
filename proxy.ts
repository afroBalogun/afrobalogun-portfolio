import { NextRequest, NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminPage = pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")
  // public site only reads; every write (and the upload route) needs the admin cookie
  const isApiWrite = pathname.startsWith("/api/") && req.method !== "GET" && pathname !== "/api/admin/auth"

  if (!isAdminPage && !isApiWrite) return NextResponse.next()

  const token = req.cookies.get("admin_token")?.value
  const valid = token ? await verifyToken(token) : null
  if (valid) return NextResponse.next()

  return isApiWrite
    ? NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    : NextResponse.redirect(new URL("/admin/login", req.url))
}

export const config = { matcher: ["/admin/:path*", "/api/:path*"] }
