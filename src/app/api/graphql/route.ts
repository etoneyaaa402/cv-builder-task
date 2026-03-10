import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { gqlRequest, type GqlResponse } from "@/lib/api/backend";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import type { SessionData } from "@/types/auth";
import type { UpdateTokenResult } from "@/generated/graphql";
import { REFRESH_MUTATION } from "@/lib/graphql/operations/auth";

function isTokenExpiredError(status: number, body: GqlResponse): boolean {
    if (status === 401) return true;
    return (
        body.errors?.some(
            (e) => e.message === "Unauthorized" || e.extensions?.code === "UNAUTHENTICATED",
        ) ?? false
    );
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const session = await getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);

    let { status, data } = await gqlRequest(body, session.accessToken);

    if (isTokenExpiredError(status, data) && session.refreshToken) {
        let refreshResult: { updateToken?: UpdateTokenResult };
        try {
            const res = await gqlRequest<{ updateToken?: UpdateTokenResult }>(
                { query: REFRESH_MUTATION },
                session.refreshToken,
            );
            refreshResult = res.data?.data ?? {};
        } catch {
            return NextResponse.json(
                { errors: [{ message: "Service unavailable" }] },
                { status: 503 },
            );
        }

        const tokens = refreshResult.updateToken;

        if (tokens?.access_token && tokens?.refresh_token) {
            session.accessToken = tokens.access_token;
            session.refreshToken = tokens.refresh_token;
            await session.save();

            ({ status, data } = await gqlRequest(body, tokens.access_token));
        } else {
            session.destroy();
            return NextResponse.json(
                { errors: [{ message: "Session expired. Please log in again." }] },
                { status: 401 },
            );
        }
    }

    return NextResponse.json(data, { status });
}
