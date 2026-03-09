import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import type { SessionData } from "@/types/auth";

const BACKEND_URL =
    process.env.GRAPHQL_URL ?? "http://localhost:3001/api/graphql";

const REFRESH_MUTATION = `
    mutation UpdateToken {
        updateToken {
            access_token
            refresh_token
        }
    }
`;

// GraphQL endpoints always return HTTP 200, even for auth errors — the actual
// auth failure is communicated via the errors array. A 401 at HTTP level would
// indicate a non-GraphQL auth layer (e.g. reverse proxy), which also warrants
// a refresh attempt.
function isTokenExpiredError(
    status: number,
    body: { errors?: Array<{ message: string; extensions?: { code?: string } }> },
): boolean {
    if (status === 401) return true;
    return (
        body.errors?.some(
            (e) =>
                e.message === "Unauthorized" ||
                e.extensions?.code === "UNAUTHENTICATED",
        ) ?? false
    );
}

async function forwardToBackend(body: unknown, bearerToken?: string) {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (bearerToken) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
    }
    const response = await fetch(BACKEND_URL, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
    });
    const data = await response.json();
    return { status: response.status, data };
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const session = await getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);

    let { status, data } = await forwardToBackend(body, session.accessToken);

    if (isTokenExpiredError(status, data) && session.refreshToken) {
        // Access token expired — try to rotate using the refresh token.
        // The refresh endpoint expects the refresh token as the Bearer token.
        let refreshData: { data?: { updateToken?: { access_token: string; refresh_token: string } } };
        try {
            ({ data: refreshData } = await forwardToBackend(
                { query: REFRESH_MUTATION },
                session.refreshToken,
            ));
        } catch {
            return NextResponse.json(
                { errors: [{ message: "Service unavailable" }] },
                { status: 503 },
            );
        }

        const newAccessToken = refreshData?.data?.updateToken?.access_token;
        const newRefreshToken = refreshData?.data?.updateToken?.refresh_token;

        if (newAccessToken && newRefreshToken) {
            session.accessToken = newAccessToken;
            session.refreshToken = newRefreshToken;
            await session.save();

            // Retry original request with the fresh access token
            ({ status, data } = await forwardToBackend(body, newAccessToken));
        } else {
            // Refresh token is expired or revoked — destroy the session so the
            // proxy redirects the user to login on the next navigation.
            session.destroy();
            return NextResponse.json(
                { errors: [{ message: "Session expired. Please log in again." }] },
                { status: 401 },
            );
        }
    }

    return NextResponse.json(data, { status });
}
