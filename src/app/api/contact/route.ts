import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { verifyToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/mail";
import { getAdminNotificationEmail, getUserAutoReplyEmail } from "@/lib/email-templates";
import { contactSchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { getAdminToken } from "@/lib/auth";

// GET /api/contact - Get all contact messages (Admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify admin token
    const token = await getAdminToken(request);
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
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
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST /api/contact - Create new contact message
export async function POST(request: NextRequest) {
  try {
    // Rate limit contact form submissions
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(`contact_post_${clientIP}`, 5, 60 * 60 * 1000); // 5 per hour
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    await connectDB();

    const body = await request.json();

    // Validate with Zod
    const validationResult = contactSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const contact = await Contact.create(validationResult.data);

    // Send emails asynchronously (don't block the response)
    // 1. Notify Admin
    (async () => {
      let propertyTitle = "";
      if (validationResult.data.propertyId) {
        const Property = (await import("@/models/Property")).default;
        const prop = await Property.findById(validationResult.data.propertyId).select("title").lean();
        if (prop && "title" in prop) propertyTitle = String(prop.title);
      }

      sendEmail({
        to: process.env.CONTACT_EMAIL || process.env.SMTP_USER || "",
        subject: `New Inquiry from ${validationResult.data.name}`,
        html: getAdminNotificationEmail({ ...validationResult.data, propertyTitle }),
      }).catch(() => { /* silently fail */ });
    })();

    // 2. Auto-reply to User
    sendEmail({
      to: validationResult.data.email,
      subject: "Thank you for contacting Phojaa Real Estate",
      html: getUserAutoReplyEmail(validationResult.data.name),
    }).catch(() => { /* silently fail */ });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you for contacting us. We'll get back to you soon!",
        data: contact
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
