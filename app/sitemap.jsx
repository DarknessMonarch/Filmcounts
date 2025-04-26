export default async function sitemap() {
  const baseUrl = 'https://filmcounts.vercel.app/';
  
  const authRoutes = [
    '/authentication/login',
    '/authentication/verification',
    '/authentication/signup',
    '/authentication/reset',
    '/authentication/forgot',
    '/authentication/resetCode',
  ].map(path => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.8,
  }));
  
  const mainRoutes = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.9,
    },
  ];
  

  
  return [
    ...authRoutes,
    ...mainRoutes,
  ];
}