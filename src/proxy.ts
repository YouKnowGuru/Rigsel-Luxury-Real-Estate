import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Protected routes that require authentication
const protectedRoutes = ["/admin/dashboard", "/admin/properties", "/admin/inquiries", "/admin/settings"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get token from cookies
    const token = request.cookies.get("adminToken")?.value;

    // If no token, redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      // Clear invalid token cookie and redirect
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("adminToken");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
