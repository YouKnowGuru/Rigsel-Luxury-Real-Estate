import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { logAuthEvent } from "@/lib/logger";

export async function POST(request: NextRequest) {
    const response = NextResponse.json({
        success: true,
        message: "Logged out successfully",
    });

    // Clear the adminToken cookie
    response.cookies.set("adminToken", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    // Clear CSRF nonce cookie
    response.cookies.set("csrfNonce", "", {
        httpOnly: true,
        expires: new Date(0),
        path: "/",
    });

    // Log logout event
    await logAuthEvent("LOGOUT", request);

    return response;
}
