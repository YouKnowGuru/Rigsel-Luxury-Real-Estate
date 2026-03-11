import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { verifyToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/mail";
import { getAdminNotificationEmail, getUserAutoReplyEmail } from "@/lib/email-templates";

// GET /api/contact - Get all contact messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    const messages = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("propertyId", "title")
      .lean();

    const total = await Contact.countDocuments();

    return NextResponse.json({
      success: true,
      data: messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST /api/contact - Create new contact message
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ["name", "phone", "email", "message"];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    const contact = await Contact.create(body);

    // Send emails asynchronously (don't block the response)
    // 1. Notify Admin
    (async () => {
      let propertyTitle = "";
      if (body.propertyId) {
        const Property = (await import("@/models/Property")).default;
        const prop = await Property.findById(body.propertyId).select("title").lean();
        if (prop) propertyTitle = (prop as any).title;
      }

      sendEmail({
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER || "",
        subject: `New Inquiry from ${body.name}`,
        html: getAdminNotificationEmail({ ...body, propertyTitle }),
      }).catch(err => console.error("Admin Email Failure:", err));
    })();

    // 2. Auto-reply to User
    sendEmail({
      to: body.email,
      subject: "Thank you for contacting Phojaa Real Estate",
      html: getUserAutoReplyEmail(body.name),
    }).catch(err => console.error("User Auto-reply Failure:", err));

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us. We'll get back to you soon!",
        data: contact
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating contact message:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
