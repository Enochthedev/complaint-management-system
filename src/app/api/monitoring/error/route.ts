import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json();

    // Log to console for development/debugging
    console.error("Application Error:", {
      message: errorData.message,
      severity: errorData.severity,
      url: errorData.url,
      context: errorData.context,
      timestamp: new Date().toISOString(),
    });

    // In production, send to external monitoring service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Sentry, LogRocket, or other monitoring service
      // await sendToSentry(errorData);
      // await sendToSlack(errorData); // For critical errors
    }

    // For critical errors, you might want to send immediate alerts
    if (errorData.severity === "critical") {
      console.error("🚨 CRITICAL ERROR DETECTED:", errorData);
      // In production: send immediate alert to admin team
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error logging failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
