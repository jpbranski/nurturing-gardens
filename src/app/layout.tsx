import React from 'react';
import type { Metadata } from 'next';
import ThemeRegistry from '@/components/layout/ThemeRegistry';
import { lora } from '@/lib/theme';

export const metadata: Metadata = {
  title: {
    default: 'Nurturing Gardens - Zone-Based Plant Discovery',
    template: '%s | Nurturing Gardens',
  },
  description:
    'Discover plants that work for your USDA hardiness zone, with a special focus on native and pollinator-friendly options. Your guide to sustainable, zone-appropriate gardening.',
  keywords: [
    'gardening',
    'native plants',
    'pollinator-friendly',
    'USDA hardiness zones',
    'sustainable gardening',
    'botanical guide',
  ],
  authors: [{ name: 'JP Branski', url: 'https://jpbranski.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Nurturing Gardens',
    title: 'Nurturing Gardens - Zone-Based Plant Discovery',
    description:
      'Discover plants for your USDA hardiness zone with a focus on native and pollinator-friendly options.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nurturing Gardens',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nurturing Gardens - Zone-Based Plant Discovery',
    description:
      'Discover plants for your USDA hardiness zone with a focus on native and pollinator-friendly options.',
    images: ['/og-image.jpg'],
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeRegistry>{children}</ThemeRegistry>
      </body>
    </html>
  );
}
