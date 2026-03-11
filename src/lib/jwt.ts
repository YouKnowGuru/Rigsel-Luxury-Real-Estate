import { SignJWT, jwtVerify, decodeJwt } from "jose";
import { JWTPayload } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
if (!process.env.JWT_SECRET) {
  console.warn("JWT_SECRET is missing from process.env, using fallback!");
}
const secret = new TextEncoder().encode(JWT_SECRET);

export async function generateToken(payload: Omit<JWTPayload, "iat" | "exp">): Promise<string> {
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    return decodeJwt(token) as unknown as JWTPayload;
  } catch (error) {
    return null;
  }
}
