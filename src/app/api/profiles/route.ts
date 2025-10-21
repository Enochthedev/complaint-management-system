import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdmin, isServiceRoleConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  // GET /api/profiles request

  try {
    // Check if service role is configured
    if (!isServiceRoleConfigured()) {
      console.error("Service role configuration check failed:", {
        isServiceRoleConfigured: isServiceRoleConfigured(),
        serviceKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      });
      return NextResponse.json(
        { error: "Service role not configured" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin();

    const { searchParams } = new URL(request.url);
    const matricNumber = searchParams.get("matric");
    const email = searchParams.get("email");
    const userId = searchParams.get("userId");

    // Query params received

    // Validate that at least one parameter is provided
    if (!matricNumber && !email && !userId) {
      return NextResponse.json(
        { error: "Missing required parameter: matric, email, or userId" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("profiles").select("*");

    // Build query based on provided parameters
    if (matricNumber) {
      query = query.eq("matric_number", matricNumber);
    } else if (email) {
      query = query.eq("email", email);
    } else if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("GET /api/profiles - Database query error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ profile: data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : "UnknownError";

    console.error("GET /api/profiles - Unexpected error:", {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // POST /api/profiles request

  try {
    // Check if service role is configured
    if (!isServiceRoleConfigured()) {
      console.error("Service role configuration check failed:", {
        isServiceRoleConfigured: isServiceRoleConfigured(),
        serviceKeyExists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      });
      return NextResponse.json(
        { error: "Service role not configured" },
        { status: 500 }
      );
    }

    const supabaseAdmin = createSupabaseAdmin();

    const body = await request.json();
    const { matricNumber, email, userId } = body;

    // Request body validated

    // Validate that at least one parameter is provided
    if (!matricNumber && !email && !userId) {
      return NextResponse.json(
        { error: "Missing required parameter: matricNumber, email, or userId" },
        { status: 400 }
      );
    }

    let query = supabaseAdmin.from("profiles").select("*");

    // Build query based on provided parameters
    if (matricNumber) {
      query = query.eq("matric_number", matricNumber);
    } else if (email) {
      query = query.eq("email", email);
    } else if (userId) {
      query = query.eq("user_id", userId);
    }

    const { data, error } = await query.single();

    if (error) {
      console.error("POST /api/profiles - Database query error:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });

      if (error.code === "PGRST116") {
        // No rows found
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }
      throw error;
    }

    return NextResponse.json({ profile: data });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    const errorName = error instanceof Error ? error.name : "UnknownError";

    console.error("POST /api/profiles - Unexpected error:", {
      message: errorMessage,
      stack: errorStack,
      name: errorName,
    });
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
