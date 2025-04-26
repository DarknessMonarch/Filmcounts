export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/page/about',
          '/page/terms',
          '/page/contact',
          '/sitemap.xml', 
        ],
        disallow: [
          '/authentication/*',
          '/api/*',
          '/page/payment/*',
          '/page/settings/*',
          '/not-found',
          '/*.json$', 
          '/private/',
        ],
        crawlDelay: 2
      },
      {
        userAgent: 'GPTBot',
      },
      {
        userAgent: 'CCBot',
      }
    ],
    sitemap: 'https://filmcounts.vercel.app/sitemap.xml',
    host: 'https://filmcounts.vercel.app/'
  }
}