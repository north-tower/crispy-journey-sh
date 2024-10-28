// app/api/health/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  // Add any health checks here (database connection, etc.)
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
