import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";
import { verifyToken } from "@/lib/jwt";
import { sendEmail } from "@/lib/mail";
import { replySchema } from "@/lib/validation";
import { sanitizeEmailHtml } from "@/lib/sanitize";
import { getAdminToken } from "@/lib/auth";

// POST /api/admin/inquiries/[id]/reply - Send reply email
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const token = await getAdminToken(request);
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    await connectDB();
    const body = await request.json();

    // Validate with Zod
    const validationResult = replySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { replyMessage } = validationResult.data;

    const inquiry = await Contact.findById(id);
    if (!inquiry) return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });

    // Sanitize the reply message to prevent HTML injection
    const sanitizedMessage = sanitizeEmailHtml(replyMessage);

    // Send reply email
    const emailHtml = `
      <div style="font-family: serif; padding: 40px; background-color: #f9f7f2; color: #1a1a1a; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; background: white; padding: 40px; border: 1px solid #e0d5b1;">
          <h2 style="color: #b38b24; text-transform: uppercase; letter-spacing: 4px;">Phojaa Real Estate</h2>
          <p>Dear ${sanitizeEmailHtml(inquiry.name)},</p>
          <div style="margin: 30px 0; font-style: italic; color: #444;">
            ${sanitizedMessage}
          </div>
          <p>Best Regards,</p>
          <p><strong>The Phojaa Team</strong></p>
          <hr style="border: 0; border-top: 1px solid #e0d5b1; margin: 30px 0;">
          <p style="font-size: 11px; color: #999;">You are receiving this email because you contacted us at Phojaa Real Estate.</p>
        </div>
      </div>
    `;

    const mailResult = await sendEmail({
      to: inquiry.email,
      subject: `Re: ${inquiry.subject || "Your Inquiry"}`,
      html: emailHtml,
    });

    if (!mailResult.success) {
      throw new Error(mailResult.error);
    }

    // Mark as read/replied
    inquiry.isRead = true;
    await inquiry.save();

    return NextResponse.json({ success: true, message: "Reply sent successfully" });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
