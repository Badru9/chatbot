import type { Metadata } from 'next';
import { Lexend } from 'next/font/google';
import './globals.css';
import Providers from './providers';

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
});

export const metadata: Metadata = {
  title: 'mb.ai - Portal Dosen',
  description: 'Personal Assistant Dosen Universitas',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      className={`${lexend.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className='min-h-full flex flex-col'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
