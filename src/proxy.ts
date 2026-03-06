import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import { routing } from "@/i18n/routing";
import { isPublicPath, canAccess } from "@/lib/auth/permissions";
import { ROLE_HOME } from "@/lib/constants/roles";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import type { SessionData } from "@/types/auth";

const intlMiddleware = createIntlMiddleware(routing);

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameWithoutLocale = pathname.replace(/^\/(en|pl)/, "") || "/";

    const cookieValue = request.cookies.get(SESSION_OPTIONS.cookieName)?.value;
    let session: Partial<SessionData> = {};
    if (cookieValue) {
        try {
            session = await unsealData<SessionData>(cookieValue, {
                password: process.env.SESSION_SECRET!,
            });
        } catch {
            // Tampered or expired cookie — treat as unauthenticated
        }
    }

    const isAuthenticated = Boolean(session.userId);
    const isPublic = isPublicPath(pathnameWithoutLocale);

    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (isAuthenticated && isPublic) {
        return NextResponse.redirect(new URL(ROLE_HOME[session.role!], request.url));
    }

    if (isAuthenticated && !canAccess(pathnameWithoutLocale, session.role!)) {
        return NextResponse.redirect(new URL(ROLE_HOME[session.role!], request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    // Exclude: Next.js internals, static files, and API routes (they handle their own auth)
    matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
