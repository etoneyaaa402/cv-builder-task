"use server";

import { redirect } from "next/navigation";
import { getSession } from "./tokens";
import { ROLE_HOME } from "@/lib/constants/roles";
import type { SessionData } from "@/types/auth";

export async function saveSession(data: SessionData) {
    const session = await getSession();
    session.userId = data.userId;
    session.role = data.role;
    session.accessToken = data.accessToken;
    session.refreshToken = data.refreshToken;
    await session.save();
}

export async function logout() {
    const session = await getSession();
    await session.destroy();
    redirect("/login");
}

export async function refreshSession(accessToken: string, refreshToken: string) {
    const session = await getSession();
    session.accessToken = accessToken;
    session.refreshToken = refreshToken;
    await session.save();
}
