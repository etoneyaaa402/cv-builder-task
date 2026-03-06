'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

const queryClient = new QueryClient();

type Props = {
  children: ReactNode;
  locale: string;
  messages: Record<string, any>;
};

export function Providers({ children, locale, messages }: Props) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}