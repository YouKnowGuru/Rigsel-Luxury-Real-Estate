import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/jwt";

// Protected routes that require authentication
const protectedRoutes = ["/admin/dashboard", "/admin/properties", "/admin/inquiries", "/admin/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  console.log(`MIDDLEWARE DEBUG: Pathname = ${pathname}`);

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    // Get token from cookies
    const token = request.cookies.get("adminToken")?.value;
    console.log(`Middleware: ${pathname} is protected. Token found: ${!!token}`);

    // If no token, redirect to login
    if (!token) {
      console.log(`Middleware: No token for ${pathname}, redirecting to /admin`);
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Verify token
    const decoded = await verifyToken(token);
    if (!decoded) {
      console.log(`Middleware: Invalid token for ${pathname}, clearing cookie and redirecting`);
      // Clear invalid token cookie and redirect
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("adminToken");
      return response;
    }
    console.log(`Middleware: Token verified for ${pathname}, allowing access`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
