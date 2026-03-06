import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';

export default createMiddleware(routing);
console.log('Middleware: routing =', routing);
export const config = {
  matcher: ['/', '/(pl|en)/:path*']
};

