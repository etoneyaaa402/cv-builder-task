import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";
import type { SessionData } from "@/types/auth";

export const SESSION_OPTIONS: SessionOptions = {
    password: process.env.SESSION_SECRET!,
    cookieName: "cv_session",
    cookieOptions: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    },
};

export async function getSession() {
    return getIronSession<SessionData>(await cookies(), SESSION_OPTIONS);
}
