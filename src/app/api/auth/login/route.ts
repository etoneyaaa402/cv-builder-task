import { NextRequest, NextResponse } from "next/server";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { SESSION_OPTIONS } from "@/lib/auth/tokens";
import type { SessionData } from "@/types/auth";

const BACKEND_URL =
    process.env.GRAPHQL_URL ?? "http://localhost:3001/api/graphql";

const LOGIN_QUERY = `
    query Login($auth: AuthInput!) {
        login(auth: $auth) {
            access_token
            refresh_token
            user {
                id
                email
                role
            }
        }
    }
`;

export async function POST(request: NextRequest) {
    let email: string, password: string;
    try {
        ({ email, password } = await request.json());
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    let gqlResponse: Response;
    try {
        gqlResponse = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: LOGIN_QUERY,
                variables: { auth: { email, password } },
            }),
        });
    } catch {
        return NextResponse.json({ error: "Service unavailable" }, { status: 503 });
    }

    const { data, errors } = await gqlResponse.json();

    if (errors?.length) {
        return NextResponse.json({ error: errors[0].message }, { status: 401 });
    }

    const { access_token, refresh_token, user } = data.login;

    const session = await getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
    session.user = { id: user.id, email: user.email, role: user.role };
    session.accessToken = access_token;
    session.refreshToken = refresh_token;
    await session.save();

    return NextResponse.json({ user });
}
