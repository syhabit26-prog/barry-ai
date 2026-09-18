import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  generateLimiter,
  imageLimiter,
  model3DLimiter,
  chatLimiter,
} from "@/lib/ratelimit";

// Routes publiques (pas besoin d'être connecté)
const PUBLIC_ROUTES = [
  "/",
  "/signup",
  "/signin",
  "/blocked",
  "/about",
  "/contact",
  "/pricing",
  "/enterprise",
  "/entreprise",
];

// Routes protégées (auth obligatoire)
const PROTECTED_ROUTES = [
  "/builder",
  "/chat",
  "/agents",
  "/guide",
  "/connectors",
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // ═══════════════════════════════════════════════════════════
  // 1. RATE LIMITING (API)
  // ═══════════════════════════════════════════════════════════
  let limiter: any = null;
  let limitLabel = "";

  if (path.startsWith("/api/generate")) {
    limiter = generateLimiter;
    limitLabel = "Génération";
  } else if (path.startsWith("/api/pollinations")) {
    limiter = imageLimiter;
    limitLabel = "Image IA";
  } else if (path.startsWith("/api/tripo") || path.startsWith("/api/meshy")) {
    limiter = model3DLimiter;
    limitLabel = "3D";
  } else if (path.startsWith("/api/chat")) {
    limiter = chatLimiter;
    limitLabel = "Chat";
  }

  if (limiter) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    try {
      const { success, limit, remaining, reset } = await limiter.limit(ip);

      if (!success) {
        return new NextResponse(
          JSON.stringify({
            ok: false,
            error: `${limitLabel} : limite atteinte (${limit}/heure).`,
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const response = NextResponse.next();
      response.headers.set("X-RateLimit-Remaining", String(remaining));
      return response;
    } catch (err) {
      console.warn("Rate limit error:", err);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/generate/:path*",
    "/api/pollinations/:path*",
    "/api/tripo/:path*",
    "/api/meshy/:path*",
    "/api/chat/:path*",
  ],
};