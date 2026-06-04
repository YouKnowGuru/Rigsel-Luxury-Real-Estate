import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { generateToken } from "@/lib/jwt";
import { generateCsrfToken } from "@/lib/csrf";
import bcrypt from "bcryptjs";
import { adminLoginSchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { logAuthEvent } from "@/lib/logger";

// POST /api/admin/login - Admin login
export async function POST(request: NextRequest) {
  try {
    // Rate limit login attempts
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`login_${clientIP}`, 5, 15 * 60 * 1000); // 5 per 15 minutes
    if (!rateLimit.success) {
      await logAuthEvent("LOGIN_FAILURE", request, {
        error: "Rate limit exceeded",
        details: { reason: "rate_limit", ip: clientIP },
      });
      return NextResponse.json(
        { success: false, error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate with Zod
    const validationResult = adminLoginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // Find admin
    const admin = await Admin.findOne({ username }).select("+password");

    if (!admin) {
      await logAuthEvent("LOGIN_FAILURE", request, {
        username,
        error: "Invalid credentials - user not found",
      });
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      await logAuthEvent("LOGIN_FAILURE", request, {
        username: admin.username,
        userId: admin._id.toString(),
        error: "Invalid credentials - wrong password",
      });
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken({
      userId: admin._id.toString(),
      username: admin.username,
      role: admin.role,
    });

    // Generate CSRF token for subsequent state-changing requests
    const csrfToken = await generateCsrfToken();

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      csrfToken,
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      },
    });

    // Set auth cookie
    response.cookies.set("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Log successful login
    await logAuthEvent("LOGIN_SUCCESS", request, {
      userId: admin._id.toString(),
      username: admin.username,
    });

    return response;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    await logAuthEvent("LOGIN_FAILURE", request, {
      error: errorMessage,
    });
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
