/**
 * CSRF Protection Module
 * Generates and validates CSRF tokens for state-changing operations.
 * Uses double-submit cookie pattern with HMAC signature.
 */

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const CSRF_SECRET = process.env.CSRF_SECRET || process.env.JWT_SECRET;

if (!CSRF_SECRET) {
  throw new Error("CSRF_SECRET or JWT_SECRET environment variable is required");
}

const secret = new TextEncoder().encode(CSRF_SECRET);

/**
 * Generate a new CSRF token.
 * Returns a signed JWT that includes a random nonce.
 */
export async function generateCsrfToken(): Promise<string> {
  const nonce = crypto.randomUUID();

  const token = await new SignJWT({ nonce, type: "csrf" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  // Set the nonce in a separate cookie for double-submit verification
  const cookieStore = await cookies();
  cookieStore.set("csrfNonce", nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });

  return token;
}

/**
 * Validate a CSRF token from the request.
 * Checks the token signature and matches the nonce with the cookie.
 */
export async function validateCsrfToken(token: string | null): Promise<boolean> {
  if (!token) return false;

  try {
    const { payload } = await jwtVerify(token, secret, {
      clockTolerance: 60,
    });

    // Verify it's a CSRF token
    if (payload.type !== "csrf" || !payload.nonce) {
      return false;
    }

    // Double-submit cookie check
    const cookieStore = await cookies();
    const nonceCookie = cookieStore.get("csrfNonce")?.value;

    if (!nonceCookie || nonceCookie !== payload.nonce) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

/**
 * Get CSRF token from request headers.
 * Checks X-CSRF-Token header first, then falls back to other common headers.
 */
export function getCsrfTokenFromHeaders(headers: Headers): string | null {
  return (
    headers.get("x-csrf-token") ||
    headers.get("X-CSRF-Token") ||
    headers.get("csrf-token") ||
    null
  );
}

/**
 * Middleware helper: Validate CSRF for state-changing requests.
 * Use this in POST/PUT/PATCH/DELETE route handlers that use cookie auth.
 */
export async function requireCsrfToken(request: Request): Promise<{
  valid: boolean;
  error?: string;
}> {
  // Skip CSRF check for non-cookie auth (e.g., API keys, Bearer tokens)
  const authHeader = request.headers.get("authorization");
  if (authHeader && !authHeader.startsWith("Bearer ")) {
    return { valid: true };
  }

  const token = getCsrfTokenFromHeaders(request.headers);

  if (!token) {
    return { valid: false, error: "CSRF token missing" };
  }

  const valid = await validateCsrfToken(token);
  if (!valid) {
    return { valid: false, error: "Invalid CSRF token" };
  }

  return { valid: true };
}
