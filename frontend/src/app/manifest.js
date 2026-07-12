export default function manifest() {
  return {
    name: 'AutoMoto - Premium Vehicles',
    short_name: 'AutoMoto',
    description: 'Drive Your Dreams with AutoMoto premium vehicles and analytics.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#FF6500',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any maskable'
      }
    ],
  }
}
