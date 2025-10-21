import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const performanceData = await request.json();

    // Log performance metrics for analysis
    console.log("Performance Metrics:", {
      type: performanceData.type,
      page: performanceData.page,
      endpoint: performanceData.endpoint,
      duration: performanceData.duration,
      success: performanceData.success,
      timestamp: new Date().toISOString(),
    });

    // In production, send to analytics service
    if (process.env.NODE_ENV === "production") {
      // Example: Send to Google Analytics, Mixpanel, or custom analytics
      // await sendToAnalytics(performanceData);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Performance logging failed:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
