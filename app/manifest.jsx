export default function manifest() {
  return {
    name: 'Filmcounts',
    short_name: 'Filmcounts',
    description: 'Manage your budgets well',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#F0F6F4',
    theme_color: '#2D3748',
    categories: ['finance', 'budget', 'money', 'assets', 'loan', 'requisition', 'bank'],
    
    icons: [
      {
        src: '/assets/logo.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/assets/logo.png',
        sizes: '384x384',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/assets/logo.png',
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any'
      },
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon'
      }
    ],
    
    prefer_related_applications: false,
    
    lang: 'en',
    dir: 'ltr',
    
    related_applications: [],
    shortcuts: [
      {
        name: 'Filmcounts',
        short_name: 'Filmcounts',
        description: 'Manage your budgets well',
        url: '/',
        icons: [{ src: '/assets/logo.png', sizes: '96x96' }]
      },

    ],
    
    screenshots: [
      {
        src: '/assets/banner.png',
        sizes: '1280x720',
        type: 'image/png',
        platform: 'wide',
        label: 'Home Screen'
      }
    ]
  }
}