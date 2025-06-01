
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { LanguageProvider } from '@/contexts/language-context'; // Import LanguageProvider

export const metadata: Metadata = {
  title: 'ProtocolPilot',
  description: 'Advanced Protocol Management Panel',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // LanguageProvider's useEffect will set lang and dir on document.documentElement
    <html lang="en" dir="ltr"> {/* Default values, will be updated by context */}
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* Using Noto Sans Arabic as a widely available font that supports Persian for demonstration.
            Replace with actual Iran Sans if hosted locally or via a specific CDN.
        */}
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      {/* The font-body class will be updated in globals.css or tailwind.config.ts based on language */}
      <body className="font-body antialiased">
        <LanguageProvider>
          {children}
          <Toaster />
        </LanguageProvider>
      </body>
    </html>
  );
}
