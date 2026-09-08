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

export const metadata: Metadata = {
  title: 'NyayLink | AI Law Agent',
  description:
    'A clean chat-first AI law agent for Indian filing workflows and advocate review.',
  openGraph: {
    title: 'NyayLink | AI Law Agent',
    description:
      'Chat-first Indian legal filing workflows with advocate matching.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NyayLink | AI Law Agent',
    description:
      'Chat-first Indian legal filing workflows with advocate matching.',
    images: ['/og.png'],
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
