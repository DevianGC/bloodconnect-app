import "./globals.css";
import ToastProvider from "./providers/ToastProvider";
import QueryProvider from "./providers/QueryProvider";
import BotpressWidget from "../components/BotpressWidget";

// Enhanced SEO Metadata
export const metadata = {
  metadataBase: new URL('https://bloodconnect-olongapo.vercel.app'),
  title: {
    default: 'BloodConnect Olongapo | Blood Donor Communication & Alert System',
    template: '%s | BloodConnect Olongapo',
  },
  description: 'Centralized blood donor communication and alert system for Olongapo City. Register as a donor, receive alerts, save lives.',
  keywords: [
    'blood donation',
    'blood donor',
    'Olongapo City',
    'blood bank',
    'emergency blood',
    'donate blood',
    'Philippines blood donation',
    'City Health Office',
    'blood type matching',
  ],
  authors: [{ name: 'BloodConnect Team' }],
  creator: 'BloodConnect Olongapo',
  publisher: 'City Health Office - Olongapo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_PH',
    url: 'https://bloodconnect-olongapo.vercel.app',
    siteName: 'BloodConnect Olongapo',
    title: 'BloodConnect Olongapo | Save Lives Through Blood Donation',
    description: 'Join the centralized blood donor network in Olongapo City. Register, receive alerts, and help save lives in your community.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'BloodConnect Olongapo - Blood Donation Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BloodConnect Olongapo | Blood Donor Alert System',
    description: 'Centralized blood donor communication system for Olongapo City. Every drop counts.',
    images: ['/twitter-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add when available
    // google: 'google-site-verification-code',
  },
  alternates: {
    canonical: 'https://bloodconnect-olongapo.vercel.app',
  },
  category: 'healthcare',
};

// Viewport configuration
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#DC2626' },
    { media: '(prefers-color-scheme: dark)', color: '#991B1B' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Preconnect to external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'BloodConnect Olongapo',
              description: 'Centralized blood donor communication and alert system for Olongapo City',
              url: 'https://bloodconnect-olongapo.vercel.app',
              logo: 'https://bloodconnect-olongapo.vercel.app/logo.png',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Olongapo City',
                addressRegion: 'Zambales',
                addressCountry: 'PH',
              },
              contactPoint: {
                '@type': 'ContactPoint',
                telephone: '+63-47-222-2222',
                contactType: 'customer service',
                availableLanguage: ['English', 'Filipino'],
              },
              sameAs: [
                'https://www.facebook.com/OlongapoCityHealthOffice',
              ],
            }),
          }}
        />
      </head>
      <body className="antialiased">
        <QueryProvider>
          <ToastProvider>
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:rounded-lg"
            >
              Skip to main content
            </a>
            <main id="main-content">
              {children}
            </main>
            <BotpressWidget />
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  );
}

