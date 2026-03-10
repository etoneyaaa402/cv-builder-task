import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { gqlRequest } from "@/lib/api/backend";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import type { SessionData } from "@/types/auth";
import type { AuthResult } from "@/generated/graphql";

type AuthConfig = {
    query: string;
    resultKey: string;
    errorStatus: number;
};

export function createAuthHandler(config: AuthConfig) {
    return async function POST(request: NextRequest) {
        let email: string, password: string;
        try {
            ({ email, password } = await request.json());
        } catch {
            return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
        }

        if (typeof email !== "string" || typeof password !== "string") {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        email = email.trim();
        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
        }

        let result;
        try {
            result = await gqlRequest<Record<string, AuthResult>>({
                query: config.query,
                variables: { auth: { email, password } },
            });
        } catch {
            return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
        }

        if (result.data.errors?.length) {
            return NextResponse.json(
                { error: result.data.errors[0].message },
                { status: config.errorStatus },
            );
        }

        const { access_token, refresh_token, user } = result.data.data![config.resultKey];

        const session = await getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
        session.user = { id: user.id, email: user.email, role: user.role };
        session.accessToken = access_token;
        session.refreshToken = refresh_token;
        await session.save();

        return NextResponse.json({ user });
    };
}
