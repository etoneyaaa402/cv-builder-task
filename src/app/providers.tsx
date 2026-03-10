"use client";

import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useState } from "react";
import { CURRENT_USER_KEY, fetchCurrentUser } from "@/lib/hooks/useCurrentUser";

type Props = {
    children: ReactNode;
    locale: string;
    messages: Record<string, unknown>;
};

function SessionHydrator() {
    useQuery({
        queryKey: CURRENT_USER_KEY,
        queryFn: fetchCurrentUser,
        staleTime: Infinity,
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
