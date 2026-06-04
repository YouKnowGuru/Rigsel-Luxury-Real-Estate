import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { adminSetupSchema } from "@/lib/validation";

// POST /api/admin/setup - Create initial admin user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    // Check if admin already exists
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return NextResponse.json(
        { success: false, error: "Setup is disabled. Admin user already exists." },
        { status: 403 }
      );
    }

    // Require setup secret - fail closed if not configured
    const setupSecret = process.env.SETUP_SECRET;
    const providedSecret = request.headers.get("x-setup-secret");

    if (!setupSecret) {
      return NextResponse.json(
        { success: false, error: "Setup is not configured. SETUP_SECRET environment variable is required." },
        { status: 403 }
      );
    }

    if (providedSecret !== setupSecret) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Invalid setup secret" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate with Zod
    const validationResult = adminSetupSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    // Create admin
    const admin = await Admin.create({
      username,
      password,
      role: "superadmin",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Admin user created successfully",
        admin: {
          id: admin._id,
          username: admin.username,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
