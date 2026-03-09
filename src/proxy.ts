import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest, NextResponse } from "next/server";
import { unsealData } from "iron-session";
import { routing } from "@/i18n/routing";
import { isPublicPath, canAccess } from "@/lib/auth/permissions";
import { ROLE_HOME } from "@/lib/constants/roles";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import type { SessionData } from "@/types/auth";

const intlMiddleware = createIntlMiddleware(routing);

// Extract the locale segment from the pathname (e.g. "/pl/profile" → "/pl").
// With localePrefix "as-needed", the default locale has no prefix, so this
// returns "" for default-locale paths and "/<locale>" for all others.
const nonDefaultLocales = routing.locales.filter((l) => l !== routing.defaultLocale);
const localePattern = new RegExp(`^\\/(${nonDefaultLocales.join("|")})(?=\\/|$)`);

function getLocalePrefix(pathname: string): string {
    const match = localePattern.exec(pathname);
    return match ? match[0] : "";
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const localePrefix = getLocalePrefix(pathname);
    const pathnameWithoutLocale = localePrefix
        ? pathname.slice(localePrefix.length) || "/"
        : pathname;

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

    // Cookie exists but session data is gone (e.g. corrupted payload) — purge it
    // and redirect to login so the user gets a clean state.
    if (cookieValue && !session.user) {
        const response = NextResponse.redirect(
            new URL(`${localePrefix}/login`, request.url),
        );
        response.cookies.delete(SESSION_OPTIONS.cookieName);
        return response;
    }

    const isAuthenticated = Boolean(session.user?.id);
    const isPublic = isPublicPath(pathnameWithoutLocale);

    if (!isAuthenticated && !isPublic) {
        return NextResponse.redirect(new URL(`${localePrefix}/login`, request.url));
    }

    if (isAuthenticated && isPublic) {
        const home = ROLE_HOME[session.user!.role];
        return NextResponse.redirect(new URL(`${localePrefix}${home}`, request.url));
    }

    if (isAuthenticated && !canAccess(pathnameWithoutLocale, session.user!.role)) {
        const home = ROLE_HOME[session.user!.role];
        return NextResponse.redirect(new URL(`${localePrefix}${home}`, request.url));
    }

    return intlMiddleware(request);
}

export const config = {
    // Exclude: Next.js internals, static files, and API routes (they handle their own auth)
    matcher: ["/((?!_next|_vercel|api|.*\\..*).*)"],
};
