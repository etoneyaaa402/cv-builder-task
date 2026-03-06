"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { ReactNode, useState } from "react";

type Props = {
    children: ReactNode;
    locale: string;
    messages: Record<string, any>;
};

export function Providers({ children, locale, messages }: Props) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <NextIntlClientProvider locale={locale} messages={messages}>
                <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            </NextIntlClientProvider>
        </ThemeProvider>
    );
}
