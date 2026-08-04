import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "mb.ai — Portal Layanan Akademik Dosen",
  description:
    "Kelola BKD, perwalian mahasiswa, dokumen SK, dan penelitian dengan bantuan asisten AI cerdas untuk dosen perguruan tinggi.",
  openGraph: {
    title: "mb.ai — Portal Layanan Akademik Dosen",
    description:
      "Kelola BKD, perwalian, dan penelitian dosen dalam satu portal cerdas.",
    type: "website",
    locale: "id_ID",
    siteName: "mb.ai",
  },
  twitter: {
    card: "summary",
    title: "mb.ai — Portal Layanan Akademik Dosen",
    description:
      "Kelola BKD, perwalian, dan penelitian dosen dalam satu portal cerdas.",
  },
  robots: { index: true, follow: true },
};

// ponytail: inline JSON-LD, no extra component
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "mb.ai",
  description:
    "Portal layanan akademik dan asisten AI untuk dosen perguruan tinggi.",
  applicationCategory: "EducationalApplication",
  operatingSystem: "Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${lexend.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
