import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : new URL('http://localhost:3000');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Caseway | Find Lawyers and AI Legal Help',
  description:
    'A clean chat-first AI legal assistance app for Indian filing workflows and advocate review.',
  icons: {
    icon: [
      {
        url: '/favicon.png',
        type: 'image/png',
      },
    ],
    shortcut: '/favicon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Caseway | Find Lawyers and AI Legal Help',
    description:
      'Chat-first Indian legal filing workflows with advocate matching.',
    images: [
      {
        url: '/caseway-og.jpg',
        width: 2592,
        height: 1806,
        alt: 'Caseway legal filing homepage with Lady Justice artwork',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caseway | Find Lawyers and AI Legal Help',
    description:
      'Chat-first Indian legal filing workflows with advocate matching.',
    images: [
      {
        url: '/caseway-og.jpg',
        alt: 'Caseway legal filing homepage with Lady Justice artwork',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
