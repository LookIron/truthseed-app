import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TruthSeed - Verdades Bíblicas sobre tu Identidad',
  description:
    'Descubre verdades bíblicas sobre tu identidad en Cristo. Una PWA para reflexionar sobre quién eres en Cristo.',
  keywords: [
    'identidad en Cristo',
    'verdades bíblicas',
    'cristianismo',
    'devocional',
    'PWA',
  ],
  authors: [{ name: 'TruthSeed' }],
  creator: 'TruthSeed',
  publisher: 'TruthSeed',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TruthSeed',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    title: 'TruthSeed',
    description: 'Descubre verdades bíblicas sobre tu identidad en Cristo',
    siteName: 'TruthSeed',
  },
  twitter: {
    card: 'summary',
    title: 'TruthSeed',
    description: 'Descubre verdades bíblicas sobre tu identidad en Cristo',
  },
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="antialiased">
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          {children}
        </div>
      </body>
    </html>
  );
}
