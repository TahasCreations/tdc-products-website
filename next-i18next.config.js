module.exports = {
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en', 'de', 'fr', 'es', 'ar'],
    localeDetection: true,
  },
  fallbackLng: {
    default: ['tr'],
    en: ['en'],
    de: ['de'],
    fr: ['fr'],
    es: ['es'],
    ar: ['ar']
  },
  debug: process.env.NODE_ENV === 'development',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
}
