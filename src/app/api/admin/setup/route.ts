import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";

// POST /api/admin/setup - Create initial admin user
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { username, password } = await request.json();

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, error: "Admin user already exists" },
        { status: 400 }
      );
    }

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
  } catch (error: any) {
    console.error("Setup error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
