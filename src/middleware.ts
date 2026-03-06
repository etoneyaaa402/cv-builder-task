import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { routing } from "@/i18n/routing";
import { isPublicPath, isAdminPath, canAccess } from "@/lib/auth/permissions";
import { ROLE_HOME } from "@/lib/constants/roles";
import type { SessionData } from "@/types/auth";

const SESSION_OPTIONS = {
    password: process.env.SESSION_SECRET!,
    cookieName: "cv_session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
    },
};

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const pathnameWithoutLocale = pathname.replace(/^\/(en|pl)/, "") || "/";

    const response = NextResponse.next();
    const session = await getIronSession<SessionData>(
        request.cookies,
        response.cookies,
        SESSION_OPTIONS,
    );

    const isAuthenticated = Boolean(session.userId);
    const isPublic = isPublicPath(pathnameWithoutLocale);

    if (!isAuthenticated && !isPublic) {
        const loginUrl = new URL("/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    if (isAuthenticated && isPublic) {
        const homeUrl = new URL(ROLE_HOME[session.role], request.url);
        return NextResponse.redirect(homeUrl);
    }

    if (isAuthenticated && !canAccess(pathnameWithoutLocale, session.role)) {
        const homeUrl = new URL(ROLE_HOME[session.role], request.url);
        return NextResponse.redirect(homeUrl);
    }

    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
