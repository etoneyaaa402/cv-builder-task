"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import { setAuthToken, clearAuthToken } from "@/lib/graphql/client";

type Props = {
    children: ReactNode;
    locale: string;
    messages: Record<string, unknown>;
    accessToken?: string;
};

export function Providers({ children, locale, messages, accessToken }: Props) {
    const [queryClient] = useState(() => new QueryClient());

    useEffect(() => {
        if (accessToken) {
            setAuthToken(accessToken);
        } else {
            clearAuthToken();
        }
    }, [accessToken]);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
    );
}
