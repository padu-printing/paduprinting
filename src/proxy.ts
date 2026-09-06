import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/|api/|.*\\.(?:png|ico|jpg|jpeg|svg|webp|gif|txt|css|js|woff2?)$))",
  ],
};
