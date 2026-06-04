import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SolutionInquiry from "@/models/SolutionInquiry";
import { solutionInquirySchema } from "@/lib/validation";
import { checkRateLimit, getClientIP } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/mail";
import { SERVICE_TYPE_LABELS } from "@/lib/solution-labels";

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimit = await checkRateLimit(
      `solution_inquiry_${clientIP}`,
      5,
      60 * 60 * 1000
    );
    if (!rateLimit.success) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const validation = solutionInquirySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    await connectDB();
    const inquiry = await SolutionInquiry.create(validation.data);

    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    if (adminEmail && process.env.SMTP_USER) {
      const d = validation.data;
      const serviceLabel = SERVICE_TYPE_LABELS[d.serviceType];
      try {
        await sendEmail({
          to: adminEmail,
          subject: `[Phojaa95 Solutions] New ${serviceLabel} request from ${d.name}`,
          html: `
            <h2>New project inquiry — Phojaa95 Solutions</h2>
            <p><strong>Name:</strong> ${d.name}</p>
            <p><strong>Email:</strong> ${d.email}</p>
            <p><strong>Phone:</strong> ${d.phone}</p>
            <p><strong>Service:</strong> ${serviceLabel}</p>
            ${d.projectTitle ? `<p><strong>Project title:</strong> ${d.projectTitle}</p>` : ""}
            ${d.budget ? `<p><strong>Budget:</strong> ${d.budget}</p>` : ""}
            ${d.timeline ? `<p><strong>Timeline:</strong> ${d.timeline}</p>` : ""}
            <p><strong>Requirements:</strong></p>
            <p>${d.requirements.replace(/\n/g, "<br>")}</p>
          `,
        });
      } catch (emailErr) {
        console.error("[Phojaa95 Solutions] Admin notification failed:", emailErr);
      }
    }

    return NextResponse.json({ success: true, data: { id: inquiry._id } });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
