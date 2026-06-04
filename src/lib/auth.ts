import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { requireCsrfToken } from "@/lib/csrf";

/**
 * Get admin token from httpOnly cookie, with fallback to Authorization header.
 * This supports both cookie-based auth (new) and header-based auth (legacy).
 */
export async function getAdminToken(request: NextRequest): Promise<string | undefined> {
    // First try the httpOnly cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("adminToken")?.value;
    if (cookieToken) return cookieToken;

    // Fallback to Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return undefined;
}

/**
 * Get admin token from Request object (for non-NextRequest usage).
 */
export async function getAdminTokenFromRequest(request: Request): Promise<string | undefined> {
    // First try the httpOnly cookie
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("adminToken")?.value;
    if (cookieToken) return cookieToken;

    // Fallback to Authorization header
    const authHeader = request.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
        return authHeader.split(" ")[1];
    }

    return undefined;
}

/**
 * Verify CSRF token for state-changing requests.
 * Use this in POST/PUT/PATCH/DELETE handlers that use cookie authentication.
 */
export async function verifyCsrfProtection(request: Request): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Only require CSRF for cookie-based auth
  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // Bearer token auth doesn't need CSRF
    return { valid: true };
  }

  return requireCsrfToken(request);
}
