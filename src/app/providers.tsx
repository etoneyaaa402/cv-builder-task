"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useState } from "react";
import type { SessionUser } from "@/types/auth";

type Props = {
    children: ReactNode;
    locale: string;
    messages: Record<string, unknown>;
};

// Fetches the current user from iron-session on every fresh page load.
// Solves the TanStack cache eviction problem when a tab is closed and reopened.
async function fetchCurrentUser(): Promise<SessionUser | null> {
    const res = await fetch("/api/auth/me");
    if (!res.ok) return null;
    const { user } = await res.json();
    return user ?? null;
}

export const CURRENT_USER_KEY = ["currentUser"] as const;

function SessionHydrator() {
    // Runs once on mount; seeds the cache so all useCurrentUser() calls resolve immediately.
    useQuery({
        queryKey: CURRENT_USER_KEY,
        queryFn: fetchCurrentUser,
        staleTime: Infinity, // Don't refetch automatically — session is source of truth
        retry: false,
    });
    return null;
}

export function Providers({ children, locale, messages }: Props) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <QueryClientProvider client={queryClient}>
                    <SessionHydrator />
                    {children}
                </QueryClientProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
    );
}
