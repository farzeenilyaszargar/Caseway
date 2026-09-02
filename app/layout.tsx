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
  title: 'NyayLink | Indian Legal Help',
  description:
    'A bilingual full-stack platform for Indian legal guidance, document workflows, and advocate consultation discovery.',
  openGraph: {
    title: 'NyayLink | Indian Legal Help',
    description:
      'Guided legal intake and Vakil Connect consultation discovery for Indian citizens.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NyayLink | Indian Legal Help',
    description:
      'Guided legal intake and advocate consultation discovery for Indian citizens.',
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
