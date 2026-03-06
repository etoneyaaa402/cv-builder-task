import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({requestLocale}) => {
  const locale = await requestLocale || 'en';
  let messages;
  try {
    const [mainMessages, authMessages] = await Promise.all([
      import(`@/messages/${locale}.json`),
      import(`@/messages/${locale}/auth.json`)
    ]);
    messages = {
      ...mainMessages.default,
      ...authMessages.default
    };
  } catch (error) {
    console.error(`Failed to load ${locale} messages:`, error);
    const fallbackMessages = await import(`@/messages/en.json`);
    messages = fallbackMessages.default;
  }

  return {
    locale,
    messages,
  };
});
